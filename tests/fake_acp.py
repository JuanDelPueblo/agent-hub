"""Deterministic ACP peer for transport/lifecycle tests; no model or network calls."""
import json
import os
import pathlib
import sys
import time
import uuid

root = pathlib.Path(sys.argv[1])
mode = sys.argv[2] if len(sys.argv) >= 3 else "load"
can_load = mode != "no-load"
rich_capabilities = mode not in ("no-rich", "null-rich", "object-rich")
reject_config = mode == "reject-config"
slow_startup = mode == "slow-startup"
# Snapshot the received process environment beside the session file, so tests
# can prove exactly which variables one agent process observed.
dump_env = mode == "dump-env"
# Deterministic transient failure: succeeds at the transport level but omits
# the authoritative `configOptions`, so the backend must treat it as a retryable
# connection/start failure rather than a saved-config rejection.
transient_config = mode == "transient-config"
current = None
pending_prompt = None
model = "small"
current_mode = "ask"


def send(obj):
    print(json.dumps({"jsonrpc": "2.0", **obj}), flush=True)


def reply(id, result):
    send({"id": id, "result": result})


def options():
    return [{"id": "model", "name": "Model", "type": "select", "currentValue": model,
             "options": [{"value": "small", "name": "Small"}, {"value": "large", "name": "Large"}]},
            {"id": "web_search", "name": "Web search", "type": "boolean", "currentValue": False,
             "description": "Let the agent read pages from the web."}]


def modes():
    return {"currentModeId": current_mode,
            "availableModes": [{"id": "ask", "name": "Ask"}, {"id": "act", "name": "Act"}]}


def update(update_kind, **fields):
    send({"method": "session/update", "params": {"sessionId": current, "update": {"sessionUpdate": update_kind, **fields}}})


for line in sys.stdin:
    msg = json.loads(line)
    method, p, id = msg.get("method"), msg.get("params", {}), msg.get("id")
    if method == "initialize":
        if slow_startup:
            time.sleep(1.0)
        agent_capabilities = {"loadSession": can_load,
                              "sessionCapabilities": {"list": {}, "close": {}, "delete": {}}}
        # Stable ACP v1 prompt capabilities are top-level boolean fields;
        # sessionCapabilities is a separate lifecycle surface.
        if rich_capabilities:
            agent_capabilities["promptCapabilities"] = {
                "image": True, "audio": True, "embeddedContext": True}
        elif mode == "null-rich":
            agent_capabilities["promptCapabilities"] = None
        elif mode == "object-rich":
            # Deliberately malformed for typed-deserialization regression
            # coverage: objects must not be mistaken for true booleans.
            agent_capabilities["promptCapabilities"] = {
                "image": {}, "audio": {}, "embeddedContext": {}}
        reply(id, {"protocolVersion": 1, "agentCapabilities": agent_capabilities,
                   "agentInfo": {"name": "fake-acp", "version": "1.0.0"}, "authMethods": []})
    elif method == "session/new":
        if slow_startup:
            time.sleep(1.0)
        current = str(uuid.uuid4())
        (root / current).write_text("0")
        reply(id, {"sessionId": current, "configOptions": options(), "modes": modes()})
        if dump_env:
            (root / f"{current}.env.json").write_text(json.dumps(dict(os.environ)))
    elif method == "session/load":
        if slow_startup:
            time.sleep(1.0)
        current = p["sessionId"]
        if not (root / current).exists():
            send({"id": id, "error": {"code": -32001, "message": "Missing history"}})
        else:
            # Replay dynamic snapshots as live agents do during load. The
            # client must retain them in memory without duplicating durable
            # history: message chunks stay suppressed and config snapshots
            # must not add historical config events.
            update("available_commands_update", availableCommands=[
                {"name": "plan", "description": "Make a plan", "input": {"hint": "goal"}},
                {"name": "review", "description": "Review changes"}])
            update("current_mode_update", currentModeId=current_mode)
            update("usage_update", used=100, size=2000, cost={"amount": 0.5, "currency": "USD"})
            update("config_option_update", configOptions=options())
            update("agent_message_chunk", content={"type": "text", "text": "REPLAY"})
            reply(id, {"configOptions": options(), "modes": modes()})
    elif method == "session/set_config_option":
        if reject_config:
            send({"id": id, "error": {"code": -32002, "message": "Rejected saved option"}})
        elif transient_config:
            # No `configOptions`: the backend reports a transient reapply failure.
            reply(id, {"unexpected": True})
        else:
            # Boolean options carry `type: boolean`; select options are bare ids.
            if isinstance(p.get("value"), str):
                model = p["value"]
            reply(id, {"configOptions": options()})
    elif method == "session/list":
        reply(id, {"sessions": [{"sessionId": f.name, "cwd": str(root)} for f in root.iterdir() if f.is_file()]})
    elif method == "session/close":
        reply(id, {})
    elif method == "session/delete":
        target = p.get("sessionId")
        try:
            (root / target).unlink(missing_ok=True)
        except Exception:
            pass
        reply(id, {})
    elif method == "session/set_mode":
        current_mode = p.get("modeId", current_mode)
        reply(id, {})
    elif method == "$/cancel_request":
        # Protocol-level cancellation is advisory; ignore per spec.
        pass
    elif method == "session/cancel":
        if pending_prompt is not None:
            reply(pending_prompt, {"stopReason": "cancelled"})
            pending_prompt = None
    elif method == "session/prompt":
        text = "\n".join(block.get("text", "") for block in p["prompt"] if block.get("type") == "text")
        count = int((root / current).read_text()) + 1
        (root / current).write_text(str(count))
        if text == "wait":
            pending_prompt = id
        elif text == "rpc-error":
            send({"id": id, "error": {"code": -32003, "message": "Prompt failed"}})
        elif text == "permission":
            pending_prompt = id
            send({"id": "permission-1", "method": "session/request_permission", "params": {
                "sessionId": current, "toolCall": {"toolCallId": "tool-1", "title": "Write file", "kind": "edit"},
                "options": [{"optionId": "yes", "name": "Approve", "kind": "allow_once"},
                            {"optionId": "no", "name": "Deny", "kind": "reject_once"}]}})
        elif text.startswith("title:"):
            new_title = text[6:]
            update("session_info_update", title=new_title)
            update("agent_message_chunk", content={"type": "text", "text": "title-sent"})
            reply(id, {"stopReason": "end_turn"})
        elif text == "title-empty":
            update("session_info_update", title="")
            update("agent_message_chunk", content={"type": "text", "text": "empty-title-sent"})
            reply(id, {"stopReason": "end_turn"})
        elif text == "title-oversized":
            update("session_info_update", title="x" * 500)
            update("agent_message_chunk", content={"type": "text", "text": "oversized-title-sent"})
            reply(id, {"stopReason": "end_turn"})
        elif text == "commands":
            update("available_commands_update", availableCommands=[
                {"name": "plan", "description": "Make a plan", "input": {"hint": "goal"}},
                {"name": "review", "description": "Review changes"}])
            update("agent_message_chunk", content={"type": "text", "text": "commands-sent"})
            reply(id, {"stopReason": "end_turn"})
        elif text == "modes":
            update("current_mode_update", currentModeId="act")
            update("agent_message_chunk", content={"type": "text", "text": "mode-sent"})
            reply(id, {"stopReason": "end_turn"})
        elif text == "usage":
            update("usage_update", used=100, size=2000, cost={"amount": 0.5, "currency": "USD"})
            update("agent_message_chunk", content={"type": "text", "text": "usage-sent"})
            reply(id, {"stopReason": "end_turn"})
        elif text == "message-id":
            update("agent_message_chunk", content={"type": "text", "text": "part-1 "}, messageId="m1")
            update("agent_message_chunk", content={"type": "text", "text": "part-2"}, messageId="m1")
            update("agent_message_chunk", content={"type": "text", "text": "next"}, messageId="m2")
            reply(id, {"stopReason": "end_turn"})
        elif text == "rich-output":
            update("agent_message_chunk", content={"type": "text", "text": "before"}, messageId="rich-1")
            update("agent_message_chunk", content={"type": "resource_link", "name": "Pueblo", "uri": "https://example.test/pueblo"}, messageId="rich-1")
            update("agent_thought_chunk", content={"type": "resource", "resource": {"uri": "attachment://note.txt", "mimeType": "text/plain", "text": "private note"}}, messageId="thought-1")
            reply(id, {"stopReason": "end_turn"})
        elif text == "user-chunk":
            # Agent-reflected user chunk must not duplicate local history.
            update("user_message_chunk", content={"type": "text", "text": text})
            update("agent_message_chunk", content={"type": "text", "text": "user-chunk-sent"})
            reply(id, {"stopReason": "end_turn"})
        elif text.startswith("identity:"):
            # Echo the client-generated user message identity from `_meta`
            # so the round trip can be correlated. Other prompts omit the
            # echo entirely, exercising agents that ignore the extension.
            observed = p.get("_meta", {}).get("puebloHub", {}).get("userMessageId")
            update("agent_message_chunk", content={"type": "text", "text": f"identity:{observed}"})
            if observed is None:
                reply(id, {"stopReason": "end_turn"})
            else:
                reply(id, {"stopReason": "end_turn",
                           "_meta": {"puebloHub": {"userMessageId": observed}}})
        elif text == "tool-loc":
            update("tool_call", toolCallId="t1", title="Edit", kind="edit",
                   locations=[{"path": "/tmp/a.rs", "line": 3}])
            update("agent_message_chunk", content={"type": "text", "text": "loc-sent"})
            reply(id, {"stopReason": "end_turn"})
        elif text == "tool-rich":
            update("tool_call", toolCallId="rich-tool", title="Inspect", kind="read",
                   content=[
                       {"type": "content", "content": {"type": "text", "text": "summary"}},
                       {"type": "content", "content": {"type": "resource_link", "name": "Pueblo", "uri": "https://example.test/tool"}},
                       {"type": "content", "content": {"type": "image", "data": "iVBORw0KGgo=", "mimeType": "image/png"}},
                   ])
            reply(id, {"stopReason": "end_turn"})
        else:
            update("agent_message_chunk", content={"type": "text", "text": f"{current}:{count}:{model}"})
            reply(id, {"stopReason": "end_turn"})
    elif id == "permission-1" and pending_prompt is not None:
        choice = msg.get("result", {}).get("outcome", {}).get("optionId", "cancelled")
        update("agent_message_chunk", content={"type": "text", "text": choice})
        reply(pending_prompt, {"stopReason": "end_turn"})
        pending_prompt = None

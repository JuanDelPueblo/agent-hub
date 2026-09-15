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


def send(obj):
    print(json.dumps({"jsonrpc": "2.0", **obj}), flush=True)


def reply(id, result):
    send({"id": id, "result": result})


def options():
    return [{"id": "model", "name": "Model", "type": "select", "currentValue": model,
             "options": [{"value": "small", "name": "Small"}, {"value": "large", "name": "Large"}]}]


def update(kind, **fields):
    send({"method": "session/update", "params": {"sessionId": current, "update": {"sessionUpdate": kind, **fields}}})


for line in sys.stdin:
    msg = json.loads(line)
    method, p, id = msg.get("method"), msg.get("params", {}), msg.get("id")
    if method == "initialize":
        if slow_startup:
            time.sleep(1.0)
        reply(id, {"protocolVersion": 1, "agentCapabilities": {"loadSession": can_load,
                   "sessionCapabilities": {"list": {}, "close": {}}}})
    elif method == "session/new":
        if slow_startup:
            time.sleep(1.0)
        current = str(uuid.uuid4())
        (root / current).write_text("0")
        if dump_env:
            (root / f"{current}.env.json").write_text(json.dumps(dict(os.environ)))
        reply(id, {"sessionId": current, "configOptions": options()})
    elif method == "session/load":
        if slow_startup:
            time.sleep(1.0)
        current = p["sessionId"]
        if not (root / current).exists():
            send({"id": id, "error": {"code": -32001, "message": "Missing history"}})
        else:
            update("agent_message_chunk", content={"type": "text", "text": "REPLAY"})
            reply(id, {"configOptions": options()})
    elif method == "session/set_config_option":
        if reject_config:
            send({"id": id, "error": {"code": -32002, "message": "Rejected saved option"}})
        elif transient_config:
            # No `configOptions`: the backend reports a transient reapply failure.
            reply(id, {"unexpected": True})
        else:
            model = p["value"]
            reply(id, {"configOptions": options()})
    elif method == "session/list":
        reply(id, {"sessions": [{"sessionId": f.name, "cwd": str(root)} for f in root.iterdir() if f.is_file()]})
    elif method == "session/close":
        reply(id, {})
    elif method == "session/cancel":
        if pending_prompt is not None:
            reply(pending_prompt, {"stopReason": "cancelled"})
            pending_prompt = None
    elif method == "session/prompt":
        text = p["prompt"][0]["text"]
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
        else:
            update("agent_message_chunk", content={"type": "text", "text": f"{current}:{count}:{model}"})
            reply(id, {"stopReason": "end_turn"})
    elif id == "permission-1" and pending_prompt is not None:
        choice = msg.get("result", {}).get("outcome", {}).get("optionId", "cancelled")
        update("agent_message_chunk", content={"type": "text", "text": choice})
        reply(pending_prompt, {"stopReason": "end_turn"})
        pending_prompt = None

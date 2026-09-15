// Minimal RFC 6455 server. It supports the frames that Batey uses:
// text, ping, pong and close. It has no dependencies, so the fake backend
// runs with plain `node` and never changes the frontend lock file.

import { createHash } from 'node:crypto';

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

const OPCODE_CONTINUATION = 0x0;
const OPCODE_TEXT = 0x1;
const OPCODE_CLOSE = 0x8;
const OPCODE_PING = 0x9;
const OPCODE_PONG = 0xa;

/** One connected browser. */
class FakeSocket {
  constructor(rawSocket) {
    this.raw = rawSocket;
    this.open = true;
    this.onMessage = () => {};
    this.onClose = () => {};
  }

  send(text) {
    if (!this.open) return;
    this.raw.write(encodeFrame(OPCODE_TEXT, Buffer.from(text, 'utf8')));
  }

  close() {
    if (!this.open) return;
    this.open = false;
    this.raw.write(encodeFrame(OPCODE_CLOSE, Buffer.alloc(0)));
    this.raw.end();
  }
}

/**
 * Completes the handshake and returns a FakeSocket.
 * The caller sets `onMessage` and `onClose`.
 */
export function upgrade(request, rawSocket, head) {
  const key = request.headers['sec-websocket-key'];
  if (!key) {
    rawSocket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    return null;
  }

  const accept = createHash('sha1')
    .update(key + GUID)
    .digest('base64');

  rawSocket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
      'Upgrade: websocket\r\n' +
      'Connection: Upgrade\r\n' +
      `Sec-WebSocket-Accept: ${accept}\r\n` +
      '\r\n',
  );
  rawSocket.setNoDelay(true);

  const socket = new FakeSocket(rawSocket);

  // A TCP read carries any number of whole or partial frames. The buffer
  // keeps the remainder until the rest of a frame arrives.
  let buffer = head && head.length ? Buffer.from(head) : Buffer.alloc(0);
  // A message can arrive in several fragments.
  let fragments = [];
  let fragmentOpcode = null;

  rawSocket.on('data', (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);

    for (;;) {
      const frame = decodeFrame(buffer);
      if (!frame) break;
      buffer = buffer.subarray(frame.length);

      if (frame.opcode === OPCODE_CLOSE) {
        socket.open = false;
        rawSocket.end(encodeFrame(OPCODE_CLOSE, Buffer.alloc(0)));
        return;
      }
      if (frame.opcode === OPCODE_PING) {
        rawSocket.write(encodeFrame(OPCODE_PONG, frame.payload));
        continue;
      }
      if (frame.opcode === OPCODE_PONG) continue;

      if (frame.opcode === OPCODE_CONTINUATION) {
        fragments.push(frame.payload);
      } else {
        fragments = [frame.payload];
        fragmentOpcode = frame.opcode;
      }

      if (!frame.fin) continue;

      const payload = Buffer.concat(fragments);
      fragments = [];
      if (fragmentOpcode === OPCODE_TEXT) {
        socket.onMessage(payload.toString('utf8'));
      }
      fragmentOpcode = null;
    }
  });

  const finish = () => {
    if (!socket.open) return;
    socket.open = false;
    socket.onClose();
  };
  rawSocket.on('close', finish);
  rawSocket.on('end', finish);
  rawSocket.on('error', finish);

  return socket;
}

/** Builds an unmasked server frame. A server never masks its payload. */
function encodeFrame(opcode, payload) {
  const length = payload.length;
  let header;

  if (length < 126) {
    header = Buffer.alloc(2);
    header[1] = length;
  } else if (length < 65536) {
    header = Buffer.alloc(4);
    header[1] = 126;
    header.writeUInt16BE(length, 2);
  } else {
    header = Buffer.alloc(10);
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(length), 2);
  }
  header[0] = 0x80 | opcode; // FIN plus the opcode.

  return Buffer.concat([header, payload]);
}

/** Reads one frame, or returns null while the frame is incomplete. */
function decodeFrame(buffer) {
  if (buffer.length < 2) return null;

  const fin = (buffer[0] & 0x80) !== 0;
  const opcode = buffer[0] & 0x0f;
  const masked = (buffer[1] & 0x80) !== 0;
  let length = buffer[1] & 0x7f;
  let offset = 2;

  if (length === 126) {
    if (buffer.length < offset + 2) return null;
    length = buffer.readUInt16BE(offset);
    offset += 2;
  } else if (length === 127) {
    if (buffer.length < offset + 8) return null;
    const big = buffer.readBigUInt64BE(offset);
    if (big > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('WebSocket frame is too large');
    length = Number(big);
    offset += 8;
  }

  let maskKey = null;
  if (masked) {
    if (buffer.length < offset + 4) return null;
    maskKey = buffer.subarray(offset, offset + 4);
    offset += 4;
  }

  if (buffer.length < offset + length) return null;

  const payload = Buffer.from(buffer.subarray(offset, offset + length));
  if (maskKey) {
    for (let index = 0; index < payload.length; index += 1) {
      payload[index] ^= maskKey[index % 4];
    }
  }

  return { fin, opcode, payload, length: offset + length };
}

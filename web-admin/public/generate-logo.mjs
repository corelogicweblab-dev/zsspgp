import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import zlib from "zlib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WIDTH = 128;
const HEIGHT = 128;

function crc32(buf) {
  let c = 0xffffffff;
  const table = crc32.table ?? (crc32.table = makeCrcTable());
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  const crcData = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(crcData));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

const raw = Buffer.alloc((WIDTH * 4 + 1) * HEIGHT);
let offset = 0;
for (let y = 0; y < HEIGHT; y++) {
  raw[offset++] = 0;
  for (let x = 0; x < WIDTH; x++) {
    const cx = x - WIDTH / 2;
    const cy = y - HEIGHT / 2;
    const dist = Math.sqrt(cx * cx + cy * cy);
    const inCircle = dist < 52;
    const inRing = dist >= 44 && dist < 52;
    let r = 255;
    let g = 255;
    let b = 255;
    if (inRing) {
      r = 29;
      g = 78;
      b = 216;
    } else if (inCircle) {
      r = 37;
      g = 99;
      b = 235;
    }
    raw[offset++] = r;
    raw[offset++] = g;
    raw[offset++] = b;
    raw[offset++] = 255;
  }
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(WIDTH, 0);
ihdr.writeUInt32BE(HEIGHT, 4);
ihdr[8] = 8;
ihdr[9] = 6;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const compressed = zlib.deflateSync(raw, { level: 9 });
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", compressed),
  chunk("IEND", Buffer.alloc(0)),
]);

const outPath = path.join(__dirname, "zamboangasibugaylogo.png");
fs.writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${png.length} bytes)`);

// Uso: node scripts/fake-cube-video.cjs <stato54> out.y4m  → video per Chromium --use-file-for-fake-video-capture
// Video finto: 6 facce di un cubo mescolato, 5 s ciascuna, nell'ordine F R B L U D.
const fs = require('fs')
const [state] = process.argv.slice(2)
const W = 320, H = 240, FPS = 5, SEC = 5
const PHOTO = { U: [225, 205, 45], D: [230, 228, 220], F: [185, 30, 45], B: [235, 105, 35], R: [25, 150, 80], L: [25, 75, 175] }
const FACES = 'URFDLB', ORDER = 'FRBLUD'
const out = fs.openSync(process.argv[3], 'w')
fs.writeSync(out, `YUV4MPEG2 W${W} H${H} F${FPS}:1 Ip A1:1 C420jpeg\n`)
const size = Math.min(W, H) * 0.7, x0 = (W - size) / 2, y0 = (H - size) / 2, cell = size / 3
for (const f of ORDER) {
  const k = FACES.indexOf(f), cols = [...state.slice(k * 9, k * 9 + 9)].map((c, i) => PHOTO[c].map((v) => v * (0.85 + 0.05 * (i % 3))))
  const Y = Buffer.alloc(W * H), U = Buffer.alloc(W * H / 4), V = Buffer.alloc(W * H / 4)
  const rgbAt = (x, y) => {
    if (x < x0 - 10 || y < y0 - 10 || x >= x0 + size + 10 || y >= y0 + size + 10) return [90, 110, 120]
    const cx = Math.floor((x - x0) / cell), cy = Math.floor((y - y0) / cell)
    if (cx < 0 || cy < 0 || cx > 2 || cy > 2) return [15, 15, 15]
    const lx = (x - x0) % cell, ly = (y - y0) % cell
    if (lx < 4 || ly < 4 || lx > cell - 4 || ly > cell - 4) return [15, 15, 15]
    return cols[cy * 3 + cx]
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const [r, g, b] = rgbAt(x, y)
    Y[y * W + x] = Math.round(0.299 * r + 0.587 * g + 0.114 * b)
    if (x % 2 === 0 && y % 2 === 0) {
      U[(y / 2) * (W / 2) + x / 2] = Math.round(128 - 0.168736 * r - 0.331264 * g + 0.5 * b)
      V[(y / 2) * (W / 2) + x / 2] = Math.round(128 + 0.5 * r - 0.418688 * g - 0.081312 * b)
    }
  }
  for (let n = 0; n < FPS * SEC; n++) { fs.writeSync(out, 'FRAME\n'); fs.writeSync(out, Y); fs.writeSync(out, U); fs.writeSync(out, V) }
}
fs.closeSync(out)

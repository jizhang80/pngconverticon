export function readUInt32BE(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset] << 24) >>> 0) |
    (bytes[offset + 1] << 16) |
    (bytes[offset + 2] << 8) |
    bytes[offset + 3]
  );
}

export async function resizePNG(
  file: File,
  maxSize = 256,
): Promise<Uint8Array> {
  const imageBitmap = await createImageBitmap(file);
  const size = Math.min(maxSize, imageBitmap.width, imageBitmap.height);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(imageBitmap, 0, 0, size, size);

  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob(resolve as any, "image/png"),
  );

  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

export function createICO(pngBytes: Uint8Array): Uint8Array {
  const width = readUInt32BE(pngBytes, 16);
  const height = readUInt32BE(pngBytes, 20);

  const icoWidth = width >= 256 ? 0 : width;
  const icoHeight = height >= 256 ? 0 : height;

  const headerSize = 6 + 16;
  const icoBuffer = new ArrayBuffer(headerSize + pngBytes.length);
  const view = new DataView(icoBuffer);
  const out = new Uint8Array(icoBuffer);
  let offset = 0;

  // ICONDIR
  view.setUint16(offset, 0, true);
  offset += 2;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, 1, true);
  offset += 2;

  // ICONDIRENTRY
  view.setUint8(offset++, icoWidth);
  view.setUint8(offset++, icoHeight);
  view.setUint8(offset++, 0);
  view.setUint8(offset++, 0);
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, 32, true);
  offset += 2;
  view.setUint32(offset, pngBytes.length, true);
  offset += 4;
  view.setUint32(offset, headerSize, true);
  offset += 4;

  out.set(pngBytes, headerSize);
  return out;
}

export function downloadICO(data: Uint8Array, filename: string) {
  const blob = new Blob([data], { type: "image/x-icon" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

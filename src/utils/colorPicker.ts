

export function getColorAt(ctx: CanvasRenderingContext2D, x: number, y: number) {
  var pixelData = ctx.getImageData(x, y, 1, 1).data;
  return `rgba(${pixelData[0]},${pixelData[1]},${pixelData[2]},${pixelData[3]/255})`;
}
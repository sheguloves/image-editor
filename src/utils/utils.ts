export const getCanvas = (ref: React.MutableRefObject<HTMLCanvasElement | null>) => {
  return ref.current!;
}

export const getCtx = (canvas: HTMLCanvasElement) => {
  return canvas.getContext('2d', { willReadFrequently: true })!;
}

export function getColorAt(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const imageData = ctx.getImageData(x, y, 1, 1);
  const pixelData = imageData.data;
  return `rgba(${pixelData[0]},${pixelData[1]},${pixelData[2]},${pixelData[3]/255})`;
}

export function getExtendImageData(oriImageData: ImageData, ctx: CanvasRenderingContext2D) {
  const { width, height } = oriImageData;
  const offsetHeight = height - 180;
  const offset = width * offsetHeight * 4;
  const gap = width * 50 * 4;

  const imageData = ctx.createImageData(width, height + 50, {
    colorSpace: oriImageData.colorSpace,
  });
  let i = 0, len = imageData.data.length;
  while(i < (offset + gap)) {
    imageData.data[i] = oriImageData.data[i];
    i++;
  }

  while(i < len) {
    imageData.data[i] = oriImageData.data[i - gap];
    i++;
  }
  console.log(oriImageData);
  console.log(imageData);
  return imageData;

}
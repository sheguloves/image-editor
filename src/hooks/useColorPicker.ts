import { useEffect } from "react";
import { useOperationState, usePickedColorState } from "../store/stores";
import { getColorAt, getCtx } from "../utils/utils";

const listenClick = (canvas: HTMLCanvasElement,  callback: (...args: any[])=> void) => {
  const handler = (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    const ctx = getCtx(canvas);
    const rgba = getColorAt(ctx, offsetX, offsetY);
    callback(rgba);
  }
  canvas.addEventListener('click', handler);
  return () => {
    canvas.removeEventListener('click', handler!);
  };
}

export default function useColorPicker(canvasRef: React.MutableRefObject<HTMLCanvasElement | null>) {

  const { operation } = useOperationState(state => state);
  const { setColor } = usePickedColorState(state => state);

  let callback = () => {};
  useEffect(() => {
    if (operation === 'colorPicker') {
      callback = listenClick(canvasRef.current!, setColor);
    }
    return callback;
  }, [operation]);

}
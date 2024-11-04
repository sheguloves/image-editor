import { useEffect } from "react";
import { useOperationState, usePickedColorState } from "../store/stores";
import { getCtx } from "../utils/utils";

function listenEraser(canvas: HTMLCanvasElement, strokeStyle: string, weight: number = 1) {
  let start = false;
  let inside = true;
  const mouseDownHandler = () => {
    lastPoint = null;
    start = true;
  }
  const mouseUpHandler = () => {
    start = false;
  }

  let lastPoint: {
    x: number;
    y: number;
  } | null = null;

  const mouseMoveHandler = (e: MouseEvent) => {
    if (start && inside) {
      const { offsetX, offsetY } = e;
      if (lastPoint) {
        const ctx = getCtx(canvas);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = weight;
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        ctx.closePath();
      }

      lastPoint = {
        x: offsetX,
        y: offsetY
      };
    }
  }
  const mouseoutHandler = () => {
    inside = false;
    lastPoint = null;
  }
  const mouseenterHandler = () => {
    inside = true;
  }
  canvas.addEventListener('mouseout', mouseoutHandler);
  canvas.addEventListener('mouseenter', mouseenterHandler);
  canvas.addEventListener('mousedown', mouseDownHandler);
  canvas.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);

  return () => {
    canvas.removeEventListener('mouseout', mouseoutHandler);
    canvas.removeEventListener('mouseenter', mouseenterHandler);
    canvas.removeEventListener('mousedown', mouseDownHandler);
    canvas.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  }
}

export default function useEraser(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const operation = useOperationState(state => state.operation);
  const { color } = usePickedColorState(state => state);

  let callback = () => {};

  useEffect(() => {
    if (operation === 'eraser') {
      callback = listenEraser(canvasRef.current!, color);
    }
    return callback;
  }, [operation]);
}
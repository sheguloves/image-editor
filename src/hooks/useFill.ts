import { useEffect } from "react";
import { useFileState, useOperationState, usePickedColorState, useScaleState } from "../store/stores";
import { getCtx } from "../utils/utils";

const createLastRect = (x: number, y: number, width: number, height: number, parentDom: HTMLElement) => {
  const div = document.createElement('div');
  div.style.border = '1px dotted #fff';
  div.style.position = 'absolute';
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  div.style.width = `${width}px`;
  div.style.height = `${height}px`;
  lastRect = div;
  parentDom.appendChild(div);
}

let lastRect: HTMLDivElement | null = null;

const clearLastRect = () => {
  if (lastRect) {
    lastRect.parentElement?.removeChild(lastRect);
  }
}

const listenFill = (canvas: HTMLCanvasElement, color: string, scale: number) => {
  const parentDom = canvas.parentElement!;

  let x1 = 0, y1 = 0;
  let start = false;
  const mouseDownHandler = (e: MouseEvent) => {
    const rect = parentDom.getBoundingClientRect();
    x1 = e.pageX - rect.left;
    y1 = e.pageY - rect.top;
    if (lastRect) {
      clearLastRect();
    }
    createLastRect(x1, y1, 1, 1, parentDom);
    start = true;
  }
  const mouseMoveHandler = (e: MouseEvent) => {
    if (start) {
      const rect = parentDom.getBoundingClientRect();
      const x2 = e.pageX - rect.left;
      const y2 = e.pageY - rect.top;
      if (lastRect) {
        lastRect.style.left = `${x2 > x1 ? x1 : x2}px`;
        lastRect.style.top = `${y2 > y1 ? y1: y2}px`;
        lastRect.style.width = `${Math.abs(x1 - x2)}px`;
        lastRect.style.height = `${Math.abs(y1 - y2)}px`;
      }
    }
  }
  const mouseUpHandler = () => {
    start = false;
    if (lastRect) {
      fillRect(canvas, lastRect.getBoundingClientRect(), color, scale);
      clearLastRect();
    }
  }

  parentDom.addEventListener('mousedown', mouseDownHandler);
  parentDom.addEventListener('mousemove', mouseMoveHandler);
  parentDom.addEventListener('mouseup', mouseUpHandler);

  return () => {
    parentDom.removeEventListener('mousedown', mouseDownHandler);
    parentDom.removeEventListener('mousemove', mouseMoveHandler);
    parentDom.removeEventListener('mouseup', mouseUpHandler);
  }
}

function fillRect(canvas: HTMLCanvasElement, rect: DOMRect, color: string, scale: number) {
  const canvasRect = canvas.getBoundingClientRect();
  const ctx = getCtx(canvas);

  if (ctx) {
    const x = (rect.x - canvasRect.x) / scale;
    const y = (rect.y - canvasRect.y) / scale;
    const width = rect.width / scale;
    const height = rect.height / scale;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
}

export default function useFill(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const operation = useOperationState(state => state.operation);
  const { color } = usePickedColorState(state => state);
  const { file } = useFileState(state => state);
  const { scale } = useScaleState(state => state);

  useEffect(() => {
    clearLastRect();
  }, [file]);

  let callback = () => {};

  useEffect(() => {
    if (operation === 'fill') {
      callback = listenFill(canvasRef.current!, color, scale);
    } else {
      clearLastRect();
    }
    return callback;
  }, [operation, color, scale]);
}
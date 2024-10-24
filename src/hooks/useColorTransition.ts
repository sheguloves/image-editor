import { useEffect } from "react";
import { useFileState, useOperationState, useScaleState } from "../store/stores";

type DIRECTION = 'horizontal' | 'vertical';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

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

const addTransitionEventHandler = (container: HTMLElement, canvas: HTMLCanvasElement, direction: DIRECTION, scale: number) => {
  let x1 = 0, y1 = 0;
  let start = false;
  const mouseDownHandler = (e: MouseEvent) => {
    const rect = container.getBoundingClientRect();
    x1 = e.pageX - rect.left;
    y1 = e.pageY - rect.top;
    if (lastRect) {
      clearLastRect();
    }
    createLastRect(x1, y1, 1, 1, container);
    start = true;
  }
  const mouseMoveHandler = (e: MouseEvent) => {
    if (start) {
      const rect = container.getBoundingClientRect();
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
      const rect = getFillRect(canvas, lastRect.getBoundingClientRect());
      if (rect) {
        const result = confirm(`确定要将区域颜色${direction === 'vertical' ? '垂直' : '水平'}过渡吗?`);
        if (result) {
          fillRect(canvas, rect, direction, scale);
          clearLastRect();
        }
      }
    }
  }

  container.addEventListener('mousedown', mouseDownHandler);
  container.addEventListener('mousemove', mouseMoveHandler);
  container.addEventListener('mouseup', mouseUpHandler);

  return () => {
    container.removeEventListener('mousedown', mouseDownHandler);
    container.removeEventListener('mousemove', mouseMoveHandler);
    container.removeEventListener('mouseup', mouseUpHandler);
  }
}

function getFillRect(canvas: HTMLCanvasElement, rect: DOMRect): Rect | null {
  let { left, right, top, bottom } = rect;
  const canvasRect = canvas.getBoundingClientRect();

  if (left > canvasRect.right
    || right < canvasRect.left
    || bottom < canvasRect.top
    || top > canvasRect.bottom) {
    return null;
  }

  left = left < canvasRect.left ? canvasRect.left : left;
  right = right > canvasRect.right ? canvasRect.right : right;
  top = top < canvasRect.top ? canvasRect.top : top;
  bottom = bottom > canvasRect.bottom ? canvasRect.bottom : bottom;

  const width = right - left;
  const height = bottom - top;
  if (width === 0 || height === 0) {
    return null;
  }
  return {
    x: left - canvasRect.left,
    y: top - canvasRect.top,
    width,
    height,
  }
}

function _verticalTransition(canvas: HTMLCanvasElement, rect: Rect, scale: number) {

}

function _horizontalTransition(canvas: HTMLCanvasElement, rect: Rect, scale: number) {
  const ctx = canvas.getContext('2d')!;
  const [ x, y, width, height ] = [
    Math.round(rect.x / scale), Math.round(rect.y / scale),
    Math.round(rect.width / scale), Math.round(rect.height / scale)];
  const oriImageData = ctx.getImageData(x, y, width, height);
  const result = ctx.createImageData(width, height, {
    colorSpace: oriImageData.colorSpace,
  });

  for (let h = 0; h < height; h++) {
    const rowBegin = h * width;
    const i = rowBegin * 4;
    const [ls, lr, lg, lb] = [
      oriImageData.data[i], oriImageData.data[i + 1],
      oriImageData.data[i + 2], oriImageData.data[i + 3]];

    const rowEnd = rowBegin + width - 1;
    const j = rowEnd * 4;
    const [rs, rr, rg, rb] = [
      oriImageData.data[j], oriImageData.data[j + 1],
      oriImageData.data[j + 2], oriImageData.data[j + 3]];
    const sstep = (rs - ls) / width;
    const rstep = (rr - lr) / width;
    const gstep = (rg - lg) / width;
    const bstep = (rb - lb) / width;
    for (let ind = 0; ind < width - 1; ind++) {
      result.data[i + ind * 4] = Math.round(ls + ind * sstep);
      result.data[i + ind * 4 + 1] = Math.round(lr + ind * rstep);
      result.data[i + ind * 4 + 2] = Math.round(lg + ind * gstep);
      result.data[i + ind * 4 + 3] = Math.round(lb + ind * bstep);
      // result.data[ind * 4] = 255;
      // result.data[ind * 4 + 1] = 255;
      // result.data[ind * 4 + 2] = 255;
      // result.data[ind * 4 + 3] = 255;
    }
    result.data[j] = rs;
    result.data[j + 1] = rr;
    result.data[j + 2] = rg;
    result.data[j + 3] = rb;
  }
  console.log(oriImageData);
  console.log(result);
  // ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
  ctx.putImageData(result, x, y);
}

function fillRect(canvas: HTMLCanvasElement, rect: Rect, direction: DIRECTION, scale: number) {
  switch(direction) {
    case 'horizontal':
      _horizontalTransition(canvas, rect, scale);
      break;
    case 'vertical':
      _verticalTransition(canvas, rect, scale);
      break;
  }
}

export default function useColorTransition(container: React.RefObject<HTMLElement>, canvasRef: React.RefObject<HTMLCanvasElement>) {
  const operation = useOperationState(state => state.operation);
  const { file } = useFileState(state => state);
  const { scale } = useScaleState(state => state);

  useEffect(() => {
    clearLastRect();
  }, [file]);

  let callback = () => {};

  useEffect(() => {
    if (operation === 'transition-x' || operation === 'transition-y') {
      const direction = operation === 'transition-y' ? 'vertical' : 'horizontal';
      callback = addTransitionEventHandler(container.current!, canvasRef.current!, direction, scale);
    } else {
      clearLastRect();
    }
    return callback;
  }, [operation, scale]);
}
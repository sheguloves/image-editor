import { useEffect } from "react";
import { useFileState, useOperationState, useScaleState } from "../store/stores";
import { getCtx } from "../utils/utils";

type DIRECTION = 'horizontal' | 'vertical';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
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

const listenTransition = (container: HTMLElement, canvas: HTMLCanvasElement, direction: DIRECTION, scale: number) => {
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
        fillRect(canvas, rect, direction, scale);
        clearLastRect();
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

function scaleRect(rect: Rect, scale: number) {
  rect.x = Math.round(rect.x / scale);
  rect.y = Math.round(rect.y / scale);
  rect.width = Math.round(rect.width / scale);
  rect.height = Math.round(rect.height / scale);
}

function getStepedColor(color: Color, step: Color, endColor: Color) {
  return {
    r: getStepColorItem(color.r, step.r, endColor.r),
    g: getStepColorItem(color.g, step.g, endColor.g),
    b: getStepColorItem(color.b, step.b, endColor.b),
    a: getStepColorItem(color.a, step.a, endColor.a),
  }
}

function getStepColorItem(color: number, step: number, limit = 255) {
  let result = color + step;
  if (step > 0) {
    result = result > limit ? limit : result;
  } else if (step < 0) {
    result = result < limit ? limit : result;
  }
  result = Math.round(result)
  if (result < 0) {
    result = 0;
  } else if (result > 255) {
    result = 255;
  }
  return result;
}

function patchColorData(imageData: ImageData, index: number, color: Color) {
  const { r, g, b, a} = color;
  [ imageData.data[index],
    imageData.data[index + 1],
    imageData.data[index + 2],
    imageData.data[index + 3]] = [r, g, b, a];
}


function _verticalTransition(canvas: HTMLCanvasElement, rect: Rect) {
  const ctx = getCtx(canvas);
  const { x, y, width, height } = rect;
  const oriImageData = ctx.getImageData(x, y, width, height);
  const result = ctx.createImageData(width, height, {
    colorSpace: oriImageData.colorSpace,
  });

  for(let col = 0; col < width; col++) {
    const colorBeginIndex = col * 4;
    const colorEndIndex = width * (height - 1) * 4 + colorBeginIndex;
    const beginColor = {
      r: oriImageData.data[colorBeginIndex],
      g: oriImageData.data[colorBeginIndex + 1],
      b: oriImageData.data[colorBeginIndex + 2],
      a: oriImageData.data[colorBeginIndex + 3]
    }
    const endColor = {
      r: oriImageData.data[colorEndIndex],
      g: oriImageData.data[colorEndIndex + 1],
      b: oriImageData.data[colorEndIndex + 2],
      a: oriImageData.data[colorEndIndex + 3]
    }
    const stepColor = {
      r: (endColor.r - beginColor.r) / height,
      g: (endColor.g - beginColor.g) / height,
      b: (endColor.b - beginColor.b) / height,
      a: (endColor.a - beginColor.a) / height,
    }
    console.log(stepColor, beginColor, endColor);
    let currentColor = { ...beginColor };
    patchColorData(result, colorBeginIndex, beginColor);
    for(let row = 1; row < height; row++) {
      currentColor = getStepedColor(currentColor, stepColor, endColor);
      patchColorData(result, colorBeginIndex + (row * width * 4), currentColor);
    }
  }
  ctx.putImageData(result, x, y);
}

function _horizontalTransition(canvas: HTMLCanvasElement, rect: Rect) {
  const ctx = getCtx(canvas);
  const { x, y, width, height } = rect;
  const oriImageData = ctx.getImageData(x, y, width, height);
  const result = ctx.createImageData(width, height, {
    colorSpace: oriImageData.colorSpace,
  });

  for (let row = 0; row < height; row++) {
    const colorBeginIndex = row * width * 4;
    const beginColor = {
      r: oriImageData.data[colorBeginIndex],
      g: oriImageData.data[colorBeginIndex + 1],
      b: oriImageData.data[colorBeginIndex + 2],
      a: oriImageData.data[colorBeginIndex + 3]
    }
    const colorEndIndex = colorBeginIndex + (width - 1) * 4;
    const endColor = {
      r: oriImageData.data[colorEndIndex],
      g: oriImageData.data[colorEndIndex + 1],
      b: oriImageData.data[colorEndIndex + 2],
      a: oriImageData.data[colorEndIndex + 3]
    }
    const stepColor = {
      r: (endColor.r - beginColor.r) / width,
      g: (endColor.g - beginColor.g) / width,
      b: (endColor.b - beginColor.b) / width,
      a: (endColor.a - beginColor.a) / width,
    }
    console.log(stepColor);
    let currentColor = { ...beginColor };
    patchColorData(result, colorBeginIndex, beginColor);
    for (let col = 1; col < width; col++) {
      currentColor = getStepedColor(currentColor, stepColor, endColor);
      patchColorData(result, colorBeginIndex + (col * 4), currentColor);
    }
  }
  ctx.putImageData(result, x, y);
}

function fillRect(canvas: HTMLCanvasElement, rect: Rect, direction: DIRECTION, scale: number) {
  scaleRect(rect, scale);
  switch(direction) {
    case 'horizontal':
      _horizontalTransition(canvas, rect);
      break;
    case 'vertical':
      _verticalTransition(canvas, rect);
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
      callback = listenTransition(container.current!, canvasRef.current!, direction, scale);
    } else {
      clearLastRect();
    }
    return callback;
  }, [operation, scale]);
}
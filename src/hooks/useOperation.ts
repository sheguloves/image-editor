import { useEffect } from "react";
import { useFileState, useOperationState, usePickedColorState } from "../store/stores";
import { getColorAt, getCtx } from "../utils/utils";

let weight = 5;

function addEraserEventHandler(dom: HTMLCanvasElement, strokeStyle: string) {
  let start = false;
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
    if (start) {
      const { offsetX, offsetY } = e;
      if (lastPoint) {
        const ctx = dom.getContext('2d')!;
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
    start = false;
  }
  dom.addEventListener('mouseout', mouseoutHandler);
  dom.addEventListener('mousedown', mouseDownHandler);
  dom.addEventListener('mousemove', mouseMoveHandler);
  dom.addEventListener('mouseup', mouseUpHandler);

  return () => {
    dom.removeEventListener('mouseout', mouseoutHandler);
    dom.removeEventListener('mousedown', mouseDownHandler);
    dom.removeEventListener('mousemove', mouseMoveHandler);
    dom.removeEventListener('mouseup', mouseUpHandler);
  }
}

const addColorPickerEventHandler = (dom: HTMLCanvasElement, callback: (...args: any[]) => void) => {
  const handler = (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    const ctx = getCtx(dom);
    const rgba = getColorAt(ctx, offsetX, offsetY);
    callback(rgba);
  }
  dom.addEventListener('click', handler);
  return () => {
    dom.removeEventListener('click', handler!);
  };
}

const clearLastRect = () => {
  if (lastRect) {
    lastRect.parentElement?.removeChild(lastRect);
  }
}

const createLastRect = (x: number, y: number, width: number, height: number, parentDom: HTMLElement) => {
  const div = document.createElement('div');
  // div.style.background = '#777';
  div.style.border = '1px solid #000';
  div.style.position = 'absolute';
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  div.style.width = `${width}px`;
  div.style.height = `${height}px`;
  lastRect = div;
  parentDom.appendChild(div);
}

let lastRect: HTMLDivElement | null = null;

const addAlingEventHandler = (dom: HTMLCanvasElement) => {
  // console.log('start');
  const parentDom = dom.parentElement!;
  const rect = parentDom.getBoundingClientRect();
  let x1 = 0, y1 = 0;
  let start = false;
  const mouseDownHandler = (e: MouseEvent) => {
    x1 = e.clientX - rect.left;
    y1 = e.clientY - rect.top;
    if (!lastRect) {
      createLastRect(x1, y1, 1, 1, parentDom);
    }
    start = true;
  }
  const mouseMoveHandler = (e: MouseEvent) => {
    if (start) {
      const x2 = e.clientX - rect.x;
      const y2 = e.clientY - rect.top;
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

export default function useOperation(domRef: React.RefObject<HTMLElement>) {
  const operation = useOperationState(state => state.operation);
  const { color, setColor } = usePickedColorState(state => state);

  let callback = () => {};

  useEffect(() => {
    if (operation !== 'align') {
      clearLastRect();
    }
    switch(operation) {
      case "colorPicker":
        callback = addColorPickerEventHandler(domRef.current! as HTMLCanvasElement, setColor)
        break;
      case "eraser":
        callback = addEraserEventHandler(domRef.current! as HTMLCanvasElement, color);
        break;
      case "align":
        callback = addAlingEventHandler(domRef.current! as HTMLCanvasElement);
        break;
      default:
        break;
    }
    return callback;
  }, [operation]);
}
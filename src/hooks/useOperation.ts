import { useEffect } from "react";
import { useOperationState, usePickedColorState } from "../store/stores";
import { getColorAt } from "../utils/colorPicker";

let weight = 5;


function addDrawEventHandler(dom: HTMLCanvasElement, strokeStyle: string) {
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

  dom.addEventListener('mousedown', mouseDownHandler);
  dom.addEventListener('mousemove', mouseMoveHandler);
  dom.addEventListener('mouseup', mouseUpHandler);

  return () => {
    dom.removeEventListener('mousedown', mouseDownHandler);
    dom.removeEventListener('mousemove', mouseMoveHandler);
    dom.removeEventListener('mouseup', mouseUpHandler);
  }
}

export default function useOperation(domRef: React.RefObject<HTMLElement>) {
  const operation = useOperationState(state => state.operation);
  const { color, setColor } = usePickedColorState(state => state);

  let callback = () => {};

  useEffect(() => {
    switch(operation) {
      case "colorPicker":
        const handler = (event: MouseEvent) => {
          const { offsetX, offsetY } = event;
          const ctx = (domRef.current as HTMLCanvasElement).getContext('2d')!;
          const rgba = getColorAt(ctx, offsetX, offsetY);
          setColor(rgba);
        }
        domRef.current?.addEventListener('click', handler);
        callback = () => {
          domRef.current?.removeEventListener('click', handler!);
        };
        break;
      case "eraser":
        callback = addDrawEventHandler(domRef.current! as HTMLCanvasElement, color);
        break;
      default:
        break;
    }
    return callback;
  }, [operation]);
}
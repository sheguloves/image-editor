import { useEffect } from "react";
import { useFileState, useOperationState, usePickedColorState } from "../store/stores";
import { getColorAt } from "../utils/colorPicker";

let weight = 5;
let lastTransform = {
  x: 0,
  y: 0,
};

function addMoveHandler(dom: HTMLCanvasElement) {
  const parentDom = dom.parentElement!;
  let start = false;
  const mouseDownHandler = () => {
    lastPoint = null;
    start = true;
  }
  const mouseUpHandler = () => {
    start = false;
    let transform = parentDom.style.transform;
    transform = transform.replace('translate(', '');
    transform = transform.replace(/px/ig, '');
    transform = transform.replace(')', '');
    const [ offsetX, offsetY ] = transform.split(',');
    lastTransform = {
      x: parseInt(offsetX),
      y: parseInt(offsetY),
    };

    console.log(lastTransform);
  }

  let lastPoint: {
    x: number;
    y: number;
  } | null = null;

  const mouseMoveHandler = (e: MouseEvent) => {
    if (start) {
      const { pageX, pageY } = e;

      if (lastPoint) {
        const offsetX = pageX - lastPoint.x + lastTransform.x;
        const offsetY = pageY - lastPoint.y + lastTransform.y;
        parentDom.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      } else {
        lastPoint = {
          x: pageX,
          y: pageY
        };
      }
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
  const file = useFileState(state => state.file);

  useEffect(() => {
    lastTransform = {
      x: 0,
      y: 0,
    };
  }, [file]);

  let callback = () => {};

  useEffect(() => {
    switch(operation) {
      case 'move':
        callback = addMoveHandler(domRef.current! as HTMLCanvasElement);
        break;
      case "colorPicker":
        const handler = (event: MouseEvent) => {
          const { offsetX, offsetY } = event;
          console.log( offsetX, offsetY);
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
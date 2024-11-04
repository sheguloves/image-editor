import { useEffect } from "react";
import { useFileState, useOperationState } from "../store/stores";

let lastTransform = {
  x: 0,
  y: 0
};

let inside = false;

function listenMove(listener: HTMLElement, mover: HTMLElement) {
  let start = false;
  let lastPoint: {
    x: number;
    y: number;
  } | null = null;

  const mouseDownHandler = () => {
    lastPoint = null;
    start = true;

    console.log('mouseUpHandler', 'start', start, 'inside', inside);
  }
  const mouseUpHandler = () => {
    start = false;
    let x = mover.style.left.replace('px', '');
    let y = mover.style.top.replace('px', '');
    lastTransform = {
      x: parseInt(x),
      y: parseInt(y),
    };
    console.log('mouseUpHandler', 'start', start, 'inside', inside);
  }

  const mouseMoveHandler = (e: MouseEvent) => {
    if (start && inside) {
      const { pageX, pageY } = e;
      if (lastPoint) {
        const left = pageX - lastPoint.x + lastTransform.x;
        const top = pageY - lastPoint.y + lastTransform.y;
        mover.style.left = `${left}px`;
        mover.style.top = `${top}px`;
      } else {
        lastPoint = {
          x: pageX,
          y: pageY
        };
      }
    }
    console.log('mouseMoveHandler', 'start', start, 'inside', inside);
  }

  const mouseoutHandler = () => {
    inside = false;
    lastPoint = null;
    console.log('mouseoutHandler', 'start', start, 'inside', inside);
  }

  const mouseenterHandler = () => {
    inside = true;
    console.log('mouseenterHandler', 'start', start, 'inside', inside);
  }

  listener.addEventListener('mouseout', mouseoutHandler);
  listener.addEventListener('mouseenter', mouseenterHandler);
  listener.addEventListener('mousedown', mouseDownHandler);
  listener.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);

  return () => {
    listener.removeEventListener('mouseout', mouseoutHandler);
    listener.removeEventListener('mouseenter', mouseenterHandler);
    listener.removeEventListener('mousedown', mouseDownHandler);
    listener.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  }
}

export default function useMove(eventListener: React.RefObject<HTMLDivElement>,
  mover: React.RefObject<HTMLCanvasElement>) {
  const operation = useOperationState(state => state.operation);
  const { file } = useFileState(state => state);

  let callback = () => {};

  useEffect(() => {
    if (file) {
      if (operation === 'move') {
        callback = listenMove(eventListener.current!, mover.current!);
      }
    } else {
      mover.current!.style.left = '0px';
      mover.current!.style.top = '0px';
    }
    return callback;
  }, [operation, file]);
}
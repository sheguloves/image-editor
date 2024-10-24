import { useEffect } from "react";
import { useFileState, useOperationState, useScaleState } from "../store/stores";

let lastTransform = {
  x: 0,
  y: 0
};

function addMoveHandler(listener: HTMLElement, mover: HTMLElement, scale: number) {
  let start = false;
  let lastPoint: {
    x: number;
    y: number;
  } | null = null;

  const mouseDownHandler = () => {
    lastPoint = null;
    start = true;
  }
  const mouseUpHandler = () => {
    start = false;
    let x = mover.style.left.replace('px', '');
    let y = mover.style.top.replace('px', '');
    lastTransform = {
      x: parseInt(x),
      y: parseInt(y),
    };
  }

  const mouseMoveHandler = (e: MouseEvent) => {
    if (start) {
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
  }

  const mouseoutHandler = () => {
    // mouseUpHandler();
  }
  listener.addEventListener('mouseout', mouseoutHandler);
  listener.addEventListener('mousedown', mouseDownHandler);
  listener.addEventListener('mousemove', mouseMoveHandler);
  listener.addEventListener('mouseup', mouseUpHandler);

  return () => {
    listener.removeEventListener('mouseout', mouseoutHandler);
    listener.removeEventListener('mousedown', mouseDownHandler);
    listener.removeEventListener('mousemove', mouseMoveHandler);
    listener.removeEventListener('mouseup', mouseUpHandler);
  }
}

export default function useMove(eventListener: React.RefObject<HTMLDivElement>,
  mover: React.RefObject<HTMLCanvasElement>) {
  const operation = useOperationState(state => state.operation);
  const { file } = useFileState(state => state);
  const { scale } = useScaleState(state => state);

  let callback = () => {};

  useEffect(() => {
    if (operation === 'move') {
      if (file) {
        callback = addMoveHandler(eventListener.current!, mover.current!, scale);
      } else {
        mover.current!.style.left = '0px';
        mover.current!.style.top = '0px';
      }
    }
    return callback;
  }, [operation, file]);
}
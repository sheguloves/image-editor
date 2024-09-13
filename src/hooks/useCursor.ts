import { useEffect } from "react";
import { useOperationState } from "../store/stores";

const cursorClasses = [
  'colorPicker',
  'eraser',
  'move',
]

export default function useCursor(dom: HTMLElement = document.body) {

  const { operation, setOperation } = useOperationState(state => state);

  useEffect(() => {
    let cursorClass = 'move';
    switch(operation) {
      case 'colorPicker':
        cursorClass = 'colorPicker';
        break;
      case 'eraser':
        cursorClass = 'eraser';
        break;
      default:
        cursorClass = 'move';
        break
    }

    const classList = cursorClasses.filter(item => item !== cursorClass);
    dom.classList.remove(...classList);
    if (cursorClass) {
      dom.classList.add(cursorClass);
    }
  }, [operation]);

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        setOperation('move');
      }
    }
    document.addEventListener('keydown', keydownHandler);
    return () => {
      document.removeEventListener('keydown', keydownHandler);
    }
  }, [])

}
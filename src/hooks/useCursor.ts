import { useEffect } from "react";
import { useOperationState } from "../store/stores";


export default function useCursor() {

  const { operation, setOperation } = useOperationState(state => state);

  useEffect(() => {
    let cursor = 'auto';
    switch(operation) {
      case 'colorPicker':
        cursor = 'crosshair';
        break;
      default:
        cursor = 'auto';
    }

    const body = document.body;
    body.style.cursor = cursor;
  }, [operation]);

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        setOperation('');
      }
    }
    document.addEventListener('keydown', keydownHandler);
    return () => {
      document.removeEventListener('keydown', keydownHandler);
    }
  }, [])

}
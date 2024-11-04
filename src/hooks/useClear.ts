import { useEffect } from "react";
import useEvents from "./useEvents";
import { useFileState, useScaleState } from "../store/stores";

export default function useClear() {
  const { on, off } = useEvents();
  const { setScale } = useScaleState(state => state);
  const { setFile } = useFileState(state => state);

  useEffect(() => {
    const clearHandler = () => {
      setScale(1);
      setFile(null);
    }
    on('clear', clearHandler);
    return () => {
      off('clear', clearHandler);
    }
  }, []);
}
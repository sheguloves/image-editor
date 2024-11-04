import { useEffect } from "react";
import { useScaleState } from "../store/stores";

export default function useScale(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const { scale } = useScaleState(state => state);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.style.scale = `${scale}`;
  }, [scale]);
}
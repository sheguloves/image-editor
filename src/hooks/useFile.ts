import { useEffect } from "react";
import { getCtx } from "../utils/utils";
import { useFileState } from "../store/stores";

export default function useFile(canvasRef: React.RefObject<HTMLCanvasElement | null>) {

  const { file } = useFileState(state => state);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = getCtx(canvas);
    if (file) {
      const img = new Image();
      img.onload = function() {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx?.drawImage(img, 0, 0);
      }
      img.src = URL.createObjectURL(file);
    } else {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      canvas.height = 0;
      canvas.width = 0;
    }
  }, [file]);
}
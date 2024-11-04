import { useEffect } from "react";
import { useFileState } from "../store/stores";
import saveAs from "file-saver";
import useEvents from "./useEvents";

export default function useExport(canvasRef: React.RefObject<HTMLCanvasElement | null>) {

  const { on, off } = useEvents();
  const { file } = useFileState(state => state);

  useEffect(() => {
    const exportImage = () => {
      const canvas = canvasRef.current!;
      if (file) {
        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, file.name);
          }
        });
      }
    };

    on('export', exportImage);
    return () => {
      off('export', exportImage)
    }
  }, [file])
}
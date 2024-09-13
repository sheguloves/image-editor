import { useEffect, useRef } from "react";
import { useFileState, useScaleState } from "../store/stores"
import useOperation from "../hooks/useOperation";
import useEvents from "../hooks/useEvents";
import { saveAs } from 'file-saver';
import "./canvas.css";
import { getExtendImageData } from "../utils/utils";

export default function Canvas() {

  const { file, setFile } = useFileState(state => state);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backupCanvasRef = useRef<HTMLCanvasElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const { on, off } = useEvents();

  const scale = useScaleState(state => state.scale);

  useOperation(canvasRef);

  useEffect(() => {
    const clearHandler = () => {
      const zoomDom = zoomRef.current!;
      zoomDom.style.scale = '1';
      zoomDom.style.transform = '';
      setFile(null);
    }
    on('clear', clearHandler);
    return () => {
      off('clear', clearHandler);
    }
  }, []);

  useEffect(() => {
    const splitHandler = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const imageData = getExtendImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), ctx);
      const backupCanvas = backupCanvasRef.current!;
      const backCtx = backupCanvas.getContext('2d');
      backupCanvas.height = imageData.height;
      backupCanvas.width = imageData.width;
      backCtx?.putImageData(imageData, 0, 0);
    }
    on('split', splitHandler);
    return () => {
      off('split', splitHandler);
    }
  }, []);

  useEffect(() => {
    const zoomDom = zoomRef.current!;
    zoomDom.style.scale = `${scale}`;
  }, [scale]);

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

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    if (file) {
      const img = new Image();
      img.onload = function() {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx?.drawImage(img, 0, 0);
        ctx?.setTransform(1, 0, 0, 1, 0, 0);
      }
      img.src = URL.createObjectURL(file);
    } else {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [file]);

  return (
    <div className="canvas-container">
      <div className="canvas-layer" ref={zoomRef}>
        <canvas ref={canvasRef}></canvas>
        <canvas ref={backupCanvasRef}></canvas>
      </div>
    </div>
  )
}
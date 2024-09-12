import { useEffect, useRef } from "react";
import { useFileState } from "../store/stores"
import useOperation from "../hooks/useOperation";
import useEvents from "../hooks/useEvents";
import { saveAs } from 'file-saver';

export default function Canvas() {

  const file = useFileState(state => state.file);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { on, off } = useEvents();

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

  useOperation(canvasRef);

  useEffect(() => {
    on('export', exportImage);
    return () => {
      off('export', exportImage)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
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
    }
  }, [file]);

  return (
    <div className="canvas">
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}
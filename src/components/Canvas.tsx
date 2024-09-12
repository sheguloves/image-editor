import { useEffect, useRef, useState } from "react";
import { useFileStore } from "../store/fileStore"

export default function Canvas() {

  const file = useFileStore(state => state.file);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ imgSrc, setImgSrc ] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    if (file) {
      const img = new Image();
      // img.width = canvas.width;
      // img.height = canvas.height;
      img.onload = function() {
        console.log(img.width, img.height);
        canvas.height = img.height;
        canvas.width = img.width;
        ctx?.drawImage(img, 0, 0);
      }
      setImgSrc(URL.createObjectURL(file));
      img.src = URL.createObjectURL(file);
    } else {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }

  }, [file]);

  return (
    <div className="canvas">
      {/* <img src={imgSrc}></img> */}
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}
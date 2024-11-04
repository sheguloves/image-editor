import { useRef } from "react";
import "./canvas.css";
import useCursor from "../hooks/useCursor";
import useFill from "../hooks/useFill";
import useMove from "../hooks/useMove";
import useColorTransition from "../hooks/useColorTransition";
import useColorPicker from "../hooks/useColorPicker";
import useEraser from "../hooks/useEraser";
import useScale from "../hooks/useScale";
import useExport from "../hooks/useExport";
import useClear from "../hooks/useClear";
import useFile from "../hooks/useFile";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const operationLayerRef = useRef<HTMLDivElement>(null);

  useColorPicker(canvasRef);
  useEraser(canvasRef);
  useCursor(operationLayerRef);
  useFill(canvasRef);
  useMove(operationLayerRef, canvasRef);
  useColorTransition(operationLayerRef, canvasRef);
  useScale(canvasRef);
  useExport(canvasRef);
  useClear();
  useFile(canvasRef);

  return (
    <div className="canvas-container" ref={operationLayerRef}>
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}
import { Button } from "antd";
import { useFileState, useScaleState } from "../store/stores";
import useEvents from "../hooks/useEvents";
import "./toolbar.css";

export default function Toolbar() {

  const { file, setFile } = useFileState(state => state);
  const { emit } = useEvents();
  const setScale = useScaleState(state => state.setScale);

  const importImage = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.visibility = 'hidden';
    fileInput.accept = '.png,.jpg';
    fileInput.onchange = function(e: Event) {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setFile(file);
    }
    fileInput.click();
  }

  return (
    <div className="toolbar">
      <Button onClick={importImage}>Import Image</Button>
      <Button disabled={!file} onClick={() => {
        emit('export');
      }}>Export Image</Button>
      <Button disabled={!file} onClick={() => {
        emit('clear');
      }}>Clear</Button>
      <Button disabled={!file} onClick={() => {
        setScale(1.2);
      }}>Zoom In</Button>
      <Button disabled={!file} onClick={() => {
        setScale(0.8);
      }}>Zoom Out</Button>
      <Button disabled={!file} onClick={() => {
        emit('split');
      }}>Split & Concat</Button>
    </div>
  )
}
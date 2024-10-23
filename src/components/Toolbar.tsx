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
      <Button onClick={importImage}>导入图片</Button>
      <Button disabled={!file} onClick={() => {
        emit('export');
      }}>导出图片</Button>
      <Button disabled={!file} onClick={() => {
        emit('clear');
      }}>清除</Button>
      <Button disabled={!file} onClick={() => {
        setScale((scale) => scale + 0.1);
      }}>放大</Button>
      <Button disabled={!file} onClick={() => {
        setScale((scale) => scale - 0.1);
      }}>缩小</Button>
      {/* <Button disabled={!file} onClick={() => {
        emit('split');
      }}>Split & Concat</Button> */}
    </div>
  )
}
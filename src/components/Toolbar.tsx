import { Button } from "antd";
import { useFileState } from "../store/stores";
import useEvents from "../hooks/useEvents";

export default function Toolbar() {

  const setFile = useFileState(state => state.setFile);
  const { emit } = useEvents();

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

  const exportImage = () => {
    emit('export');
  }

  return (
    <div className="toolbar">
      <Button onClick={importImage}>导入图片</Button>
      <Button onClick={exportImage}>导出图片</Button>
    </div>
  )
}
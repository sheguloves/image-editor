import { Button } from "antd";
import { useFileStore } from "../store/fileStore";

export default function Toolbar() {

  const setFile = useFileStore(state => state.setFile);

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
    </div>
  )
}
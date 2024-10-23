import { Button } from "antd";
import { OperationType, useFileState, useOperationState, usePickedColorState } from "../store/stores";
import "./tools.css";

export default function Tools() {

  const { operation, setOperation } = useOperationState(state => state);
  const color = usePickedColorState(state => state.color);
  const file = useFileState(state => state.file);

  const handler = (operation: OperationType) => {
    return () => {
      setOperation(operation);
    }
  }

  return (
    <fieldset className="tools" disabled={!file}>
      <div className="tool-item">
        <Button className={operation === 'move' ? 'operation-active': ''}
          title="移动模式"
          onClick={handler('move')}>移动模式</Button>
      </div>
      <div className="tool-item">
        <Button className={operation === 'colorPicker' ? 'operation-active': ''}
          onClick={handler('colorPicker')} title="在图片中选择你想要的颜色">选颜色模式</Button>
        <div className="picked-color" style={{
          backgroundColor: color,
        }}></div>
      </div>
      <div className="tool-item">
        <Button className={operation === 'eraser' ? 'operation-active': ''}
          onClick={handler('eraser')} title="将图片中的用橡皮擦擦成你选择的颜色">擦除模式</Button>
        <div className="eraser-size" style={{
          backgroundColor: color,
        }}></div>
      </div>
      <div className="tool-item">
        <Button className={operation === 'fill' ? 'operation-active': ''}
          onClick={handler('fill')} title="将选中的区域填充为选择的颜色">填充模式</Button>
      </div>
      <div className="tool-item">
        <Button className={operation === 'transition' ? 'operation-active': ''}
          onClick={handler('transition')} title="颜色过渡">过渡模式</Button>
        <div></div>
      </div>
      <div className="tool-item">
        <Button className={operation === 'align' ? 'operation-active': ''} onClick={handler('align')}>同化</Button>
        <div className="align"></div>
      </div>
    </fieldset>
  )
}
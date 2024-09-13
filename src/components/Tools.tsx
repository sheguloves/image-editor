import { Button } from "antd";
import { OperationType, useFileState, useOperationState, usePickedColorState } from "../store/stores";
import "./tools.css";
import { useRef } from "react";

export default function Tools() {

  const { operation, setOperation } = useOperationState(state => state);
  const color = usePickedColorState(state => state.color);
  const colorRef = useRef(null);
  const file = useFileState(state => state.file);

  const handler = (operation: OperationType) => {
    return () => {
      setOperation(operation);
    }
  }

  return (
    <fieldset className="tools" disabled={!file}>
      <div className="tool-item">
        <Button className={operation === 'move' ? 'operation-active': ''} onClick={handler('move')}>Move</Button>
      </div>
      <div className="tool-item">
        <Button className={operation === 'colorPicker' ? 'operation-active': ''} onClick={handler('colorPicker')}>Pick Color</Button>
        <div ref={colorRef} className="picked-color" style={{
          backgroundColor: color,
        }}></div>
      </div>
      <div className="tool-item">
        <Button className={operation === 'eraser' ? 'operation-active': ''} onClick={handler('eraser')}>Eraser</Button>
        <div ref={colorRef} className="eraser-size"></div>
      </div>
      <div className="tool-item">
        <Button className={operation === 'align' ? 'operation-active': ''} onClick={handler('align')}>Align</Button>
        <div ref={colorRef} className="align"></div>
      </div>
    </fieldset>
  )
}
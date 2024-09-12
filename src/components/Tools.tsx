import { Button } from "antd";
import { OperationType, useFileState, useOperationState, usePickedColorState } from "../store/stores";
import useCursor from "../hooks/useCursor";
import "./tools.css";
import { useRef } from "react";

export default function Tools() {

  useCursor();
  const setOperation = useOperationState(state => state.setOperation);
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
        <Button onClick={handler('move')}>Move</Button>
      </div>
      <div className="tool-item">
        <Button onClick={handler('colorPicker')}>Pick Color</Button>
        <div ref={colorRef} className="picked-color" style={{
          backgroundColor: color,
        }}></div>
      </div>
      <div className="tool-item">
        <Button onClick={handler('eraser')}>Eraser</Button>
        <div ref={colorRef} className="eraser-size"></div>
      </div>
    </fieldset>
  )
}
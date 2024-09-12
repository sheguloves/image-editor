import { Button } from "antd";
import { OperationType, useOperationState, usePickedColorState } from "../store/stores";
import useCursor from "../hooks/useCursor";
import "./tools.css";
import { useRef } from "react";

export default function Tools() {

  useCursor();
  const setOperation = useOperationState(state => state.setOperation);
  const color = usePickedColorState(state => state.color);
  const colorRef = useRef(null);

  const handler = (operation: OperationType) => {
    return () => {
      setOperation(operation);
    }
  }

  return <div className="tools">
    <div className="tool-item">
      <Button onClick={handler('colorPicker')}>颜色提取</Button>
      <div ref={colorRef} className="picked-color" style={{
        backgroundColor: color,
      }}></div>
    </div>
    <div className="tool-item">
      <Button onClick={handler('eraser')}>橡皮擦</Button>
      <div ref={colorRef} className="eraser-size"></div>
    </div>
  </div>
}
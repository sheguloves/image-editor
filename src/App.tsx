import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import Tools from "./components/Tools";
import "./global.css"

export default function App() {
  return (
    <>
      <Toolbar></Toolbar>
      <div className="workshop">
        <Tools></Tools>
        <Canvas></Canvas>
      </div>
    </>
  )
}
import React from "react";
import ReactDom from "react-dom";
import Window from "./components/Window";
function App() {
    return (
       <Window />
    );
}

ReactDom.render(<App />, document.getElementById('root'));



import React from "react";
import ReactDom from "react-dom";
import Window from "./Window";
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

function App() {
    return (
       <Window />
    );
}

ReactDom.render(<App />, document.getElementById('root'));



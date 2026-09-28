import React, { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <h1>Counter</h1>

      <h2>{count}</h2>

      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

export default App;
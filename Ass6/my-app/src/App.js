
import React, { useState } from "react";
import "./App.css";

const colors = [
  { name: "Red", code: "#ff4d4d" },
  { name: "Blue", code: "#4287f5" },
  { name: "Green", code: "#38b86b" },
  { name: "Yellow", code: "#ffd633" },
  { name: "Purple", code: "#a66cff" },
  { name: "Orange", code: "#ff9933" }
];

function createRound() {
  const target = colors[Math.floor(Math.random() * colors.length)];

  const options = [target];

  while (options.length < 3) {
    const color = colors[Math.floor(Math.random() * colors.length)];

    if (!options.some((item) => item.name === color.name)) {
      options.push(color);
    }
  }

  options.sort(() => Math.random() - 0.5);

  return { target, options };
}

function App() {
  const [round, setRound] = useState(createRound);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [answered, setAnswered] = useState(false);

  function checkAnswer(color) {
    if (answered) return;

    if (color.name === round.target.name) {
      setMessage("Correct! Great job! 🎉");
      setScore(score + 1);
    } else {
      setMessage("Wrong answer! Try the next color.");
    }

    setAnswered(true);
  }

  function nextColor() {
    setRound(createRound());
    setMessage("");
    setAnswered(false);
  }

  function restartGame() {
    setRound(createRound());
    setScore(0);
    setMessage("");
    setAnswered(false);
  }

  return (
    <div className="app">
      <div className="game">
        <h1>ColorTap 🎨</h1>
        <p className="subtitle">Guess the correct color!</p>

        <h2>Score: {score}</h2>

        <p>Which color is shown below?</p>

        <div
          className="color-box"
          style={{ backgroundColor: round.target.code }}
        ></div>

        <div className="options">
          {round.options.map((color) => (
            <button
              key={color.name}
              className="option"
              onClick={() => checkAnswer(color)}
              disabled={answered}
            >
              {color.name}
            </button>
          ))}
        </div>

        <h3>{message}</h3>

        <button className="next" onClick={nextColor}>
          Next Color
        </button>

        <button className="restart" onClick={restartGame}>
          Restart Game
        </button>
      </div>
    </div>
  );
}

export default App;

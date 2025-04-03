import React, { useState, useEffect } from 'react';

const App = () => {
  const wordList = [
    "Apple", "Banana", "Cherry", "Mango", "Grape", 
    "Peach", "Plums", "Lemon", "Olive", "Berry", 
    "Liver", "Crane", "Horse", "Tiger", "Shark", 
    "Lions", "Wolves", "Horse", "Whale", "Eagle", 
    "River", "Ocean", "Storm", "Beach", "Cliff", 
    "Green", "Bluey", "Earth", "Water", "Light", 
    "Shine", "Flare", "Glory", "Trust", "Peace", 
    "Grace", "Bliss", "Chime", "Chirp", "Bounce", 
    "Flame", "Dairy", "Cream", "Bread", "Pasta", 
    "Roast", "Meats", "Spice", "Salt", "Sugar", 
    "Flesh", "Crops", "Earth", "Wheat", "Rice", 
    "Steak", "Pizza", "Bacon", "Fruits", "Grain", 
    "Cloud", "Storm", "Shore", "Beach", "Peace", 
    "Tight", "Sweet", "Sharp", "Clean", "Fresh", 
    "Quick", "Noble", "Mighty", "Brave", "Noble", 
    "Grave", "Trust", "Faith", "Glove", "Press", 
    "Shape", "White", "Jolly", "Vivid", "Chose", 
    "Trick", "Smite", "Grace", "Light", "Peace", 
    "Crown", "Spice", "Sheep", "Horse", "Crate", 
    "Prove", "Rocks", "Blaze", "Flint", "Depth", 
    "Chime", "Chord", "Reach", "Place", "Grave", 
    "Glory", "Shore", "Trail", "Stare", "March", 
    "Mirth", "Grace", "Misty", "Rough", "Slink", 
    "Barge", "Grave", "Brick", "Swift", "Frost", 
    "Thick", "Chunk", "Stone", "Shine", "Plaza", 
    "Cloud", "Lands", "Tight", "Boldy", "Flare", 
    "Storm", "Clash", "Crash", "Flick", "Scorn"
  ];

  const getRandomWord = () => wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();

  const [wordToGuess, setWordToGuess] = useState(getRandomWord()); // The word to guess
  const maxAttempts = 5;

  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [board, setBoard] = useState(Array(maxAttempts).fill(null).map(() => Array(5).fill("")));
  const [status, setStatus] = useState(Array(maxAttempts).fill(null).map(() => Array(5).fill("")));
  const [currentInput, setCurrentInput] = useState(Array(maxAttempts).fill(""));
  const [gameStatus, setGameStatus] = useState("ongoing"); // Tracks game status
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state

  const keyboard = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

  const handleKeyClick = (key) => {
    if (currentInput[currentAttempt].length < 5 && gameStatus === "ongoing") {
      const newInput = [...currentInput];
      newInput[currentAttempt] += key;
      setCurrentInput(newInput);

      const newBoard = [...board];
      newBoard[currentAttempt][newInput[currentAttempt].length - 1] = key;
      setBoard(newBoard);
    }
  };

  const handleEnter = () => {
    if (currentInput[currentAttempt].length !== 5 || gameStatus !== "ongoing") return;

    const newBoard = [...board];
    newBoard[currentAttempt] = currentInput[currentAttempt].split("");

    const newStatus = [...status];
    const tempWord = wordToGuess.split("");
    const inputArray = currentInput[currentAttempt].split("");

    // Determine status colors
    inputArray.forEach((letter, index) => {
      if (letter === tempWord[index]) {
        newStatus[currentAttempt][index] = "green";
        tempWord[index] = null; // Remove matched letters
      }
    });

    inputArray.forEach((letter, index) => {
      if (
        tempWord.includes(letter) &&
        newStatus[currentAttempt][index] !== "green"
      ) {
        newStatus[currentAttempt][index] = "orange";
        tempWord[tempWord.indexOf(letter)] = null;
      } else if (newStatus[currentAttempt][index] !== "green") {
        newStatus[currentAttempt][index] = "red";
      }
    });

    setBoard(newBoard);
    setStatus(newStatus);

    if (currentInput[currentAttempt] === wordToGuess) {
      setGameStatus("win");
      setIsDialogOpen(true);
    } else if (currentAttempt + 1 >= maxAttempts) {
      setGameStatus("lose");
      setIsDialogOpen(true);
    }

    setCurrentAttempt((prev) => prev + 1);
  };

  const handleBackspace = () => {
    if (currentInput[currentAttempt].length > 0 && gameStatus === "ongoing") {
      const newInput = [...currentInput];
      newInput[currentAttempt] = newInput[currentAttempt].slice(0, -1);
      setCurrentInput(newInput);

      const newBoard = [...board];
      newBoard[currentAttempt][newInput[currentAttempt].length] = "";
      setBoard(newBoard);
    }
  };

  const restartGame = () => {
    setBoard(Array(maxAttempts).fill(null).map(() => Array(5).fill("")));
    setStatus(Array(maxAttempts).fill(null).map(() => Array(5).fill("")));
    setCurrentAttempt(0);
    setCurrentInput(Array(maxAttempts).fill(""));
    setGameStatus("ongoing");
    setIsDialogOpen(false);
    setWordToGuess(getRandomWord());
  };

  return (
    <div className="min-h-full bg-background">
      {/* <h1 className="text-xl font-bold text-center mb-4"></h1> */}
      <img className='w-42 mx-auto mb-4'
       src="/logo.png"/>

      {/* Board */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-2">
            {row.map((letter, colIndex) => (
              <div
                key={colIndex}
                className={`w-16 h-16 flex items-center justify-center text-lg font-bold rounded-md border ${
                  status[rowIndex][colIndex] === "green"
                    ? "bg-check"
                    : status[rowIndex][colIndex] === "orange"
                    ? "bg-warning"
                    : status[rowIndex][colIndex] === "red"
                    ? "bg-wrong"
                    : "bg-background"
                }`}
              >
                <div>{letter}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Keyboard */}
      <div className="flex flex-wrap gap-2 justify-center items-center mb-4 max-w-md mx-auto">
        {keyboard.map((key) => (
          <button
            key={key}
            className="w-12 h-14 text-sm font-bold rounded-md bg-button cursor-pointer"
            onClick={() => handleKeyClick(key)}
            disabled={gameStatus !== "ongoing"}
          >
            {key}
          </button>
        ))}
         {/* Controls */}
          <button onClick={handleEnter} className="h-14 w-24 rounded-md bg-button-two text-white cursor-pointer" disabled={gameStatus !== "ongoing"}>
            Enter
          </button>
          <button onClick={handleBackspace} className="h-14 w-52 rounded-md bg-button-two text-white cursor-pointer" disabled={gameStatus !== "ongoing"}>
            Backspace
          </button>
      </div>

     

      {/* End Game Dialog */}
      <div>
      {(gameStatus === "win" || gameStatus === "lose") && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="w-90 bg-white p-6 rounded-lg shadow-lg">
            <div className="text-center">
              <div className="font-bold text-lg mb-2">
                {gameStatus === "win" ? "Omedetou! 🎉" : "Owattajann~"}
              </div>
              <p>{gameStatus === "lose" && `The word was ${wordToGuess}.`}</p>
              <div className="mt-4">
                <button onClick={restartGame} className="bg-button text-white p-2 rounded cursor-pointer">
                  Restart Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default App;

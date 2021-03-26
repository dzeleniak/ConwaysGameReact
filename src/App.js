import './App.css';
import {useState, useEffect, useRef, useCallback} from 'react';
import produce from 'immer';

const numCols = 50;
const numRows = 50;

const operations = [
  [0,1],
  [1,0],
  [1,1],
  [-1,-1],
  [0,-1],
  [-1,0],
  [-1,1],
  [1,-1]
]

function App() {
  const [grid, setGrid] = useState(()=>{
    const rows = [];
    for(let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  })

  const [running, setRunning] = useState(false);
  const isRunning = useRef(running);
  
  isRunning.current = running;

   const runSimulation = useCallback(()=>{
    if(!isRunning.current){
      return;
    }
    
    //Game logic
    setGrid((g) =>{
      return produce(g, gCopy => {
        for(let i = 0; i < numRows; i++){
          for(let j = 0; j < numCols; j++){
            let neighbors = 0;
            
            operations.forEach(([x,y]) => {
              const newI = i + x;
              const newJ = j + y;

              if(newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols){
                neighbors += g[newI][newJ];
              }
            })

            if (neighbors < 2 || neighbors > 3) {
              gCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3){
              gCopy[i][j] = 1;
            }
          }
        }

      })
    })

    setTimeout(runSimulation, 500)
   }, [])


  return (
    <>
      <div className="top-bar">
        <button onClick={()=>{
          setRunning(!running)
          if(!running){
            isRunning.current = true;
            runSimulation();
          }
        }}>
          {running ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={()=>{
            if(running) {
              setRunning(false);
            }
            setGrid(()=>{
              let rows = [];
              for(let i = 0; i < numRows; i++) {
                rows.push(Array.from(Array(numCols), () => 0));
              }
              return rows;
            })
          }}>
          Clear
        </button>
      </div>
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}>
        {grid.map((rows, i) =>
          rows.map((cols, j) =>
            <div
              key={`${i}-${j}`}
              style={{
                height: 20,
                width: 20,
                backgroundColor: grid[i][j] ? 'red' : 'black',
                border: 'solid .5px white',
              }}
              onClick={()=>{
                setGrid(()=>{
                  const newGrid = produce(grid, gCopy => {
                    gCopy[i][j] = grid[i][j] ? 0 : 1;
                  });
                  return newGrid;
                })
              }}></div>
          )
        )}
      </div>
    </>
  );
}

export default App;

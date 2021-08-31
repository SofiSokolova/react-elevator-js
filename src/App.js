import React, {useEffect, useRef, useState} from 'react';
import './App.css';

const moveDirectionEnum = {
  UP: "Up",
  DOWN: "Down",
  STANDING: "Standing"
}

const floorNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function Elevator(props) {

  const [currentFloor, setFloor] = useState(floorNumbers[0]);
  const [upQueue, setToUpQueue] = useState(new Set());
  const [downQueue, setToDownQueue] = useState(new Set());
  const [moveDirection, setNewDirection] = useState(moveDirectionEnum.STANDING);

  const prevDirection = usePrevious(moveDirection);

  useEffect(() => {
    if (prevDirection === moveDirectionEnum.STANDING && moveDirection !== moveDirectionEnum.STANDING) {
      console.log('LOL');
      moveElevator();
    }

    if (moveDirection !== moveDirectionEnum.STANDING) {
      moveElevator()
      //delay += hasFloor ? 2000 : 0;
      
    }
  })
  
  function handleClick(floor) {
    if (floor > currentFloor) {
      setToUpQueue(upQueue.add(floor))
      if (moveDirection === moveDirectionEnum.STANDING) {
        setNewDirection(moveDirectionEnum.UP)
      }
    }

    if (floor < currentFloor) {
      setToDownQueue(downQueue.add(floor))
      if (moveDirection === moveDirectionEnum.STANDING) {
        setNewDirection(moveDirectionEnum.DOWN)
      }
    }
  }

  function moveElevator() {
    let delay = 1000;
    if (upQueue.has(currentFloor) || downQueue.has(currentFloor)) {
      console.log('11111111111111');
      console.log(upQueue);

      upQueue.delete(currentFloor)
      setToUpQueue(upQueue);
      
      downQueue.delete(currentFloor)
      setToDownQueue(downQueue);

      if (!upQueue.size && !downQueue.size) {
        console.log('22222222222222');
        setNewDirection(moveDirectionEnum.STANDING);
      }
      if (!upQueue.size && downQueue.size) {
        setNewDirection(moveDirectionEnum.DOWN);
      }
      if (upQueue.size && !downQueue.size) {
        setNewDirection(moveDirectionEnum.UP);
      }
    } else {
      console.log('================');
      setTimeout(() => {
        const floor = currentFloor + (moveDirection === moveDirectionEnum.UP ? 1 : -1);
        
        setFloor(floor)
      }, 2000)
    }
  }

  return (
    <div className='main'>
      <div className='wrapper'>
        <div className='floor-display'>{currentFloor}
          <p>{moveDirection === moveDirectionEnum.UP && <i className="arrow-up"/>}
            {moveDirection === moveDirectionEnum.DOWN && <i className="arrow-down"/>}
            {moveDirection === moveDirectionEnum.STANDING && '—'}</p>
        </div>

        <div className='floor-btn'>
          {floorNumbers.map((number) =>
            <button className={currentFloor === number ? 'current-floor' : ''} key={number.toString()}
                    onClick={() => handleClick(number)}
                    disabled={upQueue.has(number) || downQueue.has(number)}>
              {number}
            </button>
          )}
        </div>
      </div>
    </div>

  );
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
  



  

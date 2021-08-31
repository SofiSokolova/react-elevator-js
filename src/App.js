import React, {useEffect, useRef, useState} from 'react';
import './App.css';

const moveDirectionEnum = {
  UP: "Up",
  DOWN: "Down",
  STANDING: "Standing"
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

const floorNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function Elevator() {
  const [currentFloor, setFloor] = useState(floorNumbers[0]);
  const [upQueue, setToUpQueue] = useState(new Set());
  const [downQueue, setToDownQueue] = useState(new Set());
  const [moveDirection, setNewDirection] = useState(moveDirectionEnum.STANDING);

  const prevDirection = usePrevious(moveDirection);

  useEffect(() => {
    if (prevDirection === moveDirectionEnum.STANDING && moveDirection !== moveDirectionEnum.STANDING) {
      moveElevator();
    }
  }, [moveDirection]);

  useEffect(() => {
    moveElevator();
  }, [currentFloor]);

  function handleClick(floor) {
    if (floor > currentFloor) {
      setToUpQueue(new Set(upQueue).add(floor));
      if (moveDirection === moveDirectionEnum.STANDING) {
        setNewDirection(moveDirectionEnum.UP);
      }
    }

    if (floor < currentFloor) {
      setToDownQueue(new Set(downQueue).add(floor));
      if (moveDirection === moveDirectionEnum.STANDING) {
        setNewDirection(moveDirectionEnum.DOWN);
      }
    }
  }

  function moveElevator() {
    let delay = 1000;
    let hasFloor = false;
    let newDirection = moveDirection;

    if (upQueue.has(currentFloor) || downQueue.has(currentFloor)) {
      hasFloor = true;

      const upQ = new Set(upQueue);
      const downQ = new Set(downQueue);

      upQ.delete(currentFloor);
      downQ.delete(currentFloor);
      setToUpQueue(upQ);
      setToDownQueue(downQ);

      if (!upQ.size && !downQ.size) {
        newDirection = moveDirectionEnum.STANDING;
        setNewDirection(newDirection);
      }
      if (!upQ.size && downQ.size) {
        newDirection = moveDirectionEnum.DOWN;
        setNewDirection(newDirection);
      }
      if (upQ.size && !downQ.size) {
        newDirection = moveDirectionEnum.UP;
        setNewDirection(newDirection);
      }
    }

    if (newDirection !== moveDirectionEnum.STANDING) {
      delay += hasFloor ? 2000 : 0;

      setTimeout(() => {
        setFloor(currentFloor + (newDirection === moveDirectionEnum.UP ? 1 : -1));
      }, delay)
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

import React, { createContext, useState } from 'react';

export const BattleContext = createContext();

export const BattleProvider = ({ children }) => {
  const [knightState, setKnightState] = useState('standing');
  const [monsterState, setMonsterState] = useState('standing');
  const [knightPosition, setKnightPosition] = useState(0);
  const [triggerAttackAnimation, setTriggerAttackAnimation] = useState(false);

  const triggerAttackSequence = () => {
    setTriggerAttackAnimation(true);
    setKnightState('attacking');
    setKnightPosition(100);

    setTimeout(() => {
      setMonsterState('hit');
    }, 500);

    setTimeout(() => {
      setMonsterState('disappear');
    }, 1000);

    setTimeout(() => {
      setKnightPosition(0);
      setKnightState('standing');
      setTriggerAttackAnimation(false);
    }, 1500);
  };

  const resetMonster = () => {
    setMonsterState('standing');
  };

  return (
    <BattleContext.Provider
      value={{
        knightState,
        monsterState,
        knightPosition,
        triggerAttackAnimation,
        triggerAttackSequence,
        resetMonster,
      }}
    >
      {children}
    </BattleContext.Provider>
  );
};

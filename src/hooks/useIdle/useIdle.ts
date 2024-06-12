import { useEffect, useState } from "react";

interface IdleProps {
  idleTime: number; // ms
  onIdle?: () => void;
  onActive?: () => void;
}

const activeEvents = [
  "mousedown",
  "mousemove",
  "touchstart",
  "touchmove",
  "keydown",
  "wheel",
];

const useIdle = ({
  idleTime = 300000,
  onIdle = () => null,
  onActive = () => null,
}: IdleProps) => {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsIdle(true);
        onIdle();
      }, idleTime);
    };

    const handleActiveEvent = () => {
      setIsIdle(false);
      onActive();
      resetTimer();
    };

    const attachEventListeners = () => {
      activeEvents.forEach((event) => {
        window.addEventListener(event, handleActiveEvent);
      });

      return () => {
        activeEvents.forEach((event) => {
          window.removeEventListener(event, handleActiveEvent);
        });
      };
    };

    resetTimer();
    const removeEventListeners = attachEventListeners();

    return () => {
      clearTimeout(timer);
      removeEventListeners();
    };
  }, [idleTime, onIdle, onActive]);

  return isIdle;
};

export default useIdle;

import { useEffect } from "react";
import { useAnimate, stagger } from "framer-motion";

const useCardAnimation = (classname = ".cardContainer") => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      classname,
      { opacity: [0, 1], x: [100, 0] },
      {
        duration: 0.3,
        delay: stagger(0.1, { startDelay: 0.15 }),
      }
    );
  }, []);

  return scope;
};

export default useCardAnimation;

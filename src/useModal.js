import { useState } from 'react';

const useModal = () => {
  const [isShowing, setIsShowing] = useState(true);

  function toggle() {
      console.log("I am clicked")
    setIsShowing(!isShowing);
  }

  return {
    isShowing,
    toggle,
  }
};

export default useModal;
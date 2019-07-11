import { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';


// props, ref
const Portal = forwardRef(({ children }, innerRef) => {
  const container = useRef(document.createElement('div'));
  const setRef = node => {
    if (innerRef) {
      typeof innerRef === 'function' ? innerRef(node) : (innerRef.current = node);
    }
  };

  useEffect(() => {
    setRef(container.current);
    document.querySelector("#appbox").appendChild(container.current);
    return () => {
      setRef(null);
      document.querySelector("#appbox").removeChild(container.current);
    };
  }, []);

  // child, container
  return createPortal(children, container.current);
});

export { Portal };

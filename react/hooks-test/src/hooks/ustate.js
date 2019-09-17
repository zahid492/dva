import React, {useState, useEffect, useRef, useImperativeHandle, forwardRef} from 'react';

function FancyInput(props, ref) {
    const inputRef = useRef(null);
    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current.focus()
        }
    }));

    return (
        <input type="text" ref={inputRef}/>
    )
}
const Estate = forwardRef(FancyInput)
export default Estate

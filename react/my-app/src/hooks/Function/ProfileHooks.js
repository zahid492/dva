
import React, {useState, useRef} from 'react';

export default function App() {
    const message = useRef("");

    const showMessage = () => {
        alert("You said: " + message.current);
    };

    const handleSendClick = () => {
        setTimeout(showMessage, 3000);
    };

    const handleMessageChange = e => {
        message.current = (e.target.value);
    };

    return (
        <>
            <input ref={message} onChange={handleMessageChange} />
            <button onClick={handleSendClick}>Send</button>
        </>
    );
}
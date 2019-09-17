import React from 'react';
import './App.css';
import Estate from './hooks/ustate';

function App() {
  const fref  = React.createRef();
  setTimeout(function(){
    console.log(fref.current)
    fref.current.focus();
  },3000)
  return (
    <div className="App">
       <Estate ref={fref}/>
    </div>
  );
}

export default App;

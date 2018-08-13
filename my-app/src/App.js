import React, { Component } from 'react';
import './scss/styles.module.scss';
import { tween, styler, action } from 'popmotion';

class App extends Component {

  componentDidMount(){
      const just = (v) => {
          return action(({update, complete}) =>{
              update(v);
              complete();
          });
      };

      just(1).start(console.log)
  }

  render() {
    return (
      <div className="app">
          <h4 className="header-title">pop</h4>
          <div className="ball"></div>

      </div>
    );
  }
}

export default App;

import React, {Component} from 'react';
import  _ from 'lodash';
import './scss/styles.module.scss';
import paper from '/node_modules/paper/dist/paper-full';
// import {
//     tween,
//     styler,
//     easing,
//     action,
//     pointer,
//     listen,
//     decay,
//     value,
//     everyFrame,
//     keyframes,
//     physics,
//     transform,
//     timeline
// } from 'popmotion';

// import * as PIXI from 'pixi.js'
// import pose from 'popmotion-pose'
import posed from 'react-pose'
import {Motion, spring, StaggeredMotion, TransitionMotion, presets} from 'react-motion';

// const {pipe, interpolate} = transform;

class App extends Component {

    state = {

    };

    componentDidMount() {
        var path = new paper.Path();
        // Give the stroke a color
        path.strokeColor = 'black';
        var start = new paper.Point(100, 100);
        // Move to start and draw a line from there
        path.moveTo(start);
        // Note the plus operator on Point objects.
        // PaperScript does that for us, and much more!
        path.lineTo(start + [ 100, -50 ]);
    }


    render() {

        return (
            <div className="app">
                <canvas id="myCanvas" resize></canvas>
            </div>
        );
    }
}

export default App;

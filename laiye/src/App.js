import React, {Component} from 'react';
import SwipeableViews from 'react-swipeable-views';
import Tab from "./component/tab"

const styles = {
    slide: {
        padding: 15,
        minHeight: 100,
        color: '#000',
    },
    slide1: {
        backgroundColor: '#FEA900',
    },
    slide2: {
        backgroundColor: '#B3DC4A',
    },
    slide3: {
        backgroundColor: '#6AC0FF',
    },
};

export default class App extends Component {
    render() {
        return (
            <div>
                <SwipeableViews enableMouseEvents>
                    <div style={Object.assign({}, styles.slide, styles.slide1)}>
                        <Tab/>
                        <p>1</p>
                    </div>
                    <div style={Object.assign({}, styles.slide, styles.slide2)}>
                        <Tab/>
                        <p>2</p>
                    </div>
                    <div style={Object.assign({}, styles.slide, styles.slide3)}>
                        slide n°3
                    </div>
                </SwipeableViews>
            </div>
        )
    };
}

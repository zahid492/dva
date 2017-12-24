import React, { Component } from 'react';
import { Tabs, WhiteSpace } from 'antd-mobile';
import List from './list';
import DList from './dlist';

export default class Tab extends Component {
    renderContent = tab =>
        (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
            <p>Content of {tab.title}</p>
        </div>);

    render() {
        const tabs = [
            { title: '1st Tab' },
            { title: '2nd Tab' },
            { title: '3rd Tab' },
            // { title: '4th Tab' },
            // { title: '5th Tab' },
            // { title: '6th Tab' },
            // { title: '7th Tab' },
            // { title: '8th Tab' },
            // { title: '9th Tab' },
        ];

        return (
            <div>
                <WhiteSpace />
                <Tabs tabs={tabs} swipeable={false}>
                    <DList />
                </Tabs>
                <WhiteSpace />
            </div>
        );
    }
}

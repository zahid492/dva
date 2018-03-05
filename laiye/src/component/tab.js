import React, {Component} from 'react';
import {Tabs, WhiteSpace} from 'antd-mobile';

// import List from './list';
// import DList from './dlist';
// tab 横向切换，多 tab 嵌套测试
export default class Tab extends Component {
    renderContent = tab => {
        return (<div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '150px',
            backgroundColor: '#fff'
        }}>
            <p>Content of {tab.title}</p>
        </div>)
    };

    renderCt = tab => {
        const tb = {
            tabs1: [
                {title: '1-1st Tab'},
                {title: '1-2nd Tab'},
                {title: '1-3rd Tab'},
                {title: '1-4th Tab'},
                {title: '1-5th Tab'},
                {title: '1-6th Tab'},
            ],
            tabs2: [
                {title: '2-1st Tab'},
                {title: '2-2nd Tab'},
                {title: '2-3rd Tab'},
                {title: '2-4th Tab'},
                {title: '2-5th Tab'},
            ],
            tabs3: [
                {title: '3-1st Tab'},
                {title: '3-2nd Tab'},
                {title: '3-3rd Tab'},
                {title: '3-4th Tab'},
            ]
        };
        const tbk = "tabs" + tab.id;
        return (
            <div>
                <Tabs tabs={tb[tbk]} swipeable={true}>
                    {this.renderContent}
                </Tabs>
            </div>
        )
    };

    render() {

        const tabt = [
            {title: '111st Tab', id: 1},
            {title: '222nd Tab', id: 2},
            {title: '333rd Tab', id: 3},
        ];

        return (
            <div>
                <WhiteSpace/>
                <Tabs tabs={tabt} swipeable={false} className={"xxx"}
                      renderTabBar={(props) => {
                          return (
                              <div className="ggg">
                                  <div style={{color: "red", float: "left"}}>Left</div>
                                  <div style={{width: "275px", float: "left"}}>
                                      <Tabs.DefaultTabBar
                                          {...props}
                                          renderTab={(tab) => {
                                              return <div>{tab.title}</div>;
                                          }}
                                      />
                                  </div>
                                  <div style={{color: "blue", float: "left"}}>Right</div>
                              </div>
                          )
                      }}
                >
                    {this.renderCt}
                </Tabs>

                <WhiteSpace/>
            </div>
        );
    }
}

import React, {Component} from 'react'

//公用底部
class Footer extends Component {
    render() {
        return (
            <footer id="footer">
                <div className="contact_way">
                    <ul>
                        <li>
                            <a href="">
                                <i className="iconfont icon-address"></i>
                                北京市海淀区中关村科技园
                            </a>
                        </li>
                        <li>
                            <a href="">
                                <i className="iconfont icon-phone"></i>
                                010-57905168
                            </a>
                        </li>
                        {/* <li>
                                <a href="javaScript:;" >
                                <i className="iconfont icon-a"></i>
                                     FG@bluefocus.com
                                </a>
                            </li> */}
                        <li>
                            <a href="http://www.aimiaobi.com" target='_blank'>
                                <i className="iconfont icon-web"></i>
                                http://www.aimiaobi.com
                            </a>
                        </li>
                    </ul>
                </div>
            </footer>
        )
    }
}


export default Footer

import React from "react";
import {Menu, Icon} from 'antd';
import Link from 'umi/link';
import withRouter from 'umi/withRouter';

function Header({ location }) {
  return(
    <Menu selectedKeys={[location.pathname]} mode="horizontal" theme="dark">

      <Menu.Item key="/users">
        <Link to="/users"><Icon type="bars"/>Users</Link>
      </Menu.Item>


    </Menu>
  )
}

export default withRouter(Header);

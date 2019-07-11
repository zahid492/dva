import React from "react";
import styles from "./index.css";
import Header from "./Header";

function Layout({children, location}) {
  return (
    <div>
      <Header location={location}></Header>

      <div id="appbox">{children}</div>


    </div>
  )
}

export default Layout;

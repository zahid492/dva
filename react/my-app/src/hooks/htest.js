import React, {useState} from "react";

export function App(title) {

    return React.useMemo(()=>(
            <div>{title}</div>
        ), [title])
    ;
}

App.defaultProps = {
    title: "Function Component"
};
import React from "react";
import hoistNonReactStatics from "hoist-non-react-statics/src";
import {useStore, ReactReduxContext} from "react-redux";

import getInjectors from "./reducerInjectors";

export default ({key, reducer})=> WrappedComponent => {
    class ReducerInjector extends React.Component{
        static WrappedComponent = WrappedComponent;
        static contextType = ReactReduxContext;
        static dispalyName = `withReducer(${WrappedComponent.displayName 
        || WrappedComponent.name || 'Component'})`;

        constructor(props, context){
            super(props, context);
            getInjectors(context.store).injectReducer(key, reducer);
        }

        render() {
            return <WrappedComponent {...this.props} />
        }
    }

    return hoistNonReactStatics(ReducerInjector, WrappedComponent);
}

const useInjectReducer = ({key, reducer})=>{
    const store = useStore();

    React.useEffect(()=>{
        getInjectors(store).injectReducer(key, reducer);
    }, []);
};

export {useInjectReducer};


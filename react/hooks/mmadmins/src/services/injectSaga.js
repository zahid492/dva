import React from "react";
import hoistNonReactStatics from "hoist-non-react-statics/src";
import {useStore, ReactReduxContext} from "react-redux";

import getInjectors from "./sagaInjectors";

export default ({key, saga}) => WrappedComponent => {
    class InjectSaga extends React.Component {
        static WrappedComponent = WrappedComponent;
        static contextType = ReactReduxContext;
        static displayName = `withSaga(${WrappedComponent.displayName
        || WrappedComponent.name
        || 'Component'})`;

        constructor(props, context) {
            super(props, context);
            this.injectors = getInjectors(context.store);
            // run
            this.injectors.injectSaga(key, {saga}, this.props);
        }

        componentWillUnmount() {
            this.injectors.ejectSaga(key);
        }

        render() {
            return <WrappedComponent {...this.props} />
        }
    }

    return hoistNonReactStatics(InjectSaga, WrappedComponent)

}

const useInjectSaga = ({key, saga}) => {
    const store = useStore();

    React.useEffect(() => {
        const injectors = getInjectors(store);
        //run
        injectors.injectSaga(key, {saga});

        return () => {
            injectors.ejectSaga(key);
        }
    }, [])
};

export {useInjectSaga};
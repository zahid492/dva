import {useCallback, useState} from 'react';
import useMountedState from "./useMountedState";

// execuse async has loading state after mounted;
export default function useAsyncFn(fn, deps, initialState) {
    const [state, set] = useState(initialState);
    const isMounted = useMountedState();

    const callback = useCallback(() => {
        set({loading: true});

        return fn().then(value => {
            isMounted() && set({value, loading: false});
            return value;
        }, error => {
            isMounted() && set({error, loading: false});
            return error;
        })
    }, deps);

    return [state, callback]
}
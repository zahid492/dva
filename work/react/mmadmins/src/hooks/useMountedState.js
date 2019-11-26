import {useCallback, useEffect, useRef} from 'react';

// if mounted true or false
export default function useMountedState() {
    const mountedRef = useRef(false);
    const get = useCallback(()=>{
        return mountedRef.current;
    }, []);

    useEffect(()=>{
       mountedRef.current = true;

       return ()=>{
           mountedRef.current = false;
       }
    });

    return get;
}
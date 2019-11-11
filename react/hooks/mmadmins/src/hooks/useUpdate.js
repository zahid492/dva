import {useState, useCallback} from 'react';

// 强制重新渲染
const useUpdate=()=>{
    const [, setState] = useState(0);
    const updateCb = useCallback(()=>setState(cnt=>cnt+1), []);
    return updateCb;
};

export default useUpdate;
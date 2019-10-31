import {useState} from 'react';
import produce from 'immer';

const useImmer = initialState=>{
    const [state, setState] = useState(initialState);

    // setter is a function, draft.state change
    const setImmer = setter => setState(produce(setter));
    return [state, setImmer];
};

export default useImmer;

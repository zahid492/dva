import {useReducer} from 'react';
import produce from "immer";

const useImmerReducer = (reducer, initialState)=>{
    return useReducer(produce(reducer, initialState))
};

export default useImmerReducer;
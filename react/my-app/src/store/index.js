import produce from "immer";

export const count = {
    state: 0,
    reducers: {
        increment: produce((draft, a, b)=>{
            console.log(draft, a, b);
            draft = draft + 1;
            return draft;
        }),
    },
    effects: {
        // async asyncIncrement() {
        //     await new Promise(resolve => {
        //         setTimeout(resolve, 1000)
        //     })
        //     dispatch.count.increment()
        // },
        asyncIncrement: (playload, rootState)=>{
            console.log(playload, rootState)
            return produce(rootState, async (draft)=>{
                await new Promise(resolve => {
                    setTimeout(resolve, 1000)
                });
                draft.count += 1;
            })
        }
    },
};
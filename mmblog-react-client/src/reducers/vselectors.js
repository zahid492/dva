export const getPosts = (state) => {
    console.log("selector: ", state)
    return {
        posts: state.posts,

    };
};


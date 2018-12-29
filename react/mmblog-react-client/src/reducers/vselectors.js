export const getPosts = (state) => {
    return {
        posts: state.posts,
        page: state.page,
        limit: state.pageSize
    };
};


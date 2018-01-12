export const UP_REQUEST = 'UP_REQUEST';
export const UP_SUCCESS = 'UP_SUCCESS';
export const UP_FAILURE = 'UP_FAILURE';

export function getAllNews(key){
    return {
        type: UP_REQUEST,
        key: key
    }
}

export function receiveAllNews(products){
    return {
        type: UP_SUCCESS,
        products
    }
}

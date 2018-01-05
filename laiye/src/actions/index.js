export const UP_REQUEST = 'UP_REQUEST';
export const UP_SUCCESS = 'UP_SUCCESS';
export const UP_FAILURE = 'UP_FAILURE';

export function getAllNews(){
    return {
        type: UP_REQUEST
    }
}

export function receiveAllNews(products){
    return {
        type: UP_SUCCESS,
        products: products
    }
}

import history from "customHistory";
import ProductServices from "../api/ProductService";
import * as actionTypes from "../constants/ActionTypes";

import { errorHandle } from "../actions/errorHandling";

export const productError = errorMessage => {
    return { type: actionTypes.PRODUCT_FAILED, errorMessage };
};

export const productList = products => {
    return {
        type: actionTypes.FETCH_PRODUCTS,
        payload: products
    };
};

export function addProduct(productInfo) {
    return function (dispatch, getState) {
        return ProductServices.addProduct(productInfo)
            .then(addProductResponse => {
                if (addProductResponse.statusCode === 201) {
                    dispatch({
                        type: actionTypes.ADD_PRODUCT
                    });
                    return addProductResponse.data.product
                }
            })
            .catch(err => {
                console.error("--> error while adding product : => ", err);
                return err;
            });
    };
}

export function resetAddProduct() {
    return function (dispatch) {
        return dispatch({
            type: actionTypes.RESET_ADD_PRODUCT
        });
    };
}

export function fetchProducts(type) {
    return async dispatch => {
        return ProductServices.fetchProducts(type)
            .then(productsResponse => {
                if (productsResponse.statusCode === 200) {
                    return dispatch(productList(productsResponse.data.products));
                }
            })
            .catch(error => {
                console.error("--> error while fetching products : => ", error);
            });
    };
}

export function fetchProductById(productId) {
    return async dispatch => {
        try {
            const response = await ProductServices.fetchProductById(productId);
            if (response.statusCode === 200) {
                return dispatch({
                    type: actionTypes.FETCH_PRODUCT_BY_ID,
                    selectedProduct: response.data.product
                });
            }
        } catch (error) {
            dispatch(productError(error));
        }
    };
}

export function updateProduct(productId, productInfo) {
    return async (dispatch, getState) => {
        try {
            const response = await ProductServices.updateProductById(
                productId,
                productInfo
            );
            if (response) {
                dispatch({
                    type: actionTypes.UPDATE_PRODUCT
                });
                return response.data.product
            }
        } catch (error) {
            dispatch(productError(error));
        }
    };
}

export function deleteProduct(id) {
    return function (dispatch) {
        return ProductServices.deleteProduct(id)
            .then(productResponse => {
                if (productResponse.statusCode === 200) {
                    return { message: "success" };
                }
            })
            .catch(error => {
                console.error("--> error in deleting customer : ", error);
                return dispatch({
                    type: actionTypes.PRODUCT_FAILED,
                    payload: error
                });
            });
    };
}

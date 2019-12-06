import requestWithToken from './requestWithToken'

const productServices = {
    addProduct,
    fetchProducts,
    fetchProductById,
    updateProductById,
    deleteProduct
}

function addProduct(data) {
    return requestWithToken({
        url: '/api/v1/products',
        method: 'POST',
        data
    });
}

function fetchProductById(productId) {
    return requestWithToken({
        url: '/api/v1/products/' + productId,
        method: 'GET'
    })
}

function fetchProducts(itemType) {
    return requestWithToken({
        url: `/api/v1/products?itemType=${itemType}`,
        method: 'GET'
    })
}

function updateProductById(productId, updateData) {
    return requestWithToken({
        url: '/api/v1/products/' + productId,
        method: 'PUT',
        data: updateData
    })
}

function deleteProduct (productId) {
    return requestWithToken({
        url: `api/v1/products/${productId}`,
        method: "DELETE"
    })
}

export default productServices;

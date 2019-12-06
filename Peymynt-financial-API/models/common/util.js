
export const getPaymentMethodIcon = (cardType) => {
    let paymentMethod = 'bank';
    switch (cardType) {
        case 'Visa':
            paymentMethod = 'visa';
            break;
        case 'MasterCard':
            paymentMethod = 'mastercard';
            break;
        case 'American Express':
            paymentMethod = 'amex';
            break;
        case 'Diners Club':
            paymentMethod = 'diners';
            break;
        default:
            paymentMethod = cardType.toLowerCase();
            break;
    }
    return paymentMethod;
}
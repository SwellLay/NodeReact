export const stripeStyle = {
    base: {
        fontSize: '16px',
        color: '#41494f',
        fontFamily: "'py-circular', sans-serif",
        fontSmoothing: 'antialiased',

        '::placeholder': {
            color: 'rgba(40, 21, 64, 0.3)',
            fontStyle: 'italic'
        } 
    }
}

export const accountOptionStyle = {
    alignItems: 'center',
    padding: '8px, 10px',
    cursor: 'pointer',
    display: 'flex',
    position: 'relative'
}

export const accountOptionImgStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '3px',
    marginRight: '0.5rem',
    verticleAllign: 'middle'
}

export const accountOptionSpanStyle = {
    maxWidth: 'calc(100% - 50px)',
}
import crypto from 'crypto';

export const encode = (password) => {
    return crypto.createHmac('md5', process.env.SECRET_TOKEN).update(password).digest('base64');
}
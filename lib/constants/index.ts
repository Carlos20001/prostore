export const APP_NAME = process.env.APP_NAME || 'prostore';
export const APP_DESCRIPTION = process.env.APP_DESCRIPTION || ' a modern, ecommerce store';
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;
export const signInDefaultValues = {
    email: '',
    password:'',
}
export const signUpDefaultValues = {
    name: '',
    email: '',
    password:'',
    confirmPassword: '',
}

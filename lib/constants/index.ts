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

export const shippingAddressDefaultValues = {
  fullName: '',
  streetAddress: '',
  city: '',
  postalCode: '',
  country: '',
}
export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(', ')
  : ['PayPal', 'Stripe', 'CashOnDelivery'];

  export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

  export const productDefaultValues = {
  name: '',
  slug: '',
  category: '',
  images: [],
  brand: '',
  description: '',
  price: '0',
  stock: 0,
  rating: '0',
  numReviews: '0',
  isFeatured: false,
  size: '',
  color: '',
  quantity: 0,
  banner: null,
};

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(', ')
  : ['admin', 'user'];

  export const reviewFormDefaultValues = {
	title: '',
	comment: '',
	rating: 0,
}

export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
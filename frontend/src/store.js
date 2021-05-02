import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
	productsReducer,
	productDetailsReducer,
	newReviewReducer,
	productReducer,
	newProductReducer,
	productReviewsReducer,
	reviewReducer

} from './reducer/productReducer';
import {
	authReducer,
	userReducer,
	forgotPasswordReducer,
	allUsersReducer,
	userDetailsReducer,
} from './reducer/userReducer';
import { cartReducer } from "./reducer/cartReducers";
import {
	newOrderReducer,
	myOrdersReducer,
	orderDetailsReducer,
	allOrdersReducer,
	orderReducer,
} from './reducer/orderReducer';


const reducer = combineReducers({
	products: productsReducer,
	productDetails: productDetailsReducer,
	newProduct: newProductReducer,
	product: productReducer,
	productReviews: productReviewsReducer,
	review: reviewReducer,
	auth: authReducer,
	user: userReducer,
	forgotPassword: forgotPasswordReducer,
	cart: cartReducer,
	newOrder: newOrderReducer,
	myOrders: myOrdersReducer,
	allOrders: allOrdersReducer,
	orderDetails: orderDetailsReducer,
	order: orderReducer,
	allUsers: allUsersReducer,
	userDetails: userDetailsReducer,
	newReview: newReviewReducer,
});

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo:localStorage.getItem('shippingInfo')?JSON.parse(localStorage.getItem('shippingInfo')):{}
  },
};
const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;

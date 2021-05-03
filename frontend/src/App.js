import { useEffect, useState } from 'react';
import {useSelector} from 'react-redux'
import axios from 'axios';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import ProductDetails from './components/product/ProductDetails';

import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment';
import OrderSuccess from './components/cart/OrderSuccess';

// Order Imports
import ListOrders from './components/orders/ListOrders';
import OrderDetails from './components/orders/OrderDetails'


import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from "./components/user/Profile";
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";
import ProtectedRoute from './components/route/protectedRoute';
import { loadUser } from './actions/userActions';



// Admin Imports
import Dashboard from './components/admin/Dashboard';
import ProductsList from './components/admin/ProductsList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrdersList from './components/admin/OrdersList';
import ProcessOrder from './components/admin/ProcessOrder';
import UsersList from './components/admin/UsersList';
import UpdateUser from './components/admin/UpdateUser';
import ProductReviews from './components/admin/ProductReviews'




import store from './store';

// Payment
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const App = () => {
	const [stripeApiKey, setStripeApiKey] = useState('');
  useEffect(() => {
	  store.dispatch(loadUser());
	  async function getStripApiKey() {
			const { data } = await axios.get('/api/v1/stripeapi');

		  setStripeApiKey(data.stripeApiKey);
		  console.log(data.stripeApiKey)
		}

		getStripApiKey();
  }, [])
	 const { user, loading } = useSelector(
			(state) => state.auth,
		);
  return (
		<Router>
			<div className="App">
				<Header />
				<div className="container container-fluid">
					<Route path="/" component={Home} exact />
					<Route path="/search/:keyword" component={Home} />
					<Route path="/product/:id" component={ProductDetails} exact />
					<Route path="/cart" component={Cart} exact />
					<ProtectedRoute path="/shipping" component={Shipping} exact />
					<ProtectedRoute
						path="/order/confirm"
						component={ConfirmOrder}
						exact
					/>
					<ProtectedRoute path="/success" component={OrderSuccess} />
					{stripeApiKey && (
						<Elements stripe={loadStripe(stripeApiKey)}>
							<ProtectedRoute path="/payment" component={Payment} />
						</Elements>
					)}
					<Route path="/login" component={Login} />
					<Route path="/register" component={Register} />
					<Route path="/password/forgot" component={ForgotPassword} />
					<Route path="/password/reset/:token" component={NewPassword} />
					<ProtectedRoute path="/me" component={Profile} exact />
					<ProtectedRoute path="/me/update" component={UpdateProfile} exact />
					<ProtectedRoute
						path="/password/update"
						component={UpdatePassword}
						exact
					/>
					<ProtectedRoute path="/orders/me" component={ListOrders} exact />
					<ProtectedRoute path="/order/:id" component={OrderDetails} exact />
				</div>
				<ProtectedRoute
					path="/dashboard"
					isAdmin={true}
					component={Dashboard}
					exact
				/>
				<ProtectedRoute
					path="/admin/products"
					isAdmin={true}
					component={ProductsList}
					exact
				/>
				<ProtectedRoute
					path="/admin/product"
					isAdmin={true}
					component={NewProduct}
					exact
				/>
				<ProtectedRoute
					path="/admin/product/:id"
					isAdmin={true}
					component={UpdateProduct}
					exact
				/>
				<ProtectedRoute
					path="/admin/orders"
					isAdmin={true}
					component={OrdersList}
					exact
				/>
				<ProtectedRoute
					path="/admin/order/:id"
					isAdmin={true}
					component={ProcessOrder}
					exact
				/>
				<ProtectedRoute
					path="/admin/users"
					isAdmin={true}
					component={UsersList}
					exact
				/>
				<ProtectedRoute
					path="/admin/user/:id"
					isAdmin={true}
					component={UpdateUser}
					exact
				/>
				<ProtectedRoute
					path="/admin/reviews/"
					isAdmin={true}
					component={ProductReviews}
					exact
				/>
				{!loading && user && user.role !== 'admin' && <Footer />}
			</div>
		</Router>
	);
};

export default App;
 
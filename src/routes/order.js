import express from 'express';
import OrderController from '../controller/orderController';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth';

const router = express.Router();

router.post('/order/new', isAuthenticatedUser, OrderController.newOrder);
router.get('/order/:id', isAuthenticatedUser, OrderController.getSingleOrder);
router.get('/orders/me', isAuthenticatedUser, OrderController.myOrders);
router.get(
	'/admin/orders',
	isAuthenticatedUser,
	authorizeRoles('admin'),
	OrderController.allOrders,
);
router.patch(
	'/admin/order/:id',
	isAuthenticatedUser,
	authorizeRoles('admin'),
	OrderController.updateOrder,
);
router.delete(
	'/admin/order/:id',
	isAuthenticatedUser,
	authorizeRoles('admin'),
	OrderController.deleteOrder,
);
export default router;

/* eslint-disable no-unused-expressions */
import  Order from '../models/order';
import  Product from'../models/product';
import { errorResponse, successResponse } from '../utils/response';

const  updateStock=async (id, quantity) =>{
	const product = await Product.findById(id);
	if (product) {
		product.stock -= quantity;

		await product.save({ validateBeforeSave: false });
	}
	
}
class OrderController {
	// Create a new order   =>  /api/v1/order/new
	static async newOrder(req, res) {
		try {
			const {
				orderItems,
				shippingInfo,
				itemsPrice,
				taxPrice,
				shippingPrice,
				totalPrice,
				paymentInfo,
			} = req.body;

			const order = await Order.create({
				orderItems,
				shippingInfo,
				itemsPrice,
				taxPrice,
				shippingPrice,
				totalPrice,
				paymentInfo,
				paidAt: Date.now(),
				user: req.user.id,
			});

			return successResponse(res, 201, 'order created successfully', order);
		} catch (err) {
			return errorResponse(res, 400, err.message);
		}
	}

	// Get single order   =>   /api/v1/order/:id
	static async getSingleOrder(req, res) {
		try {
			const order = await Order.findById(req.params.id).populate(
				'user',
				'name email',
			);

			if (!order) {
				return errorResponse(res, 404, 'No Order found with this ID');
			}

			res.status(200).json({
				success: true,
				order,
			});
		} catch (err) {
			return errorResponse(res, 400, err.message);
		}
	}
	// Get all orders - ADMIN  =>   /api/v1/admin/orders/

	static async allOrders(req, res) {
		try {
			const orders = await Order.find();

			let totalAmount = 0;

			orders.forEach((order) => {
				totalAmount += order.totalPrice;
			});

			res.status(200).json({
				success: true,
				totalAmount,
				orders,
			});
		} catch (err) {
			return errorResponse(res, 400, err.message);
		}
	}

	// Update / Process order - ADMIN  =>   /api/v1/admin/order/:id
	static async updateOrder(req, res) {
		try {
			const order = await Order.findById(req.params.id);

			if (order.orderStatus === 'Delivered') {
				return errorResponse(res, 400, 'You have already delivered this order');
			}

			order.orderItems.forEach(async (item) => {
				await updateStock(item.product, item.quantity);
			});

			order.orderStatus = req.body.status;
			order.deliveredAt = Date.now();

			await order.save();

			res.status(200).json({
				success: true,
			});
		} catch (err) {
			return errorResponse(res, 400, err.message);
		}
	}

	// Get logged in user orders   =>   /api/v1/orders/me
	static async myOrders(req, res) {
		try {
			const orders = await Order.find({ user: req.user.id });

			res.status(200).json({
				success: true,
				orders,
			});
		} catch (err) {
			return errorResponse(res, 400, err.message);
		}
	}
	// Delete order   =>   /api/v1/admin/order/:id

	static async deleteOrder(req, res) {
		try {
			const order = await Order.findById(req.params.id);

			if (!order) {
				return errorResponse('No Order found with this ID', 404);
			}

			await order.remove();

			res.status(200).json({
				success: true,
			});
		}
		catch (err) {
			return errorResponse(res, 400, err.message);
		}
	}
}

export default OrderController;
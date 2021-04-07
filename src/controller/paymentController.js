import Stripe from 'stripe';
import dotenv from 'dotenv';
import { errorResponse  } from '../utils/response';


dotenv.config({ path: '../.env' });
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


// Process stripe payments   =>   /api/v1/payment/process
class PaymentController {
	static async processPayment(req, res) {
		try {
			const paymentIntent = await stripe.paymentIntents.create({
				amount: req.body.amount,
				currency: 'usd',

				metadata: { integration_check: 'accept_a_payment' },
			});

			res.status(200).json({
				success: true,
				client_secret: paymentIntent.client_secret,
			});
		} catch (err) {
			return errorResponse(res, 500, err.message);
		}
	}

	// Send stripe API Key   =>   /api/v1/stripeapi
	static async sendStripApi(req, res) {
		try {
			res.status(200).json({
				stripeApiKey: process.env.STRIPE_API_KEY,
			});
		}
	
		catch (err) {
			return errorResponse(res, 500, err.message);
		}
	}
}
export default PaymentController;
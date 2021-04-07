import express from 'express';
import PaymentController from '../controller/paymentController';
import { isAuthenticatedUser,  } from '../middleware/auth';

const router = express.Router();

router.route('/payment/process').post(isAuthenticatedUser, PaymentController.processPayment);
router.route('/stripeapi').get(isAuthenticatedUser, PaymentController.sendStripApi);

module.exports = router;

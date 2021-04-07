import express from 'express';

import ProductController from '../controller/productController';
import { isAuthenticatedUser ,authorizeRoles} from '../middleware/auth';

const router = express.Router();



router.get('/products',ProductController.getProducts);
router.get('/product/:id', ProductController.getSingleProduct);
router.post('/admin/product/new', isAuthenticatedUser,authorizeRoles('admin'), ProductController.newProduct);
router.patch('/admin/product/:id', isAuthenticatedUser,authorizeRoles('admin'), ProductController.updateProduct);
router.delete('/admin/product/:id',isAuthenticatedUser,authorizeRoles('admin'), ProductController.deleteProduct);
router.patch('/review', isAuthenticatedUser, ProductController.createProductReview);
router.get(
	'/reviews',
	isAuthenticatedUser,
	ProductController.getProductReviews,
);
router.delete(
	'/reviews',
	isAuthenticatedUser,
	ProductController.deleteReview,
);
export default router
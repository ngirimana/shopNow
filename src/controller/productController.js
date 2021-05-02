/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import cloudinary from 'cloudinary'
import Product from '../models/product';
import { errorResponse,}  from '../utils/response';
import APIFeatures from '../utils/apiFeatures';


class ProductController {
	/**
	 * Create Product =>/api/v1/product/new
	 * @param {object} req
	 * @param {Object} res
	 * @returns {object} of created product data
	 */
	static async newProduct(req, res) {
		   let images = []
		if (typeof req.body.images === 'string') {
			images.push(req.body.images)
		} else {
			images = req.body.images
		}

		const imagesLinks = [];

		for (let i = 0; i < images.length; i++) {
			const result = await cloudinary.v2.uploader.upload(images[i], {
				folder: 'products'
			});

			imagesLinks.push({
				public_id: result.public_id,
				url: result.secure_url
			})
		}

		req.body.images = imagesLinks
		req.body.user = req.user.id;

		const product = await Product.create(req.body);

		res.status(201).json({
			success: true,
			product
		})

	}

	/**
	 *  Get all Product => /api/v1/products
	 * @param {object} req
	 * @param {object} res
	 * @returns {Array } of all product in database
	 */
	static async getProducts(req, res) {
		try {
			const resPerPage = 8;
			const productsCount = await Product.countDocuments();

			const apiFeatures = new APIFeatures(Product.find(), req.query)
				.search()
				.filter();

			let products = await apiFeatures.query;
			const filteredProductsCount = products.length;

			apiFeatures.pagination(resPerPage);
			products = await apiFeatures.query;

			return res.status(200).json({
				status: 200,
				message: 'List of products from database',
				productsCount,
				resPerPage,
				filteredProductsCount,
				products,
			});
		} catch (err) {
			return errorResponse(res, 500, err.message);
		}
	}
	
	// Get all products (Admin)  =>   /api/v1/admin/products
	static async getAdminProducts(req, res) {
		try {
			const products = await Product.find();

			res.status(200).json({
				success: true,
				products,
			});
		}catch (err) {
			return errorResponse(res, 500, err.message);
		}
		
	};

	/**
	 * Get details for single product => /api/v1/products/:id
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} details of a single product
	 */
	static async getSingleProduct(req, res) {
		try {
			const product = await Product.findById(req.params.id);
			if (product) {
				return res.status(200).json({
					success: true,
					product,
				});
			}
			return errorResponse(res, 404, 'Product is not available');
		} catch (err) {
			return errorResponse(res, 400, err.message);
		}
	}

	/**
	 * update product details =>/api/v1/product/:id
	 * @param {object} req
	 * @param {object} res
	 * @returns {object } of details for updated product
	 */
	static async updateProduct(req, res) {
		try {
			 let product = await Product.findById(req.params.id);

			if (!product) {
				return errorResponse(res, 404, 'Product is not available');
			}

			let images = [];
			if (typeof req.body.images === 'string') {
				images.push(req.body.images);
			} else {
				images = req.body.images;
			}

			if (images !== undefined) {
				// Deleting images associated with the product
				for (let i = 0; i < product.images.length; i++) {
					const result = await cloudinary.v2.uploader.destroy(
						product.images[i].public_id,
					);
				}

				const imagesLinks = [];

				for (let i = 0; i < images.length; i++) {
					const result = await cloudinary.v2.uploader.upload(images[i], {
						folder: 'products',
					});

					imagesLinks.push({
						public_id: result.public_id,
						url: result.secure_url,
					});
				}

				req.body.images = imagesLinks;
			}

			product = await Product.findByIdAndUpdate(req.params.id, req.body, {
				new: true,
				runValidators: true,
				useFindAndModify: false,
			});

			res.status(200).json({
				success: true,
				product,
			});
			
		} catch (err) {
			return errorResponse(res, 400, err.message);
		}
	}

	/**
	 * Delete Product   =>   /api/v1/admin/product/:id
	 * @param {object} req
	 * @param {object} res
	 * @returns String message 'Product is deleted successfully.'
	 */

	static async deleteProduct(req, res) {
		try {
			const product = await Product.findById(req.params.id);

			if (!product) {
				return errorResponse(res, 404, 'Product is not available');
			}
			/**
			 * Deleting images associated with the product
			 */
			for (let i = 0; i < product.images.length; i++){
				const result= await cloudinary.v2.uploader.destroy(product.images[i].public_id)
			}

			await product.remove();
			res.status(200).json({
				success: true,
				message: 'Product is deleted.',
			})
		} catch (err) {
			return errorResponse(res, 400, err.message);
		}
	}

	// Create new review   =>   /api/v1/review
	static async createProductReview(req, res) {
		try {
			const { rating, comment, productId } = req.body;

			const review = {
				user: req.user._id,
				name: req.user.name,
				rating: Number(rating),
				comment,
			};

			const product = await Product.findById(productId);

			const isReviewed = product.reviews.find(
				(r) => r.user.toString() === req.user._id.toString(),
			);

			if (isReviewed) {
				product.reviews.forEach((review) => {
					if (review.user.toString() === req.user._id.toString()) {
						review.comment = comment;
						review.rating = rating;
					}
				});
			} else {
				product.reviews.push(review);
				product.numOfReviews = product.reviews.length;
			}

			product.ratings =
				product.reviews.reduce((acc, item) => item.rating + acc, 0) /
				product.reviews.length;

			await product.save({ validateBeforeSave: false });

			res.status(200).json({
				success: true,
			});
		} catch (err) {
			return errorResponse(res, 400, err.message);
		}
	}

	// Get Product Reviews   =>   /api/v1/reviews
	static async getProductReviews(req, res) {
		try {
			const product = await Product.findById(req.query.id);

			res.status(200).json({
				success: true,
				reviews: product.reviews,
			});
		} catch (err) {
			return errorResponse(res, 400, err.message);
		}
	}
	// Delete Product Review   =>   /api/v1/reviews

	static async deleteReview(req, res) {
		try {
			const product = await Product.findById(req.query.productId);

			console.log(product);

			const reviews = product.reviews.filter(
				(review) => review._id.toString() !== req.query.id.toString(),
			);

			const numOfReviews = reviews.length;

			const ratings =
				product.reviews.reduce((acc, item) => item.rating + acc, 0) /
				reviews.length;

			await Product.findByIdAndUpdate(
				req.query.productId,
				{
					reviews,
					ratings,
					numOfReviews,
				},
				{
					new: true,
					runValidators: true,
					useFindAndModify: false,
				},
			);

			res.status(200).json({
				success: true,
			});
		} catch (err) {
			return errorResponse(res, 500, err.message);
		}
	}
}
export default ProductController;

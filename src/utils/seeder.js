import Product from '../models/product';
import connectDatabase from '../config/database';
import products from '../data/products';



connectDatabase();

const seedProducts = async () => {
	try {
		await Product.deleteMany();
		process.stdout.write('Products are deleted');

		await Product.insertMany(products);
		process.stdout.write('All Products are added.');

		process.exit();
	} catch (error) {
		process.stdout.write(error.message);
		process.exit();
	}
};

seedProducts();

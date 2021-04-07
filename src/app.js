import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import products from './routes/product';
import auth from './routes/auth';
import order from './routes/order';
import payment from './routes/payment';

dotenv.config();
const app = express();


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// setting up cloudinary configuration

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// import all routes
app.use('/api/v1', products);
app.use('/api/v1/auth', auth);
app.use('/api/v1', order);
app.use('/api/v1', payment);
app.use("/", (req, res) => {
	res.status(200).send({
		status: 200,
		message: "Welcome To ShopNow",
	});
});



export default app;

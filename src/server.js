import dotenv from 'dotenv';
import app from './app';
import connectDatabase from './config/database';

/**
 * Handle Uncaught exceptions
 */
process.on('uncaughtException', err => {
	process.stdout.write(`ERROR: ${err.stack}`);
	process.stdout.write('Shutting down due to uncaught exception');
	process.exit(1)
})




dotenv.config({ path: '../.env' });

const port = process.env.PORT || 4000;
connectDatabase()
app.listen(port, () =>
	process.stdout.write(`Listening on port ${port} ... \n`),
);

/**  
 * Handle Unhandled Promise rejections
*/

process.on('unhandledRejection', err => {
	process.stdout.write(`ERROR: ${err.stack}`);
	process.stdout.write('Shutting down the server due to Unhandled Promise rejection');
	app.close(() => {
		process.exit(1)
	})
})
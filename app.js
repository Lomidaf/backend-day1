const express = require('express');
const echoRoute = require('./node_app/controller/echo');
const todoRoute = require('./node_app/controller/todo');
const {connectDB,disconnectDB} = require('./db/dbutils')
const httpShutdown = require("http-shutdown");

const main = async () => {
    connectDB();
    var app = express();
    var port = 3000;

    const dotenv = require('dotenv')
    dotenv.config()

    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

    app.use('/echo',echoRoute);
    app.use('/todo',todoRoute);

    // Error handler
    // app.use();


    var server = httpShutdown(app.listen(port));
    console.log("Connect to port 3000")
    
    var called = false;
	const shutdown = () => {
		if (called) return;
		called = true;
		console.log("shutdown");
		server.shutdown(async (err) => {
			try {
				await disconnectDB();
				console.log("disconnect");
				return process.exit(0);
			} catch (e) {
				err = e;
			}
			console.error(err);
			return process.exit(1);
		});
	};

    process.once("SIGINT", shutdown).once("SIGTERM", shutdown);
}

main()





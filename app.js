require('express-async-error');
const express = require('express');
const echoRoute = require('./node_app/controller/echo');
const todoRoute = require('./node_app/controller/todo');
const userRoute = require('./node_app/controller/user');
const {connectDB,disconnectDB} = require('./db/dbutils');
const httpShutdown = require("http-shutdown");
const dotenv = require('dotenv')
dotenv.config()

const main = async () => {
    await connectDB();

    const path = require('path');
    var app = express();
    var port = process.env.PORT || 3000;


    const morgan = require('morgan')
    app.use(morgan("tiny"))

    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

    app.use('/public',express.static("public"))
    app.use('/echo',echoRoute);
    app.use('/todo',todoRoute);
    app.use('/user',userRoute);

    app.use((req, res) => {
        res.setHeader('content-type', 'text/html');
        res.sendFile(path.join(__dirname,"public","index.html"))
    });
    
    app.use((err,req, res, next) => {
        res.status(500).json({err:err.message, tor:true});
    })

    app.use((err,req, res, next) => {
        res.status(500).json({err:err.message, tor:true});
    })


    var server = httpShutdown(app.listen(port));
    console.log(`Connect to port ${port}`)
    
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





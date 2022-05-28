require('dotenv').config()
require('express-async-errors');

const express = require('express');
const app = express();

// rest of the packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

// connect to db
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');

// middlewares
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddlware = require('./middleware/error-handler');

app.use(morgan('tiny')); // allows one to knoow which routes have been accessed
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET)); // access the cookie, want to pass in the secret to sign the cookies

app.use(express.static('./public'));
app.use(fileUpload());

app.get('/', (req, res) => {
    return res.send("hi world");
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddlware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`app is listening on port number ${port}`);
        });
    } catch (err) {
        console.log(err);
    }
};

start();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json({
    limit:'32kb'
}))

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));


app.use(express.urlencoded({
    limit:'32kb',
    extended:true
}))
app.use(cookieParser());
app.use(express.static('public'));




//routes import
import userRouter from './routes/user.routes.js';
//routes declaration
app.use("/api/v1/users", userRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

export { app }
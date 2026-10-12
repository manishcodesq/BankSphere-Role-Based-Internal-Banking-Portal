import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";

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
app.use(passport.initialize());
app.use(express.static('public'));




//routes import
import userRouter from './routes/user.routes.js';
import accountRouter from './routes/account.routes.js';
import transactionRouter from './routes/transaction.routes.js';
import googleRouter from './routes/google.routes.js';
import customerRouter from './routes/customer.routes.js';
import employeeRouter from './routes/employee.routes.js';
import managerRouter from './routes/manager.routes.js';
import adminRouter from './routes/admin.routes.js';
//routes declaration
app.use("/auth", googleRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/accounts", accountRouter);
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/employee", employeeRouter);
app.use("/api/v1/manager", managerRouter);
app.use("/api/v1/admin", adminRouter);



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
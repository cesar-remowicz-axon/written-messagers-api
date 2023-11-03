import cookieParser from "cookie-parser";
import apiRouter from "./api/router";
import express from "express";
import RouteParams from "./api/utils/routeParameters";
import cors from 'cors';

const app = express();
app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(RouteParams.sanitizeReq);
app.use("/messagers/api/v1", apiRouter);

export default app;
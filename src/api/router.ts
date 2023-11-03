
import { Router } from 'express';
import UserData from './controllers/getUserData.controllers';

// /api/v1/
const apiRouter = Router();

apiRouter.route("/sendData")
    .post(UserData.post)

export default apiRouter;
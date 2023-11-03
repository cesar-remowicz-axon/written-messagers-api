import { Request, Response } from 'express';
import UserDataServicePost from '../services/userData.service';

export default class UserData {

    public static async post(req: Request, res: Response) {
        return new UserDataServicePost().post(req, res)
    }

}
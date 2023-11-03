import { Request, Response } from "express";
import { createClient } from '@supabase/supabase-js';

export default class UserDataServicePost {

    public async post(req: Request, res: Response): Promise<Record<string, any>> {

        const apiResponse: any = req.body;
        const { name, email, phone, msg, age } = apiResponse;

        const url = process.env['SUPABASE_URL'] || '';
        const key = process.env['SUPABASE_KEY'] || '';
        const supabase = createClient(url, key);
        const tableName = process.env['TABLE_CONTAINER_OF_USERS_MSGS'] || '';
        const columnUserName = process.env['COLUMN_USER_NAME'] || '';
        const columnEmail = process.env['COLUMN_FOR_USER_EMAIL'] || '';
        const columnUserPhone = process.env['COLUMN_USER_PHONE'] || '';
        const columnMsg = process.env['COLUMN_USER_MSG'] || '';
        const columnBirthday = process.env['COLUMN_FOR_BIRTHDAY_DATE'] || '';

        if (!msg) return res.status(200).json(apiResponse);

        await supabase.from(tableName).insert({ [columnUserName]: name, [columnEmail]: email, [columnUserPhone]: phone, [columnMsg]: msg, [columnBirthday]: age });
        apiResponse['message'] = 'Success';
        return res.status(200).json(apiResponse);
    };

}
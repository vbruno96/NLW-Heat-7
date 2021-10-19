import { Request, Response } from 'express';
import { GetLastMessageService } from '../services/GetLastMessageService';



class GetLastMessageController {
    async handle(req: Request, res: Response) {

        const service = new GetLastMessageService();
        
        const result = await service.execute();

        return res.json(result);
    }
}

export { GetLastMessageController }
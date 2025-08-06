import { type Request, type Response } from "express";
export declare class PaymentController {
    private monnify;
    private mail;
    initializePayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
    verifyPayment(req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
}
//# sourceMappingURL=PaymentController.d.ts.map
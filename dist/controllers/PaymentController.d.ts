import { type Request, type Response } from "express";
export declare class PaymentController {
    private monnify;
    private mail;
    handlePaymentStatus(req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
}
//# sourceMappingURL=PaymentController.d.ts.map
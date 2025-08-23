import { type Request, type Response } from "express";
export declare class PaymentController {
    private monnify;
    private mail;
    private jotform;
    initializePayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
    verifyPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=Payment.controller.d.ts.map
/**
 * Service to interact with Monnify API for payment transactions
 */
export declare class MonnifyService {
    private baseUrl;
    private apiKey;
    private secretKey;
    private contractCode;
    private getAccessToken;
    initializeTransaction(data: any): Promise<string>;
    verifyTransaction(paymentReference: string): Promise<any>;
}
//# sourceMappingURL=MonnifyService.d.ts.map
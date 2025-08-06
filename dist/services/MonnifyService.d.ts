export declare class MonnifyService {
    private baseUrl;
    private apiKey;
    private secretKey;
    getAccessToken(): Promise<string>;
    initializeTransaction(data: any): Promise<string>;
    verifyTransaction(paymentReference: string): Promise<any>;
}
//# sourceMappingURL=MonnifyService.d.ts.map
export declare class MonnifyService {
    private baseUrl;
    private apiKey;
    private secretKey;
    getAccessToken(): Promise<string>;
    verifyTransaction(paymentReference: string, token: string): Promise<any>;
}
//# sourceMappingURL=MonnifyService.d.ts.map
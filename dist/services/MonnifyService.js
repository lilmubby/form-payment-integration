import axios from "axios";
import { config } from "../config/env.js";
export class MonnifyService {
    baseUrl = config.MONNIFY_BASE_URL;
    apiKey = config.MONNIFY_API_KEY;
    secretKey = config.MONNIFY_SECRET_KEY;
    contractCode = config.MONNIFY_CONTRACT_CODE;
    async getAccessToken() {
        console.log("access token", this.baseUrl);
        const authString = Buffer.from(`${this.apiKey}:${this.secretKey}`).toString("base64");
        const res = await axios.post(`${this.baseUrl}/api/v1/auth/login`, {}, {
            headers: {
                Authorization: `Basic ${authString}`
            }
        });
        return res.data.responseBody.accessToken;
    }
    async initializeTransaction(data) {
        console.log("initialze payment");
        const token = await this.getAccessToken();
        const paymentReference = `REF-${Date.now()}`;
        const payload = {
            amount: data.amount,
            customerName: data.name,
            customerEmail: data.email,
            paymentReference,
            paymentDescription: "Form Payment",
            currencyCode: "NGN",
            contractCode: this.contractCode,
            redirectUrl: `${config.REDIRECT_PAYMENT_URL}?${paymentReference}`,
            paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
        };
        const response = await axios.post(`${config.MONNIFY_BASE_URL}/merchant/transactions/init-transaction`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.responseBody.checkoutUrl;
    }
    async verifyTransaction(paymentReference) {
        const token = await this.getAccessToken();
        const res = await axios.get(`${this.baseUrl}/api/v2/transactions/${paymentReference}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.responseBody;
    }
}
//# sourceMappingURL=MonnifyService.js.map
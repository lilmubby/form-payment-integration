import axios from "axios";
import { config } from "../config/env.js";

export class MonnifyService {
  private baseUrl = config.MONNIFY_BASE_URL;
  private apiKey = config.MONNIFY_API_KEY;
  private secretKey = config.MONNIFY_SECRET_KEY;

  async getAccessToken(): Promise<string> {
    const res = await axios.post(`${this.baseUrl}/api/v1/auth/login`, {
      apiKey: this.apiKey,
      secretKey: this.secretKey,
    });
    return res.data.responseBody.accessToken;
  }

  async initializeTransaction(data: any): Promise<string> {
    const token = await this.getAccessToken();

    const paymentReference = `REF-${Date.now()}`
    
    const payload = {
      amount: data.amount,
      customerName: data.name,
      customerEmail: data.email,
      paymentReference,
      paymentDescription: "Form Payment",
      currencyCode: "NGN",
      // contractCode: this.contractCode,
      redirectUrl: `${config.REDIRECT_PAYMENT_URL}?${paymentReference}`,
    };

    const response = await axios.post(`${config.MONNIFY_BASE_URL}/merchant/transactions/init-transaction`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.responseBody.checkoutUrl;
  }

  async verifyTransaction(paymentReference: string) {
    const token = await this.getAccessToken();

    const res = await axios.get(`${this.baseUrl}/api/v2/transactions/${paymentReference}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.responseBody;
  }
}

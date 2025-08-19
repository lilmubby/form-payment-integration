import axios from "axios";
import { config } from "../config/env.js";

export class MonnifyService {
  private baseUrl = config.MONNIFY_BASE_URL;
  private apiKey = config.MONNIFY_API_KEY;
  private secretKey = config.MONNIFY_SECRET_KEY;
  private contractCode = config.MONNIFY_CONTRACT_CODE;

  private async getAccessToken(): Promise<string> {
    const authString = Buffer.from(`${this.apiKey}:${this.secretKey}`).toString("base64");

    const res = await axios.post(`${this.baseUrl}/api/v1/auth/login`, {}, {
      headers: {
        Authorization: `Basic ${authString}`
      }
    });

    return res.data.responseBody.accessToken;
  }

  async initializeTransaction(data: any): Promise<string> {
    const token = await this.getAccessToken();
    
    const paymentReference = `REF-${Date.now()}`
    
    const payload = {
      amount: data.amount,
      customerName: `${data.first} ${data.last}`,
      customerEmail: data.email,
      paymentReference,
      paymentDescription: "Form Payment",
      currencyCode: "NGN",
      contractCode: this.contractCode,
      // redirectUrl: `${config.REDIRECT_PAYMENT_URL}?${paymentReference}`,
      redirectUrl: `${config.REDIRECT_PAYMENT_URL}`,
      paymentMethods: ["CARD","ACCOUNT_TRANSFER"],
      metaData: {
        firstName: data.first,
        lastName: data.last,
        email: data.email,
        phone: data.phone,
        amount: data.amount,
        paymentReference,
        submission_id: data.submission_id,
        deliverytype: data.deliverytype,
        deliveryaddress: data?.deliveryaddress || "",
        ip: data.ip || "",
      }
    };
    const response = await axios.post(`${config.MONNIFY_BASE_URL}/api/v1/merchant/transactions/init-transaction`, payload, {
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

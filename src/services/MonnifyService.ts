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

  async verifyTransaction(paymentReference: string, token: string) {
    const res = await axios.get(`${this.baseUrl}/api/v2/transactions/${paymentReference}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.responseBody;
  }
}

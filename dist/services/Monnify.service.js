import axios from "axios";
import { config } from "../config/env.js";
import logger from "../util/logger.js";
/**
 * Service to interact with Monnify API for payment transactions
 */
export class MonnifyService {
    baseUrl = config.MONNIFY_BASE_URL;
    apiKey = config.MONNIFY_API_KEY;
    secretKey = config.MONNIFY_SECRET_KEY;
    contractCode = config.MONNIFY_CONTRACT_CODE;
    async getAccessToken() {
        const authString = Buffer.from(`${this.apiKey}:${this.secretKey}`).toString("base64");
        const res = await axios.post(`${this.baseUrl}/api/v1/auth/login`, {}, {
            headers: {
                Authorization: `Basic ${authString}`
            }
        });
        return res.data.responseBody.accessToken;
    }
    async initializeTransaction(data) {
        const token = await this.getAccessToken();
        const paymentReference = `REF-${Date.now()}`;
        const customerName = `${data.name.first} ${data.name.last}`;
        const redirectUrl = `${config.REDIRECT_PAYMENT_URL}?${paymentReference}`;
        const body = {
            amount: data.amount,
            customerName,
            customerEmail: data.email,
            paymentReference,
            paymentDescription: "Form Payment",
            currencyCode: "NGN",
            contractCode: this.contractCode,
            redirectUrl,
            paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
            metaData: {
                firstName: data.name.first,
                lastName: data.name.last,
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
        const response = await axios.post(`${config.MONNIFY_BASE_URL}/api/v1/merchant/transactions/init-transaction`, body, {
            headers: { Authorization: `Bearer ${token}` },
        });
        logger.info("Monnify transaction initialized: \n", { body: response.data });
        return response.data.responseBody.checkoutUrl;
    }
    async verifyTransaction(paymentReference) {
        const token = await this.getAccessToken();
        logger.info("Verifying Monnify transaction Initiated");
        const encodedRef = encodeURIComponent(paymentReference);
        const res = await axios.get(`${config.MONNIFY_BASE_URL}/api/v2/transactions/${encodedRef}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Monnify transaction verified: ", res.data);
        return res.data.responseBody;
    }
}
//# sourceMappingURL=Monnify.service.js.map
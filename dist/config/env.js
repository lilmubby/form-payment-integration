import dotenv from "dotenv";
dotenv.config();
export const config = {
    PORT: process.env.PORT || 5050,
    MONNIFY_API_KEY: process.env.MONNIFY_API_KEY,
    MONNIFY_SECRET_KEY: process.env.MONNIFY_SECRET_KEY,
    MONNIFY_CONTRACT_CODE: process.env.MONNIFY_CONTRACT_CODE,
    MONNIFY_BASE_URL: process.env.MONNIFY_BASE_URL,
    JOTFORM_API_KEY: process.env.JOTFORM_API_KEY,
    JOTFORM_FORM_ID: process.env.JOTFORM_FORM_ID,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    REDIRECT_SUCCESS_URL: process.env.REDIRECT_SUCCESS_URL,
    REDIRECT_FAILED_URL: process.env.REDIRECT_FAILED_URL,
    REDIRECT_PAYMENT_URL: process.env.REDIRECT_PAYMENT_URL,
};
//# sourceMappingURL=env.js.map
import nodemailer from "nodemailer";
import { config } from "../config/env.js";
export class MailService {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASS,
        },
    });
    async sendEmail(transactionResponse) {
        const isPaid = transactionResponse.paymentStatus === "PAID";
        const userName = transactionResponse.customer.name || "Unknown";
        const userEmail = transactionResponse.customer.email || "";
        const paymentMethod = transactionResponse.paymentMethod || "N/A";
        const amount = transactionResponse.amount || 0;
        const subjectStatus = isPaid ? "SUCCESS" : "FAILED";
        const subject = `[Payment ${subjectStatus}] ${userName} — ${paymentMethod}`;
        const body = `
      Hello ${userName.split(" ")[0] || "Customer"},

      A payment attempt has been made by:

      Name: ${userName}
      Email: ${userEmail}
      Amount: ₦${amount}
      Payment Method: ${paymentMethod}
      Status: ${subjectStatus}

      Thank you,
      JotForm-Monnify Payment System
      `;
        await this.transporter.sendMail({
            from: `"Payment System" <${config.EMAIL_USER}>`,
            to: [userEmail, config.ADMIN_EMAIL],
            subject,
            text: body,
        });
    }
}
// {
//   requestSuccessful: true,
//   responseMessage: 'success',
//   responseCode: '0',
//   responseBody: {
//     transactionReference: 'MNFY|24|20250821165833|000391',
//     paymentReference: 'REF-1755791912942',
//     amountPaid: '15000.00',
//     totalPayable: '15000.00',
//     settlementAmount: '14990.00',
//     paidOn: '2025-08-21 16:59:00.0',
//     paymentStatus: 'PAID',
//     paymentDescription: 'Form Payment',
//     currency: 'NGN',
//     paymentMethod: 'CARD',
//     product: { type: 'WEB_SDK', reference: 'REF-1755791912942' },
//     cardDetails: {
//       cardType: 'Sandbox Card Scheme',
//       last4: '1111',
//       expMonth: '09',
//       expYear: '23',
//       bin: '411111',
//       bankCode: null,
//       bankName: null,
//       reusable: false,
//       countryCode: null,
//       cardToken: null,
//       supportsTokenization: false,
//       maskedPan: '411111******1111'
//     },
//     accountDetails: null,
//     accountPayments: [],
//     customer: { email: 'example@example.com', name: 'sarki ihima' },
//     metaData: {
//       firstName: 'sarki',
//       lastName: 'ihima',
//       submission_id: '6316011108018067227',
//       amount: '15000',
//       paymentReference: 'REF-1755791912942',
//       ip: '105.119.0.108',
//       deliverytype: 'Delivery',
//       deliveryaddress: '',
//       email: 'example@example.com'
//     }
//   }
// }
//# sourceMappingURL=MailService.js.map
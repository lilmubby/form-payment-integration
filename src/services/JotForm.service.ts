// src/services/JotformService.ts
import axios from "axios";
import logger from "../util/logger.js";
import {config} from "../config/env.js";

class JotformService {
  async submitForm(paymentData: any) {
    logger.info("Submitting form to Jotform", { reference: paymentData.paymentReference });

    try {
      const response = await axios.post(
        `https://api.jotform.com/form/${config.JOTFORM_FORM_ID}/submissions?apiKey=${config.JOTFORM_API_KEY}`,
        {
          submission: {
            ...paymentData,
          },
        }
      );

      logger.info("Jotform submission success", { reference: paymentData.paymentReference });
      return response.data;
    } catch (err: any) {
      logger.error("Jotform submission failed", { error: err.message });
      throw err;
    }
  }
  async deleteSubmission(submissionId: string) {
    try {
      const response = await axios.delete(
        `https://api.jotform.com/submission/${submissionId}?apiKey=${config.JOTFORM_API_KEY}`
      );
      logger.info("Jotform submission deleted", { submissionId });
      return response.data;
    } catch (err: any) {
      logger.error("Failed to delete Jotform submission", { error: err.message });
      throw err;
    }
  }
}

export default JotformService;

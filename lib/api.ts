import { apiRequest } from "./queryClient";
import type { InsertQuestionnaireResponse, InsertProfessionalSignup } from "../shared/schema";

export const api = {
  questionnaire: {
    submit: (data: InsertQuestionnaireResponse) =>
      apiRequest("POST", "/api/questionnaire/submit", data),
    getResponses: () => apiRequest("GET", "/api/questionnaire/responses"),
  },
  professionals: {
    create: (data: InsertProfessionalSignup) =>
      apiRequest("POST", "/api/professionals", data),
    getAll: () => apiRequest("GET", "/api/professionals"),
  },
};

/**
 * Check components index file
 * Centralizes all exports for easier imports
 */

// Client Components
export {
  CheckFormCard,
  CNPJCheckForm,
  CPFCheckForm,
  EmailCheckForm,
} from "./check-form-cards";
export {
  CheckFormsGrid,
  CheckInstructions,
  CheckPageContainer,
  CheckPageHeader,
} from "./check-page-layout";

// Server Components
export {
  CheckLoadingDisplay,
  CheckResultDisplay,
} from "./check-result-display";
// Types
export type {
  CheckCardProps,
  CheckFormProps,
  CheckRequestBody,
  CheckResult,
  CheckType,
} from "./types";
// Utils
export {
  formatCNPJ,
  formatCPF,
  getFormattingFunction,
  getMaxLength,
  getValidationFunction,
  performCheck,
  removeFormatting,
  validateCNPJFormat,
  validateCPFFormat,
  validateEmail,
} from "./utils";

/**
 * Types and interfaces for Check components
 * Used across email, CPF, and CNPJ verification features
 */

export interface CheckResult {
  success?: boolean;
  exists?: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface CheckFormProps {
  onResult?: (result: CheckResult | null) => void;
  disabled?: boolean;
  className?: string;
}

export interface CheckRequestBody {
  TERM: string;
}

export type CheckType = "email" | "cpf" | "cnpj";

export interface CheckCardProps {
  title: string;
  description: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onCheck: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  loading: boolean;
  result: CheckResult | null;
  type: CheckType;
  maxLength?: number;
}

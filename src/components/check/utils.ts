/**
 * Utility functions for Check components
 * Handles formatting, validation, and API calls
 */

import type { CheckRequestBody, CheckResult, CheckType } from "./types";

/**
 * Format CPF with mask: 000.000.000-00
 */
export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, "");
  return numbers
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{2})$/, "$1-$2")
    .slice(0, 14);
}

/**
 * Format CNPJ with mask: 00.000.000/0000-00
 */
export function formatCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, "");
  return numbers
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{2})$/, "$1-$2")
    .slice(0, 18);
}

/**
 * Remove all non-numeric characters
 */
export function removeFormatting(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Basic CPF validation (format only, not algorithm)
 */
export function validateCPFFormat(cpf: string): boolean {
  const numbers = removeFormatting(cpf);
  return numbers.length === 11;
}

/**
 * Basic CNPJ validation (format only, not algorithm)
 */
export function validateCNPJFormat(cnpj: string): boolean {
  const numbers = removeFormatting(cnpj);
  return numbers.length === 14;
}

/**
 * Generic API call for check endpoints
 */
export async function performCheck(
  type: CheckType,
  term: string,
): Promise<CheckResult> {
  try {
    const endpoint = `/api/check/${type}`;
    const body: CheckRequestBody = {
      TERM: type === "email" ? term : removeFormatting(term),
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error checking ${type}:`, error);
    return {
      error: `Erro ao verificar ${type.toUpperCase()}`,
    };
  }
}

/**
 * Get validation function for specific check type
 */
export function getValidationFunction(
  type: CheckType,
): (value: string) => boolean {
  switch (type) {
    case "email":
      return validateEmail;
    case "cpf":
      return validateCPFFormat;
    case "cnpj":
      return validateCNPJFormat;
    default:
      return () => false;
  }
}

/**
 * Get formatting function for specific check type
 */
export function getFormattingFunction(
  type: CheckType,
): (value: string) => string {
  switch (type) {
    case "cpf":
      return formatCPF;
    case "cnpj":
      return formatCNPJ;
    default:
      return (value: string) => value;
  }
}

/**
 * Get max length for input based on type
 */
export function getMaxLength(type: CheckType): number {
  switch (type) {
    case "cpf":
      return 14; // 000.000.000-00
    case "cnpj":
      return 18; // 00.000.000/0000-00
    default:
      return 255;
  }
}

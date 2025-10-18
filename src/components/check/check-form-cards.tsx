/**
 * Generic Client Component for check forms
 * Handles interactivity for email, CPF, and CNPJ verification
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckResultDisplay } from "./check-result-display";
import type { CheckResult, CheckType } from "./types";
import {
  getFormattingFunction,
  getMaxLength,
  getValidationFunction,
  performCheck,
} from "./utils";

interface CheckFormCardProps {
  type: CheckType;
  title: string;
  description: string;
  placeholder: string;
  inputId: string;
  inputType?: string;
  className?: string;
}

/**
 * Reusable Client Component for check forms
 *
 * Features:
 * - Automatic formatting based on type
 * - Real-time validation
 * - Loading states
 * - Error handling
 * - Keyboard shortcuts (Enter to submit)
 */
export function CheckFormCard({
  type,
  title,
  description,
  placeholder,
  inputId,
  inputType = "text",
  className = "",
}: CheckFormCardProps) {
  // Component state
  const [value, setValue] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Get utility functions for this check type
  const validateInput = getValidationFunction(type);
  const formatInput = getFormattingFunction(type);
  const maxLength = getMaxLength(type);

  /**
   * Handle input change with automatic formatting
   */
  const handleInputChange = (inputValue: string) => {
    const formattedValue = formatInput(inputValue);
    setValue(formattedValue);

    // Clear previous result when user types
    if (result) {
      setResult(null);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    // Validate input before submitting
    if (!value.trim()) return;

    // For non-email types, also validate format
    if (type !== "email" && !validateInput(value)) {
      setResult({
        error: `Formato de ${type.toUpperCase()} inválido`,
      });
      return;
    }

    // Start loading state
    setLoading(true);
    setResult(null);

    try {
      // Perform API call
      const checkResult = await performCheck(type, value);
      setResult(checkResult);
    } catch (error) {
      console.error(`Error in ${type} check:`, error);
      setResult({
        error: `Erro ao verificar ${type.toUpperCase()}`,
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle keyboard events
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Determine if submit button should be disabled
  const isSubmitDisabled = loading || !value.trim();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Input field */}
        <div className="space-y-2">
          <Label htmlFor={inputId}>{type.toUpperCase()}</Label>
          <Input
            id={inputId}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyPress}
            maxLength={maxLength > 255 ? undefined : maxLength}
            disabled={loading}
            className="w-full"
          />
        </div>

        {/* Submit button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="w-full"
          variant={loading ? "secondary" : "default"}
        >
          {loading ? `Verificando...` : `Verificar ${type.toUpperCase()}`}
        </Button>

        {/* Result display */}
        <CheckResultDisplay result={result} type={type} />
      </CardContent>
    </Card>
  );
}

/**
 * Specialized Email Check Component
 */
export function EmailCheckForm({ className }: { className?: string }) {
  return (
    <CheckFormCard
      type="email"
      title="Verificar Email"
      description="Informe um email para verificar se já está cadastrado"
      placeholder="teste@exemplo.com"
      inputId="email"
      inputType="email"
      className={className}
    />
  );
}

/**
 * Specialized CPF Check Component
 */
export function CPFCheckForm({ className }: { className?: string }) {
  return (
    <CheckFormCard
      type="cpf"
      title="Verificar CPF"
      description="Informe um CPF para verificar se já está cadastrado"
      placeholder="000.000.000-00"
      inputId="cpf"
      className={className}
    />
  );
}

/**
 * Specialized CNPJ Check Component
 */
export function CNPJCheckForm({ className }: { className?: string }) {
  return (
    <CheckFormCard
      type="cnpj"
      title="Verificar CNPJ"
      description="Informe um CNPJ para verificar se já está cadastrado"
      placeholder="00.000.000/0000-00"
      inputId="cnpj"
      className={className}
    />
  );
}

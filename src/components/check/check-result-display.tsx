/**
 * Server Component for displaying check results
 * Pure presentational component without client-side state
 */

import type { CheckResult, CheckType } from "./types";

interface CheckResultDisplayProps {
  result: CheckResult | null;
  type: CheckType;
  className?: string;
}

/**
 * Server Component that renders check results
 *
 * Displays different styles based on result status:
 * - Error: Red/destructive styling
 * - Found (exists=true): Orange/warning styling
 * - Not found (exists=false): Green/success styling
 */
export function CheckResultDisplay({
  result,
  type,
  className = "",
}: CheckResultDisplayProps) {
  if (!result) return null;

  // Handle error state
  if (result.error) {
    return (
      <div
        className={`bg-destructive/10 border-destructive/20 mt-3 rounded-md border p-3 ${className}`}
      >
        <p className="text-destructive text-sm">{result.error}</p>
      </div>
    );
  }

  // Determine if item was found based on exists property
  const isFound = result.exists === true;

  // Generate appropriate message
  const message =
    result.message ||
    (isFound
      ? `${type.toUpperCase()} encontrado`
      : `${type.toUpperCase()} não encontrado`);

  // Apply conditional styling based on found status
  const containerClass = isFound
    ? "border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30"
    : "border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30";

  const textClass = isFound
    ? "text-orange-700 dark:text-orange-300"
    : "text-green-700 dark:text-green-300";

  return (
    <div className={`mt-3 rounded-md p-3 ${containerClass} ${className}`}>
      <p className={`text-sm ${textClass}`}>{message}</p>
    </div>
  );
}

/**
 * Server Component for loading state display
 */
export function CheckLoadingDisplay({
  type,
  className = "",
}: {
  type: CheckType;
  className?: string;
}) {
  return (
    <div
      className={`mt-3 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30 ${className}`}
    >
      <p className="text-blue-700 dark:text-blue-300 text-sm">
        Verificando {type.toUpperCase()}...
      </p>
    </div>
  );
}

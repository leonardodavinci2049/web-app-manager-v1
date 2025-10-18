/**
 * Test Check Page - Server Component
 *
 * Demonstrates data verification functionality for Email, CPF, and CNPJ.
 * Refactored to follow Next.js 15 best practices:
 * - Server Component by default
 * - Client Components isolated for interactivity
 * - Proper component composition
 * - Reusable utilities and types
 */

import {
  CheckFormsGrid,
  CheckInstructions,
  CheckPageContainer,
  CheckPageHeader,
  CNPJCheckForm,
  CPFCheckForm,
  EmailCheckForm,
} from "@/components/check";

/**
 * Main Check Page - Server Component
 *
 * Composes all check-related components in a clean, maintainable way.
 * Each interactive form is isolated as a Client Component while
 * static content remains as Server Components.
 */
export default function CheckPage() {
  return (
    <CheckPageContainer>
      {/* Static page header */}
      <CheckPageHeader />

      {/* Grid of check forms - each is an isolated Client Component */}
      <CheckFormsGrid>
        <EmailCheckForm />
        <CPFCheckForm />
        <CNPJCheckForm />
      </CheckFormsGrid>

      {/* Static instructions */}
      <CheckInstructions />
    </CheckPageContainer>
  );
}

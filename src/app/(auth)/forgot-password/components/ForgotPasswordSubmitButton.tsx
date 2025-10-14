import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

// Componente do botão de submit especializado para forgot password
const ForgotPasswordSubmitButton = () => {
  const { pending } = useFormStatus();
  const { t } = useTranslation();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Enviando...
        </>
      ) : (
        t("auth.forgotPassword.sendInstructions")
      )}
    </Button>
  );
};

export default ForgotPasswordSubmitButton;

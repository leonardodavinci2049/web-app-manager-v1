import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

// Componente do botão de submit com estado de loading
const SubmitButton = () => {
  const { pending } = useFormStatus();
  const { t } = useTranslation();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t("auth.login.loggingIn")}
        </>
      ) : (
        t("auth.login.loginButton")
      )}
    </Button>
  );
};

export default SubmitButton;

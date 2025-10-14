import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface VerifyEmailProps {
  userName: string;
  resetUrl: string;
  userEmail: string;
}

const TemplateForgotPasswordEmail = (props: VerifyEmailProps) => {
  const { userName, resetUrl, userEmail } = props;

  return (
    <Html lang="pt" dir="ltr">
      <Head />
      <Preview>Redefinir sua senha - Ação necessária</Preview>
      <Tailwind>
        <Body className="bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[40px] shadow-sm">
            {/* Header */}
            <Section className="mb-[32px] text-center">
              <Heading className="m-0 mb-[8px] text-[32px] font-bold text-gray-900">
                Solicitação de Redefinição de Senha
              </Heading>
              <Text className="m-0 text-[16px] text-gray-600">
                Recebemos uma solicitação para redefinir sua senha
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="mb-[16px] text-[16px] leading-[24px] text-gray-700">
                Olá, {userName}!
              </Text>
              <Text className="mb-[16px] text-[16px] leading-[24px] text-gray-700">
                Recebemos uma solicitação para redefinir a senha da sua conta
                associada ao e-mail <strong>{userEmail}</strong>.
              </Text>
              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-700">
                Clique no botão abaixo para criar uma nova senha. Este link
                expirará em 24 horas por motivos de segurança.
              </Text>
            </Section>

            {/* Reset Button */}
            <Section className="mb-[32px] text-center">
              <Button
                href={resetUrl}
                className="box-border inline-block rounded-[8px] bg-blue-600 px-[32px] py-[16px] text-[16px] font-semibold text-white no-underline"
              >
                Redefinir Senha
              </Button>
            </Section>

            {/* Security Notice */}
            <Section className="mb-[32px] rounded-[8px] bg-gray-50 p-[24px]">
              <Text className="mb-[12px] text-[14px] leading-[20px] font-semibold text-gray-600">
                🔒 Aviso de Segurança
              </Text>
              <Text className="mb-[8px] text-[14px] leading-[20px] text-gray-600">
                • Se você não solicitou esta redefinição de senha, ignore este
                e-mail
              </Text>
              <Text className="mb-[8px] text-[14px] leading-[20px] text-gray-600">
                • Este link expirará em 24 horas
              </Text>
              <Text className="m-0 text-[14px] leading-[20px] text-gray-600">
                • Por segurança, nunca compartilhe este link com ninguém
              </Text>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-[32px]">
              <Text className="mb-[8px] text-[14px] leading-[20px] text-gray-600">
                Se o botão não funcionar, copie e cole este link no seu
                navegador:
              </Text>
              <Text className="text-[14px] break-all text-blue-600">
                {resetUrl}
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px]">
              <Text className="mb-[8px] text-[12px] leading-[16px] text-gray-500">
                Este e-mail foi enviado por Caixa fechada.
              </Text>
              <Text className="m-0 mb-[8px] text-[12px] leading-[16px] text-gray-500">
                Rua dos Negócios, 123, Sala 100, Cidade, Estado, CEP 12345-678
              </Text>
              <Text className="m-0 text-[12px] leading-[16px] text-gray-500">
                © {new Date().getFullYear()} CaixaFechada. Todos os direitos
                reservados. |
                <span className="ml-[4px] text-blue-600 no-underline">
                  Cancelar inscrição
                </span>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};


export default TemplateForgotPasswordEmail;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().email("Email inválido").max(255, "Email muito longo");
const passwordSchema = z.string().min(6, "Senha deve ter no mínimo 6 caracteres").max(100, "Senha muito longa");

type AuthMode = "login" | "signup" | "forgot";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const validateInputs = () => {
    try {
      emailSchema.parse(email.trim());
      if (mode !== "forgot") {
        passwordSchema.parse(password);
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erro de validação",
          description: error.issues[0].message,
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) return;
    
    setLoading(true);

    try {
      let result;
      
      if (mode === "login") {
        result = await signIn(email.trim(), password);
      } else if (mode === "signup") {
        result = await signUp(email.trim(), password);
      } else {
        result = await resetPassword(email.trim());
        if (!result.error) {
          toast({
            title: "Email enviado",
            description: "Verifique sua caixa de entrada para redefinir sua senha.",
          });
          setMode("login");
        }
      }

      if (result?.error) {
        let errorMessage = "Ocorreu um erro. Tente novamente.";
        
        if (result.error.message?.includes("Invalid login credentials")) {
          errorMessage = "Email ou senha incorretos.";
        } else if (result.error.message?.includes("User already registered")) {
          errorMessage = "Este email já está cadastrado.";
        } else if (result.error.message?.includes("Email not confirmed")) {
          errorMessage = "Por favor, confirme seu email antes de fazer login.";
        }
        
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    login: "Bem-vindo de volta",
    signup: "Criar conta",
    forgot: "Recuperar senha",
  };

  const descriptions = {
    login: "Entre com suas credenciais",
    signup: "Crie sua conta para continuar",
    forgot: "Digite seu email para receber instruções",
  };

  const buttonTexts = {
    login: "Entrar",
    signup: "Criar conta",
    forgot: "Enviar instruções",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {mode !== "login" && (
          <Button
            variant="ghost"
            onClick={() => setMode("login")}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        )}

        <Card className="border-border/40 shadow-soft">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight" style={{ letterSpacing: '-0.06em' }}>
              {titles[mode]}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {descriptions[mode]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="transition-all"
                />
              </div>

              {mode !== "forgot" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="transition-all"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full gap-2 transition-all"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  buttonTexts[mode]
                )}
              </Button>

              <div className="space-y-2 pt-4">
                {mode === "login" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors w-full text-center"
                    >
                      Esqueceu sua senha?
                    </button>
                    <div className="text-sm text-center text-muted-foreground">
                      Não tem uma conta?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="text-primary hover:underline font-medium"
                      >
                        Criar conta
                      </button>
                    </div>
                  </>
                )}

                {mode === "signup" && (
                  <div className="text-sm text-center text-muted-foreground">
                    Já tem uma conta?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-primary hover:underline font-medium"
                    >
                      Fazer login
                    </button>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
        </p>
      </div>
    </div>
  );
}

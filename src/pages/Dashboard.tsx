import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, BarChart3, Sparkles, Upload as UploadIcon, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Criar Thumbnail",
      description: "Gere thumbnails com IA",
      icon: Sparkles,
      path: "/create",
      gradient: "from-primary to-creative",
    },
    {
      title: "Upload & Variações",
      description: "Envie e crie variações",
      icon: UploadIcon,
      path: "/upload",
      gradient: "from-accent to-accent-glow",
    },
    {
      title: "Analisar",
      description: "Análise inteligente",
      icon: BarChart3,
      path: "/analyze",
      gradient: "from-creative to-primary",
    },
    {
      title: "Meus Projetos",
      description: "Veja seus projetos",
      icon: Folder,
      path: "/projects",
      gradient: "from-primary to-accent",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header with Logout */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight" style={{ letterSpacing: '-0.06em' }}>
            Olá, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel de controle
          </p>
        </div>
        <Button
          variant="outline"
          onClick={signOut}
          className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>

      {/* Account Info Card */}
      <Card className="border-border/40 shadow-soft">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>Seus dados de usuário</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm p-3 bg-muted/50 rounded-lg">
            <span className="text-muted-foreground font-medium">Email:</span>
            <span className="font-medium text-foreground">{user?.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm p-3 bg-muted/50 rounded-lg">
            <span className="text-muted-foreground font-medium">ID:</span>
            <span className="font-mono text-xs text-foreground">{user?.id}</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Ações Rápidas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.path}
                className="border-border/40 shadow-soft cursor-pointer hover:shadow-medium transition-all hover:scale-105 group"
                onClick={() => navigate(action.path)}
              >
                <CardHeader className="space-y-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {action.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  Upload, 
  BarChart3, 
  TrendingUp,
  Zap,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Gerar com IA",
    description: "Crie thumbnails do zero usando inteligência artificial",
    href: "/create",
    gradient: "from-primary to-creative",
  },
  {
    icon: Upload,
    title: "Upload & Variações",
    description: "Envie uma thumbnail e crie múltiplas variações",
    href: "/upload",
    gradient: "from-accent to-accent-glow",
  },
  {
    icon: BarChart3,
    title: "Análise Inteligente",
    description: "Otimize suas thumbnails com análise avançada",
    href: "/analyze",
    gradient: "from-creative to-primary",
  },
];

const stats = [
  { label: "Thumbnails Criadas", value: "0", icon: Sparkles },
  { label: "Variações Geradas", value: "0", icon: Zap },
  { label: "Score Médio", value: "—", icon: TrendingUp },
];

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-creative to-accent bg-clip-text text-transparent">
          Crie Thumbnails Profissionais
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Ferramentas poderosas de IA para criar, otimizar e analisar suas thumbnails
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/40 shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-creative/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card 
            key={feature.title} 
            className="border-border/40 shadow-soft hover:shadow-medium transition-all group"
          >
            <CardHeader>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-soft`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={feature.href}>
                <Button 
                  className="w-full gap-2 group-hover:shadow-medium transition-all"
                  variant="outline"
                >
                  Começar
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Start */}
      <Card className="border-border/40 shadow-soft bg-gradient-to-br from-card to-secondary/30">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">
                Pronto para começar?
              </h3>
              <p className="text-muted-foreground">
                Crie sua primeira thumbnail profissional em minutos
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/create">
                <Button size="lg" className="gap-2 shadow-medium hover:shadow-strong transition-all">
                  <Sparkles className="w-5 h-5" />
                  Gerar com IA
                </Button>
              </Link>
              <Link to="/upload">
                <Button size="lg" variant="outline" className="gap-2">
                  <Upload className="w-5 h-5" />
                  Fazer Upload
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

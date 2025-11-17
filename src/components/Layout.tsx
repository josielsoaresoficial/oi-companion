import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Upload, 
  BarChart3, 
  FolderOpen,
  LayoutDashboard,
  Wand2
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Criar com IA", href: "/create", icon: Sparkles },
  { name: "Upload & Variações", href: "/upload", icon: Upload },
  { name: "Análise Inteligente", href: "/analyze", icon: BarChart3 },
  { name: "Meus Projetos", href: "/projects", icon: FolderOpen },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-creative flex items-center justify-center shadow-medium">
              <Wand2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="bg-gradient-to-r from-primary to-creative bg-clip-text text-transparent">
              ThumbAI
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "gap-2 transition-all",
                      isActive && "shadow-soft"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        {children}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="flex items-center justify-around px-2 py-2">
          {navigation.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "flex-col h-auto py-2 px-3 gap-1",
                    isActive && "shadow-soft"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs">{item.name.split(" ")[0]}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

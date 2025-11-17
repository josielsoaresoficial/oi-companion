import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, 
  Download, 
  Trash2, 
  MoreVertical,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockProjects = [
  {
    id: 1,
    name: "Tutorial React 2024",
    thumbnail: null,
    createdAt: "2024-01-15",
    variations: 5,
    type: "ai-generated",
  },
  {
    id: 2,
    name: "Vlog Viagem Tokyo",
    thumbnail: null,
    createdAt: "2024-01-14",
    variations: 8,
    type: "upload",
  },
  {
    id: 3,
    name: "Review iPhone 15",
    thumbnail: null,
    createdAt: "2024-01-13",
    variations: 3,
    type: "analyzed",
  },
];

export default function Projects() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Meus Projetos</h1>
          <p className="text-muted-foreground text-lg">
            Gerencie todos os seus projetos de thumbnails
          </p>
        </div>
        <Badge variant="outline" className="text-base px-4 py-2">
          {mockProjects.length} projetos
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <Card key={project.id} className="border-border/40 shadow-soft hover:shadow-medium transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3" />
                    {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Baixar todas
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-muted to-secondary rounded-lg flex items-center justify-center border border-border/40 mb-3">
                <FolderOpen className="w-12 h-12 text-muted-foreground/30" />
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">
                  {project.variations} variações
                </Badge>
                <Badge 
                  variant="outline" 
                  className={
                    project.type === 'ai-generated' 
                      ? 'border-primary/30 text-primary' 
                      : project.type === 'upload'
                      ? 'border-accent/30 text-accent'
                      : 'border-creative/30 text-creative'
                  }
                >
                  {project.type === 'ai-generated' && 'IA Gerado'}
                  {project.type === 'upload' && 'Upload'}
                  {project.type === 'analyzed' && 'Analisado'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockProjects.length === 0 && (
        <Card className="border-border/40 shadow-soft">
          <CardContent className="py-16 text-center">
            <FolderOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum projeto ainda</h3>
            <p className="text-muted-foreground mb-6">
              Crie seu primeiro thumbnail para começar
            </p>
            <Button>Criar Novo Projeto</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

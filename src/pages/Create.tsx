import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Create() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [creativity, setCreativity] = useState([50]);
  const [variations, setVariations] = useState("3");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [similarityLevel, setSimilarityLevel] = useState("medio");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("professional");
  const [colors, setColors] = useState("vibrant");
  const [includeText, setIncludeText] = useState(true);
  const [includeGraphics, setIncludeGraphics] = useState(true);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReferenceImage = () => {
    setReferenceImage(null);
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error("Por favor, preencha o título do conteúdo");
      return;
    }

    setIsGenerating(true);
    setGeneratedImages([]);

    try {
      // Construir o prompt baseado nas opções selecionadas
      let prompt = `Create a professional YouTube thumbnail for: "${title}".`;
      
      if (description) {
        prompt += ` Content description: ${description}.`;
      }
      
      prompt += ` Style: ${style}. Color palette: ${colors}.`;
      
      if (includeText) {
        prompt += ` Include the title text prominently in the thumbnail.`;
      }
      
      if (includeGraphics) {
        prompt += ` Include relevant graphics and visual elements.`;
      }
      
      prompt += ` Make it eye-catching and professional. Creativity level: ${creativity[0]}%.`;

      if (referenceImage) {
        const similarityDescriptions = {
          leve: "Use the reference image as loose inspiration for the overall mood and theme.",
          medio: "Match the style and composition of the reference image while keeping it unique.",
          intenso: "Create a very similar thumbnail to the reference image, maintaining its core visual style and layout."
        };
        prompt += ` ${similarityDescriptions[similarityLevel as keyof typeof similarityDescriptions]}`;
      }

      console.log("Generating thumbnails with prompt:", prompt);

      // Chamar a edge function
      const { data, error } = await supabase.functions.invoke("generate-thumbnail", {
        body: {
          prompt,
          referenceImage: referenceImage || undefined,
          count: parseInt(variations),
          creativity: creativity[0],
        },
      });

      if (error) {
        console.error("Error generating thumbnails:", error);
        toast.error("Erro ao gerar thumbnails. Tente novamente.");
        return;
      }

      if (data?.variations && data.variations.length > 0) {
        const images = data.variations.map((v: any) => v.image);
        setGeneratedImages(images);
        toast.success(`${images.length} thumbnail(s) gerada(s) com sucesso!`);
      } else {
        toast.error("Nenhuma thumbnail foi gerada. Tente novamente.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao gerar thumbnails. Verifique sua conexão.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-creative bg-clip-text text-transparent">
          Gerar Thumbnail com IA
        </h1>
        <p className="text-muted-foreground text-lg">
          Crie thumbnails profissionais usando inteligência artificial
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Configuração */}
        <Card className="border-border/40 shadow-soft">
          <CardHeader>
            <CardTitle>Configuração</CardTitle>
            <CardDescription>
              Descreva o que você precisa e personalize o resultado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Vídeo/Conteúdo *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Como criar thumbnails incríveis"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição/Conteúdo Principal</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva brevemente sobre o que é seu conteúdo..."
                className="bg-background min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Estilo Preferido</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger id="style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimalista</SelectItem>
                  <SelectItem value="bold">Chamativo</SelectItem>
                  <SelectItem value="professional">Profissional</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="modern">Moderno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="colors">Paleta de Cores</Label>
              <Select value={colors} onValueChange={setColors}>
                <SelectTrigger id="colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vibrant">Vibrante</SelectItem>
                  <SelectItem value="pastel">Pastel</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="neon">Neon</SelectItem>
                  <SelectItem value="natural">Natural</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Imagem de Referência (Opcional)</Label>
              {!referenceImage ? (
                <div className="border-2 border-dashed border-border/40 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="reference-image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="reference-image" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Clique para fazer upload de uma imagem de referência
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      A IA criará thumbnails semelhantes ao estilo desta imagem
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative border border-border/40 rounded-lg p-2">
                  <img
                    src={referenceImage}
                    alt="Referência"
                    className="w-full h-32 object-cover rounded"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-3 right-3"
                    onClick={removeReferenceImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {referenceImage && (
              <div className="space-y-2">
                <Label htmlFor="similarity">Nível de Semelhança</Label>
                <Select value={similarityLevel} onValueChange={setSimilarityLevel}>
                  <SelectTrigger id="similarity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leve">Leve - Apenas inspiração</SelectItem>
                    <SelectItem value="medio">Médio - Estilo equilibrado</SelectItem>
                    <SelectItem value="intenso">Intenso - Muito semelhante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-3">
              <Label>Criatividade da IA</Label>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">Conservador</span>
                <Slider
                  value={creativity}
                  onValueChange={setCreativity}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground">Criativo</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Nível atual: {creativity[0]}%
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="variations">Número de Variações</Label>
              <Select value={variations} onValueChange={setVariations}>
                <SelectTrigger id="variations">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 variações</SelectItem>
                  <SelectItem value="5">5 variações</SelectItem>
                  <SelectItem value="10">10 variações</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Opções Adicionais</Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="text" 
                  checked={includeText}
                  onCheckedChange={(checked) => setIncludeText(checked as boolean)}
                />
                <label
                  htmlFor="text"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Incluir texto automático
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="graphics" 
                  checked={includeGraphics}
                  onCheckedChange={(checked) => setIncludeGraphics(checked as boolean)}
                />
                <label
                  htmlFor="graphics"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Incluir elementos gráficos
                </label>
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full gap-2 shadow-medium hover:shadow-strong transition-all"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Thumbnails com IA
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Pré-visualização */}
        <Card className="border-border/40 shadow-soft">
          <CardHeader>
            <CardTitle>Pré-visualização</CardTitle>
            <CardDescription>
              Suas thumbnails aparecerão aqui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isGenerating ? (
                <div className="aspect-video bg-gradient-to-br from-muted to-secondary rounded-lg flex items-center justify-center border border-border/40">
                  <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Gerando suas thumbnails...</p>
                  </div>
                </div>
              ) : generatedImages.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {generatedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full rounded-lg border border-border/40 shadow-soft"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <Button size="sm" variant="secondary">
                          Download
                        </Button>
                        <Button size="sm" variant="secondary">
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-muted to-secondary rounded-lg flex items-center justify-center border border-border/40">
                  <div className="text-center space-y-2 p-8">
                    <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto" />
                    <p className="text-muted-foreground">
                      Configure as opções e clique em "Gerar" para criar suas thumbnails
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

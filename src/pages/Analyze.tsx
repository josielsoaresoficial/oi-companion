import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, MessageSquare, CheckCircle, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Analyze() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setIsAnalyzing(true);
        // Simular análise
        setTimeout(() => {
          setIsAnalyzing(false);
          setHasAnalysis(true);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAskQuestion = () => {
    if (!userQuestion.trim()) return;
    setIsProcessingQuestion(true);
    setTimeout(() => {
      setIsProcessingQuestion(false);
      setAiRecommendations([
        "Aumente o tamanho da fonte do texto principal em 25% para melhor visualização mobile",
        "Use cores mais contrastantes para o texto - considere usar amarelo ou branco puro",
        "Adicione uma borda ou sombra ao redor do texto para destacá-lo do fundo",
        "Posicione o elemento principal mais à esquerda para seguir o padrão F de leitura",
        "Reduza a quantidade de texto para manter o foco no elemento visual principal"
      ]);
      toast({
        title: "Análise concluída",
        description: "A IA analisou sua pergunta e gerou recomendações.",
      });
    }, 2000);
  };

  const quickQuestions = [
    "Como posso tornar mais atraente para meu público?",
    "Quero melhorar a legibilidade do texto",
    "Sugestões para aumentar o CTR?",
    "Como deixar mais profissional?",
    "Análise de pontos focais e atenção",
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-creative to-primary bg-clip-text text-transparent">
          Análise Inteligente
        </h1>
        <p className="text-muted-foreground text-lg">
          Otimize suas thumbnails com análise avançada por IA
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload & Analysis */}
        <div className="space-y-6">
          <Card className="border-border/40 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  1
                </span>
                Upload da Thumbnail
              </CardTitle>
              <CardDescription>
                Envie sua thumbnail para análise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-creative/50 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="analyze-upload"
                />
                <label htmlFor="analyze-upload" className="cursor-pointer">
                  {uploadedImage ? (
                    <img
                      src={uploadedImage}
                      alt="Uploaded for analysis"
                      className="max-w-full max-h-48 mx-auto rounded-lg shadow-medium"
                    />
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-10 h-10 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-foreground font-medium">
                          Clique para fazer upload
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ou arraste sua thumbnail aqui
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </CardContent>
          </Card>

          {uploadedImage && (
            <Card className="border-border/40 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    2
                  </span>
                  Análise Automática
                </CardTitle>
                <CardDescription>
                  Diagnóstico inteligente da sua thumbnail
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAnalyzing ? (
                  <div className="text-center py-8 space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-creative mx-auto" />
                    <p className="text-muted-foreground">Analisando thumbnail...</p>
                  </div>
                ) : hasAnalysis ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                      <span className="text-sm font-medium">Score de Otimização</span>
                      <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                        78/100
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Contraste excelente</p>
                          <p className="text-xs text-muted-foreground">
                            Boa legibilidade em diferentes tamanhos
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Composição balanceada</p>
                          <p className="text-xs text-muted-foreground">
                            Elementos bem distribuídos
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Texto poderia ser maior</p>
                          <p className="text-xs text-muted-foreground">
                            Aumente o tamanho para melhor visualização mobile
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>

        {/* AI Assistant */}
        <Card className="border-border/40 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                3
              </span>
              Consulta à IA
            </CardTitle>
            <CardDescription>
              Faça perguntas específicas sobre sua thumbnail
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="Descreva quais alterações você gostaria que eu fizesse na sua thumbnail..."
                className="min-h-32 bg-background"
                disabled={!hasAnalysis}
              />
              <Button
                onClick={handleAskQuestion}
                disabled={!hasAnalysis || !userQuestion.trim() || isProcessingQuestion}
                className="w-full gap-2 shadow-medium hover:shadow-strong transition-all"
              >
                {isProcessingQuestion ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    Enviar Pergunta
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Perguntas sugeridas:
              </p>
              <div className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-4"
                    onClick={() => setUserQuestion(question)}
                    disabled={!hasAnalysis}
                  >
                    <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{question}</span>
                  </Button>
                ))}
              </div>
            </div>

            {!hasAnalysis && (
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Faça upload de uma thumbnail para começar a análise
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {aiRecommendations.length > 0 && (
          <Card className="border-border/40 shadow-soft mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-success" />
                Análise concluída
              </CardTitle>
              <CardDescription>
                A IA analisou sua pergunta e gerou recomendações.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiRecommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20"
                  >
                    <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

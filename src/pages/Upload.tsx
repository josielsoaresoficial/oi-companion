import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload as UploadIcon, Image, Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TextPreview } from "@/components/TextPreview";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Upload() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [intensity, setIntensity] = useState([3]);
  const [generatedVariations, setGeneratedVariations] = useState<Array<{ id: number; image: string }>>([]);
  const [variationsCount, setVariationsCount] = useState("5");
  const [customText, setCustomText] = useState("");
  const [textStyle, setTextStyle] = useState({
    fontSize: "medium",
    color: "#FFFFFF",
    position: "center",
    font: "Arial"
  });
  const [variationType, setVariationType] = useState<'light' | 'creative'>('light');
  const [lightOptions, setLightOptions] = useState({
    colors: true,
    brightness: false,
    text: false,
    background: false,
    implementText: false,
    addVisuals: false,
  });
  const [creativeOptions, setCreativeOptions] = useState({
    redesign: true,
    composition: false,
    style: false,
    platforms: false,
  });
  const [imageStyle, setImageStyle] = useState<string>("none");
  const [styleIntensity, setStyleIntensity] = useState<string>("moderado");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 10MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReferenceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 10MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setReferenceImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!uploadedImage) {
      toast({
        title: "Erro",
        description: "Por favor, faça upload de uma imagem primeiro.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    setGeneratedVariations([]);

    try {
      const count = parseInt(variationsCount);
      const options = variationType === 'light' ? lightOptions : creativeOptions;

      console.log('Calling edge function with:', { variationType, count, options });

      const { data, error } = await supabase.functions.invoke('generate-variations', {
        body: {
          image: uploadedImage,
          referenceImage,
          variationType,
          options,
          count,
          imageStyle,
          styleIntensity,
          customText: lightOptions.implementText ? customText : undefined,
          textStyle: lightOptions.implementText ? textStyle : undefined
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      console.log('Edge function response:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.variations && data.variations.length > 0) {
        setGeneratedVariations(data.variations);
        toast({
          title: "Variações criadas!",
          description: `${data.variations.length} variações foram geradas com sucesso.`,
        });
      } else {
        throw new Error('Nenhuma variação foi gerada');
      }

    } catch (error) {
      console.error('Error generating variations:', error);
      toast({
        title: "Erro ao gerar variações",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `thumbnail-variation-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download iniciado",
      description: `Baixando variação #${index + 1}`,
    });
  };

  const downloadAll = () => {
    generatedVariations.forEach((variation, index) => {
      setTimeout(() => {
        downloadImage(variation.image, index);
      }, index * 500);
    });
    
    toast({
      title: "Download iniciado",
      description: "Baixando todas as variações...",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent">
          Upload & Variações
        </h1>
        <p className="text-muted-foreground text-lg">
          Envie uma thumbnail existente e crie variações automáticas
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Area */}
        <Card className="border-border/40 shadow-soft">
          <CardHeader>
            <CardTitle>Upload de Thumbnail</CardTitle>
            <CardDescription>
              PNG, JPG ou WebP até 10MB
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img
                      src={uploadedImage}
                      alt="Uploaded thumbnail"
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-medium"
                    />
                    <p className="text-sm text-muted-foreground">
                      Clique para alterar a imagem
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-foreground font-medium">
                        Clique para fazer upload
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ou arraste e solte aqui
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* Reference Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Imagem de Referência (Opcional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleReferenceUpload}
                  className="hidden"
                  id="reference-upload"
                />
                <label htmlFor="reference-upload" className="cursor-pointer">
                  {referenceImage ? (
                    <div className="space-y-2">
                      <img
                        src={referenceImage}
                        alt="Reference thumbnail"
                        className="max-w-full max-h-32 mx-auto rounded-lg shadow-medium"
                      />
                      <p className="text-xs text-muted-foreground">
                        Clique para alterar a referência
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Image className="w-8 h-8 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-sm text-foreground font-medium">
                          Adicionar referência
                        </p>
                        <p className="text-xs text-muted-foreground">
                          As variações usarão esta imagem como inspiração
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Image Style Selector */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Estilo de Imagem</Label>
              <select
                value={imageStyle}
                onChange={(e) => setImageStyle(e.target.value)}
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="none">Nenhum estilo específico</option>
                <option value="cartoon">Cartoon / Estilo Desenho</option>
                <option value="3d-realistic">3D Realista (Render)</option>
                <option value="pixel-art">Pixel Art</option>
                <option value="watercolor">Aquarela (Watercolor)</option>
                <option value="flat-design">Flat Design</option>
                <option value="cyberpunk">Cyberpunk / Neon</option>
                <option value="low-poly">Low Poly</option>
                <option value="anime">Anime / Mangá</option>
                <option value="sketch">Sketch / Rascunho Lápis</option>
                <option value="oil-painting">Pintura a Óleo (Oil Painting)</option>
              </select>
            </div>

            {/* Style Intensity Selector */}
            {imageStyle !== "none" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Intensidade do Estilo</Label>
                <select
                  value={styleIntensity}
                  onChange={(e) => setStyleIntensity(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="sutil">Sutil - Toque discreto do estilo</option>
                  <option value="moderado">Moderado - Estilo equilibrado</option>
                  <option value="forte">Forte - Estilo marcante</option>
                </select>
              </div>
            )}

            {uploadedImage && (
              <Tabs 
                defaultValue="light" 
                className="w-full"
                onValueChange={(value) => setVariationType(value as 'light' | 'creative')}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="light">Variações Leves</TabsTrigger>
                  <TabsTrigger value="creative">Variações Criativas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="light" className="space-y-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Pequenas alterações mantendo o estilo original
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="colors" 
                        checked={lightOptions.colors}
                        onCheckedChange={(checked) => 
                          setLightOptions(prev => ({ ...prev, colors: checked as boolean }))
                        }
                      />
                      <label htmlFor="colors" className="text-sm">
                        Alterar apenas cores
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="brightness"
                        checked={lightOptions.brightness}
                        onCheckedChange={(checked) => 
                          setLightOptions(prev => ({ ...prev, brightness: checked as boolean }))
                        }
                      />
                      <label htmlFor="brightness" className="text-sm">
                        Ajustar brilho/contraste
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="text"
                        checked={lightOptions.text}
                        onCheckedChange={(checked) => 
                          setLightOptions(prev => ({ ...prev, text: checked as boolean }))
                        }
                      />
                      <label htmlFor="text" className="text-sm">
                        Modificar texto (mantendo estilo)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="background"
                        checked={lightOptions.background}
                        onCheckedChange={(checked) => 
                          setLightOptions(prev => ({ ...prev, background: checked as boolean }))
                        }
                      />
                      <label htmlFor="background" className="text-sm">
                        Alterar fundo sutilmente
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="implementText"
                        checked={lightOptions.implementText}
                        onCheckedChange={(checked) => 
                          setLightOptions(prev => ({ ...prev, implementText: checked as boolean }))
                        }
                      />
                      <label htmlFor="implementText" className="text-sm">
                        Implementar texto
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="addVisuals"
                        checked={lightOptions.addVisuals}
                        onCheckedChange={(checked) => 
                          setLightOptions(prev => ({ ...prev, addVisuals: checked as boolean }))
                        }
                      />
                      <label htmlFor="addVisuals" className="text-sm">
                        Adicionar fundo e ícones referentes ao texto
                      </label>
                    </div>
                  </div>

                  {lightOptions.implementText && (
                    <div className="space-y-4 mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                      <div className="space-y-2">
                        <Label htmlFor="customText">Texto para implementar</Label>
                        <textarea
                          id="customText"
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value)}
                          placeholder="Digite o texto que deseja adicionar nas variações..."
                          className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                          maxLength={200}
                        />
                        <p className="text-xs text-muted-foreground">
                          {customText.length}/200 caracteres
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fontSize">Tamanho</Label>
                          <select
                            id="fontSize"
                            value={textStyle.fontSize}
                            onChange={(e) => setTextStyle(prev => ({ ...prev, fontSize: e.target.value }))}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="small">Pequeno</option>
                            <option value="medium">Médio</option>
                            <option value="large">Grande</option>
                            <option value="xlarge">Extra Grande</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="textColor">Cor</Label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              id="textColor"
                              value={textStyle.color}
                              onChange={(e) => setTextStyle(prev => ({ ...prev, color: e.target.value }))}
                              className="w-12 h-10 rounded border border-input cursor-pointer"
                            />
                            <input
                              type="text"
                              value={textStyle.color}
                              onChange={(e) => setTextStyle(prev => ({ ...prev, color: e.target.value }))}
                              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                              placeholder="#FFFFFF"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="textFont">Fonte</Label>
                          <select
                            id="textFont"
                            value={textStyle.font}
                            onChange={(e) => setTextStyle(prev => ({ ...prev, font: e.target.value }))}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="Arial">Arial</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Verdana">Verdana</option>
                            <option value="Impact">Impact</option>
                            <option value="Comic Sans MS">Comic Sans MS</option>
                            <option value="Courier New">Courier New</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="textPosition">Posição</Label>
                          <select
                            id="textPosition"
                            value={textStyle.position}
                            onChange={(e) => setTextStyle(prev => ({ ...prev, position: e.target.value }))}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="top">Topo</option>
                            <option value="center">Centro</option>
                            <option value="bottom">Rodapé</option>
                            <option value="top-left">Canto Superior Esquerdo</option>
                            <option value="top-right">Canto Superior Direito</option>
                            <option value="bottom-left">Canto Inferior Esquerdo</option>
                            <option value="bottom-right">Canto Inferior Direito</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {lightOptions.implementText && customText && (
                    <div className="space-y-2 mt-6">
                      <Label className="text-base font-semibold">Preview do Texto</Label>
                      <p className="text-xs text-muted-foreground mb-3">
                        Visualização em tempo real de como o texto ficará
                      </p>
                      <TextPreview 
                        imageUrl={uploadedImage}
                        text={customText}
                        textStyle={textStyle}
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label>Intensidade das Alterações</Label>
                    <Slider
                      value={intensity}
                      onValueChange={setIntensity}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Nível: {intensity[0]}/5
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="var-count">Número de Variações</Label>
                    <select
                      id="var-count"
                      value={variationsCount}
                      onChange={(e) => setVariationsCount(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="3">3 variações</option>
                      <option value="5">5 variações</option>
                      <option value="8">8 variações</option>
                      <option value="12">12 variações</option>
                    </select>
                  </div>
                </TabsContent>

                <TabsContent value="creative" className="space-y-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Mudanças significativas mantendo o conceito
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="redesign"
                        checked={creativeOptions.redesign}
                        onCheckedChange={(checked) => 
                          setCreativeOptions(prev => ({ ...prev, redesign: checked as boolean }))
                        }
                      />
                      <label htmlFor="redesign" className="text-sm">
                        Redesenhar mantendo conceito
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="composition"
                        checked={creativeOptions.composition}
                        onCheckedChange={(checked) => 
                          setCreativeOptions(prev => ({ ...prev, composition: checked as boolean }))
                        }
                      />
                      <label htmlFor="composition" className="text-sm">
                        Alterar composição
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="style"
                        checked={creativeOptions.style}
                        onCheckedChange={(checked) => 
                          setCreativeOptions(prev => ({ ...prev, style: checked as boolean }))
                        }
                      />
                      <label htmlFor="style" className="text-sm">
                        Mudar estilo artístico
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="platforms"
                        checked={creativeOptions.platforms}
                        onCheckedChange={(checked) => 
                          setCreativeOptions(prev => ({ ...prev, platforms: checked as boolean }))
                        }
                      />
                      <label htmlFor="platforms" className="text-sm">
                        Versões para diferentes plataformas
                      </label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {uploadedImage && (
              <Button
                onClick={handleGenerate}
                disabled={isProcessing}
                className="w-full gap-2 shadow-medium hover:shadow-strong transition-all"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Criando Variações...
                  </>
                ) : (
                  <>
                    <Image className="w-5 h-5" />
                    Criar Variações
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Results Preview */}
        <Card className="border-border/40 shadow-soft">
          <CardHeader>
            <CardTitle>Variações Geradas</CardTitle>
            <CardDescription>
              {generatedVariations.length > 0 
                ? `${generatedVariations.length} variações criadas`
                : "Suas variações aparecerão aqui"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isProcessing ? (
              <div className="aspect-video bg-gradient-to-br from-muted to-secondary rounded-lg flex items-center justify-center border border-border/40">
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto" />
                  <p className="text-muted-foreground">Criando variações...</p>
                </div>
              </div>
            ) : generatedVariations.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
                  {generatedVariations.map((variation, index) => (
                    <div 
                      key={variation.id}
                      className="group relative aspect-video rounded-lg overflow-hidden border border-border/40 hover:border-accent/50 transition-all shadow-soft hover:shadow-medium"
                    >
                      <img
                        src={variation.image}
                        alt={`Variação ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <div className="flex gap-2 w-full">
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="flex-1 gap-1"
                            onClick={() => setPreviewImage(variation.image)}
                          >
                            <Image className="w-3 h-3" />
                            Ver
                          </Button>
                  <Button 
                            size="sm"
                            className="flex-1 gap-1"
                            onClick={() => downloadImage(variation.image, index)}
                          >
                            <Download className="w-3 h-3" />
                            Baixar
                          </Button>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={downloadAll}
                >
                  <Download className="w-4 h-4" />
                  Baixar Todas as Variações
                </Button>
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-muted to-secondary rounded-lg flex items-center justify-center border border-border/40">
                <div className="text-center space-y-2 p-8">
                  <Image className="w-12 h-12 text-muted-foreground/50 mx-auto" />
                  <p className="text-muted-foreground">
                    {uploadedImage
                      ? "Configure as opções e clique em 'Criar Variações'"
                      : "Faça upload de uma thumbnail para começar"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-5xl p-2">
          {previewImage && (
            <img 
              src={previewImage} 
              alt="Preview expandido" 
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

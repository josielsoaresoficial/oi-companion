import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, FabricImage, FabricText } from "fabric";

interface TextPreviewProps {
  imageUrl: string | null;
  text: string;
  textStyle: {
    fontSize: string;
    color: string;
    position: string;
    font: string;
  };
}

const fontSizeMap: { [key: string]: number } = {
  'small': 24,
  'medium': 40,
  'large': 58,
  'xlarge': 80
};

const positionMap: { [key: string]: { originX: string; originY: string; top: number; left: number } } = {
  'top': { originX: 'center', originY: 'top', top: 40, left: 0.5 },
  'center': { originX: 'center', originY: 'center', top: 0.5, left: 0.5 },
  'bottom': { originX: 'center', originY: 'bottom', top: 1, left: 0.5 },
  'top-left': { originX: 'left', originY: 'top', top: 40, left: 40 },
  'top-right': { originX: 'right', originY: 'top', top: 40, left: 1 },
  'bottom-left': { originX: 'left', originY: 'bottom', top: 1, left: 40 },
  'bottom-right': { originX: 'right', originY: 'bottom', top: 1, left: 1 }
};

export const TextPreview = ({ imageUrl, text, textStyle }: TextPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: "#1a1a1a",
      selection: false,
    });

    fabricCanvasRef.current = canvas;

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.clear();
    canvas.backgroundColor = "#1a1a1a";

    if (!imageUrl) {
      canvas.renderAll();
      return;
    }

    FabricImage.fromURL(imageUrl, {
      crossOrigin: 'anonymous',
    }).then((img) => {
      if (!canvas) return;

      const canvasWidth = canvas.width || 600;
      const canvasHeight = canvas.height || 400;

      const scale = Math.min(
        canvasWidth / (img.width || 1),
        canvasHeight / (img.height || 1)
      );

      img.scale(scale);
      img.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        selectable: false,
      });

      canvas.add(img);

      if (text.trim()) {
        const fontSize = fontSizeMap[textStyle.fontSize] || 40;
        const position = positionMap[textStyle.position] || positionMap['center'];

        const fabricText = new FabricText(text, {
          fontSize: fontSize,
          fill: textStyle.color,
          fontFamily: textStyle.font,
          originX: position.originX as any,
          originY: position.originY as any,
          left: typeof position.left === 'number' && position.left <= 1 
            ? canvasWidth * position.left 
            : position.left,
          top: typeof position.top === 'number' && position.top <= 1 
            ? canvasHeight * position.top 
            : position.top,
          shadow: {
            color: 'rgba(0,0,0,0.7)',
            blur: 10,
            offsetX: 2,
            offsetY: 2,
          } as any,
          stroke: textStyle.color === '#FFFFFF' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
          strokeWidth: 1,
          selectable: false,
        });

        canvas.add(fabricText);
      }

      canvas.renderAll();
    });
  }, [imageUrl, text, textStyle]);

  return (
    <div className="w-full flex justify-center">
      <div className="border-2 border-border rounded-lg overflow-hidden shadow-lg bg-muted">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

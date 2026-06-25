import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Check } from 'lucide-react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  savedSignature?: string;
  placeholder?: string;
  lang?: 'vi' | 'en';
}

export default function SignaturePad({ onSave, savedSignature, placeholder, lang = 'vi' }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(!!savedSignature);

  const defaultPlaceholder = lang === 'vi' ? "Vui lòng ký tên vào đây" : "Please sign here";
  const activePlaceholder = placeholder || defaultPlaceholder;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high DPI screens
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e293b'; // Slate 800
    ctx.lineWidth = 2.5;

    // If there is an existing signature, draw it (optional, usually base64 is shown as img, but nice fallback)
    if (savedSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = savedSignature;
    }
  }, [savedSignature]);

  // Adjust canvas size on resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(2, 2);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.5;
        ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width / 2, tempCanvas.height / 2, 0, 0, rect.width, rect.height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    
    // Check if touch event
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    // Auto-save on drawing stroke completion
    const canvas = canvasRef.current;
    if (canvas) {
      // Create a temporary canvas to check if it's blank
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    onSave('');
  };

  return (
    <div className="w-full">
      <div className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-white hover:border-blue-400 transition-colors">
        {!hasDrawn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none select-none p-4">
            <PenTool className="w-8 h-8 mb-2 animate-pulse text-gray-300" />
            <p className="text-sm font-medium">{activePlaceholder}</p>
            <p className="text-xs text-gray-400 mt-1">
              {lang === 'vi' ? 'Dùng ngón tay hoặc bút cảm ứng để ký' : 'Use finger or stylus to sign'}
            </p>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-44 cursor-crosshair block"
        />

        {hasDrawn && (
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={clearCanvas}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-all hover:scale-105 shadow-sm flex items-center justify-center"
              title={lang === 'vi' ? 'Xóa chữ ký' : 'Clear signature'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="p-1.5 bg-green-500 text-white rounded-full shadow-sm flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
      
      {hasDrawn && (
        <div className="flex justify-between items-center mt-1 px-1">
          <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-ping"></span>
            {lang === 'vi' ? 'Đã ghi nhận chữ ký' : 'Signature recorded'}
          </p>
          <button
            type="button"
            onClick={clearCanvas}
            className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline flex items-center gap-0.5"
          >
            {lang === 'vi' ? 'Ký lại' : 'Sign again'}
          </button>
        </div>
      )}
    </div>
  );
}

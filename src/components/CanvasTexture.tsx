
import React from 'react';
import { DeceasedInfo } from '@/types/deceased';
import * as THREE from 'three';

interface CanvasTextureProps {
  deceasedInfo: DeceasedInfo;
  onTextureReady: (texture: THREE.CanvasTexture) => void;
}

export const CanvasTexture: React.FC<CanvasTextureProps> = ({ deceasedInfo, onTextureReady }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    console.log("CanvasTexture: useEffect ejecutado con deceasedInfo:", deceasedInfo.name);
    
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("CanvasTexture: Canvas ref no disponible");
      return;
    }

    // Force canvas to be visible temporarily for proper rendering
    canvas.style.visibility = 'visible';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log("CanvasTexture: No se pudo obtener el contexto 2D");
      return;
    }

    console.log("CanvasTexture: Iniciando generación de canvas");

    // Set canvas size with device pixel ratio for better quality
    const dpr = window.devicePixelRatio || 1;
    const width = 1280;
    const height = 720;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    // Background gradient matching PreviewDisplay design
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Company logo (top right)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '20px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('FUNERARIA SAN JOSÉ', width - 40, 50);

    // Main content area
    const leftWidth = width / 2;
    const rightStartX = leftWidth + 40;

    // Photo placeholder (left side)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(40, 100, leftWidth - 80, 500);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 100, leftWidth - 80, 500);

    // Photo icon
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '60px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📷', leftWidth / 2, 380);

    // Right side content
    
    // Name
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(deceasedInfo.name || "Nombre del fallecido", rightStartX, 180);

    // Date and time
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '28px system-ui, -apple-system, sans-serif';
    
    // Format date
    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return date.toLocaleDateString('es-ES', options);
    };

    const dateText = formatDate(deceasedInfo.date);
    const timeText = deceasedInfo.time || "";
    
    ctx.fillText(`📅 ${dateText}`, rightStartX, 240);
    if (timeText) {
      ctx.fillText(`⏰ ${timeText}`, rightStartX, 280);
    }

    // Room
    ctx.fillText(`📍 Sala: ${deceasedInfo.room || "Por asignar"}`, rightStartX, 320);

    // Separator line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rightStartX, 360);
    ctx.lineTo(rightStartX + 500, 360);
    ctx.stroke();

    // Message
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'italic 24px system-ui, -apple-system, sans-serif';
    const message = deceasedInfo.message || "Mensaje de condolencias";
    
    // Word wrap for message
    const maxWidth = 500;
    const words = message.split(' ');
    let line = '';
    let y = 400;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, rightStartX, y);
        line = words[n] + ' ';
        y += 35;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, rightStartX, y);

    console.log("CanvasTexture: Canvas dibujado, creando textura THREE.js");

    // Wait for canvas to be fully rendered
    requestAnimationFrame(() => {
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      texture.flipY = true; // Correct orientation for 3D screens
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      console.log("CanvasTexture: Textura creada con dimensiones:", canvas.width, 'x', canvas.height);
      console.log("CanvasTextura: Canvas tiene contenido:", ctx.getImageData(0, 0, 1, 1).data[3] > 0);
      
      // Hide canvas after texture creation
      canvas.style.visibility = 'hidden';
      canvas.style.position = 'absolute';
      canvas.style.left = '-9999px';
      canvas.style.top = '-9999px';
      
      onTextureReady(texture);
      console.log("CanvasTexture: onTextureReady ejecutado");
    });

  }, [deceasedInfo, onTextureReady]);

  return (
    <canvas 
      ref={canvasRef}
      style={{ 
        position: 'absolute', 
        left: '-9999px', 
        top: '-9999px', 
        visibility: 'hidden',
        pointerEvents: 'none'
      }} 
    />
  );
};

// Separate component for the hidden canvas that renders outside R3F context
export const HiddenCanvas: React.FC<{ deceasedInfo: DeceasedInfo; onTextureReady: (texture: THREE.CanvasTexture) => void }> = ({ deceasedInfo, onTextureReady }) => {
  console.log("HiddenCanvas: Renderizando con deceasedInfo:", deceasedInfo?.name);
  
  return (
    <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', visibility: 'hidden', pointerEvents: 'none' }}>
      <CanvasTexture deceasedInfo={deceasedInfo} onTextureReady={onTextureReady} />
    </div>
  );
};

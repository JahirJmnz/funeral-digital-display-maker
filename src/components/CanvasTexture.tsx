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

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log("CanvasTexture: No se pudo obtener el contexto 2D");
      return;
    }

    const renderCanvas = (photoImage?: HTMLImageElement) => {
      console.log("CanvasTexture: Iniciando generación de canvas con imagen:", !!photoImage);

      // Force canvas to be visible temporarily for proper rendering
      canvas.style.visibility = 'visible';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.zIndex = '-1';

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

      // Photo area (left side)
      const photoX = 40;
      const photoY = 100;
      const photoWidth = leftWidth - 80;
      const photoHeight = 500;

      if (photoImage) {
        // Draw the actual photo - stretch to fill entire space completely
        ctx.save();
        
        // Create rounded corners effect and clip to photo area
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoWidth, photoHeight, 8);
        ctx.clip();
        
        // Draw image stretched to fill entire clipped area (ignoring aspect ratio to avoid white bars)
        ctx.drawImage(photoImage, photoX, photoY, photoWidth, photoHeight);
        ctx.restore();
        
        // Add a subtle border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoWidth, photoHeight, 8);
        ctx.stroke();
      } else {
        // Photo placeholder
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(photoX, photoY, photoWidth, photoHeight);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.strokeRect(photoX, photoY, photoWidth, photoHeight);

        // Photo icon
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '60px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('📷', leftWidth / 2, 380);
      }

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
        
        // Hide canvas after texture creation
        canvas.style.visibility = 'hidden';
        canvas.style.position = 'absolute';
        canvas.style.left = '-9999px';
        canvas.style.top = '-9999px';
        
        onTextureReady(texture);
        console.log("CanvasTexture: onTextureReady ejecutado");
      });
    };

    // Check if there's a photo to load
    if (deceasedInfo.photoUrl) {
      console.log("CanvasTexture: Cargando imagen desde URL:", deceasedInfo.photoUrl.substring(0, 50));
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Handle CORS if needed
      img.onload = () => {
        console.log("CanvasTexture: Imagen cargada correctamente:", img.width, 'x', img.height);
        renderCanvas(img);
      };
      img.onerror = (error) => {
        console.log("CanvasTexture: Error cargando imagen, usando placeholder", error);
        renderCanvas(); // Render without image
      };
      img.src = deceasedInfo.photoUrl;
    } else {
      console.log("CanvasTexture: No hay foto, renderizando placeholder");
      renderCanvas(); // Render without image
    }

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

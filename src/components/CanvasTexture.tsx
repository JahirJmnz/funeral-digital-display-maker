
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1280;
    canvas.height = 720;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 720);
    gradient.addColorStop(0, '#2D1B69');
    gradient.addColorStop(1, '#1A0F3A');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1280, 720);

    // Company logo
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '24px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('FUNERARIA SAN JOSÉ', 1200, 60);

    // Main content area
    const leftWidth = 640;
    const rightWidth = 640;

    // Photo placeholder (left side)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(80, 120, leftWidth - 160, 480);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 120, leftWidth - 160, 480);

    // Photo icon
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📷', leftWidth / 2, 380);

    // Right side content
    const rightStartX = leftWidth + 80;
    
    // Name
    ctx.fillStyle = 'white';
    ctx.font = 'bold 64px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(deceasedInfo.name || "Nombre del fallecido", rightStartX, 220);

    // Date and time
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '36px Arial';
    
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
    ctx.fillText(`📅 ${dateText}`, rightStartX, 300);
    if (timeText) {
      ctx.fillText(`⏰ ${timeText}`, rightStartX, 350);
    }

    // Room
    ctx.fillText(`📍 Sala: ${deceasedInfo.room || "Por asignar"}`, rightStartX, 420);

    // Message
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'italic 28px Arial';
    const message = deceasedInfo.message || "Mensaje de condolencias";
    
    // Word wrap for message
    const maxWidth = 500;
    const words = message.split(' ');
    let line = '';
    let y = 520;
    
    // Separator line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rightStartX, 480);
    ctx.lineTo(rightStartX + 500, 480);
    ctx.stroke();

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, rightStartX, y);
        line = words[n] + ' ';
        y += 40;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, rightStartX, y);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.flipY = false;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    console.log("CanvasTexture: Textura generada directamente en canvas");
    onTextureReady(texture);

  }, [deceasedInfo, onTextureReady]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'none' }}
      width={1280}
      height={720}
    />
  );
};

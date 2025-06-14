
import React, { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RoomPreview3D from './RoomPreview3D';
import html2canvas from 'html2canvas';
import PreviewDisplay from './PreviewDisplay';
import { DeceasedInfo } from '@/types/deceased';

interface Preview3DDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deceasedInfo: DeceasedInfo;
}

const Preview3DDialog: React.FC<Preview3DDialogProps> = ({ 
  open, 
  onOpenChange,
  deceasedInfo 
}) => {
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [isCapturing, setIsCapturing] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const previewRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Reset state when dialog is closed to ensure fresh capture next time
    if (!open) {
      setPreviewImage(null);
      setImageLoaded(false);
      setIsCapturing(false);
    }
  }, [open]);

  React.useEffect(() => {
    if (open && imageLoaded && !isCapturing) {
      setIsCapturing(true);
      console.log("=== Imagen cargada, comenzando captura desde el DOM oculto... ===");
      
      const previewElement = previewRef.current?.querySelector('.memorial-display') as HTMLElement;
      if (previewElement) {
        html2canvas(previewElement, {
          backgroundColor: '#2D1B69',
          logging: true,
          scale: 2,
          useCORS: true,
          allowTaint: true,
          width: previewElement.offsetWidth,
          height: previewElement.offsetHeight,
        }).then(canvas => {
          const imageData = canvas.toDataURL('image/png');
          console.log("Imagen capturada exitosamente. DataURL length:", imageData.length);
          setPreviewImage(imageData);
          setIsCapturing(false);
        }).catch(error => {
          console.error("Error capturando la vista previa:", error);
          setIsCapturing(false);
        });
      } else {
        console.error("No se encontró el elemento .memorial-display en el ref oculto.");
        setIsCapturing(false);
      }
    }
  }, [open, imageLoaded, isCapturing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">Vista previa en 3D</DialogTitle>
          <DialogDescription>
            Así se verá la señalización digital en la pantalla de la funeraria.
            {isCapturing && " Capturando imagen del diseño actual..."}
            {previewImage && " Imagen capturada y lista para mostrar."}
            {!isCapturing && !previewImage && " Esperando a que el contenido esté listo..."}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          {/* Renderizar PreviewDisplay de forma oculta para que html2canvas pueda accederlo */}
          <div 
            ref={previewRef} 
            style={{ 
              position: 'absolute', 
              left: '-9999px', 
              top: '-9999px',
              width: '1280px', 
              height: '720px' 
            }}
          >
            <PreviewDisplay 
              deceasedInfo={deceasedInfo} 
              onImageLoad={() => setImageLoaded(true)} 
            />
          </div>
          <RoomPreview3D previewImage={previewImage} />
          <div className="flex justify-end mt-4">
            <Button onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Preview3DDialog;

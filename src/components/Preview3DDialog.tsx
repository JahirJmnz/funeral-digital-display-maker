import React from 'react';
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
import { useWebGLSupport } from '@/hooks/useWebGLSupport';

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
  const webGLSupported = useWebGLSupport();

  React.useEffect(() => {
    // Reset state when dialog is closed to ensure fresh capture next time
    if (!open) {
      setPreviewImage(null);
      setImageLoaded(false);
      setIsCapturing(false);
    }
  }, [open]);

  React.useEffect(() => {
    if (open && imageLoaded && !isCapturing && !previewImage) {
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
  }, [open, imageLoaded, isCapturing, previewImage]);
  
  const hiddenPreviewForCapture = (
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
  );

  if (!webGLSupported) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] p-0">
          {hiddenPreviewForCapture}
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl">Vista previa</DialogTitle>
            <DialogDescription>
              La vista 3D no está disponible en este navegador (WebGL no soportado). Mostrando una vista previa en 2D.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            {previewImage ? (
              <img src={previewImage} alt="Vista previa del diseño" className="w-full h-auto max-h-[60vh] object-contain bg-gray-900 rounded" />
            ) : (
              <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center rounded">
                <p className="text-muted-foreground">Generando vista previa...</p>
              </div>
            )}
            <div className="flex justify-end mt-4">
              <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
          {hiddenPreviewForCapture}
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

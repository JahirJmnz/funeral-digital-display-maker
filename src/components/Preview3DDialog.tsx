
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

interface Preview3DDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deceasedInfo: any;
}

const Preview3DDialog: React.FC<Preview3DDialogProps> = ({ 
  open, 
  onOpenChange,
  deceasedInfo 
}) => {
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [isCapturing, setIsCapturing] = React.useState(false);

  React.useEffect(() => {
    if (open && !isCapturing) {
      setIsCapturing(true);
      console.log("Starting image capture from preview display...");
      
      // Find the preview display element (the one with memorial-display class)
      setTimeout(() => {
        const previewElement = document.querySelector('.memorial-display') as HTMLElement;
        
        if (previewElement) {
          console.log("Found preview element, capturing...", previewElement);
          
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
            console.log("Image captured successfully, data URL length:", imageData.length);
            setPreviewImage(imageData);
            setIsCapturing(false);
          }).catch(error => {
            console.error("Error capturing preview:", error);
            setIsCapturing(false);
          });
        } else {
          console.error("Could not find preview element with class 'memorial-display'");
          setIsCapturing(false);
        }
      }, 1000); // Longer delay to ensure the preview is fully rendered
    }
  }, [open, isCapturing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">Vista previa en 3D</DialogTitle>
          <DialogDescription>
            Así se verá la señalización digital en la pantalla de la funeraria.
            {isCapturing && " Capturando imagen del diseño actual..."}
            {previewImage && " Imagen capturada y lista para mostrar."}
            {!isCapturing && !previewImage && " Error: No se pudo capturar la imagen."}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
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

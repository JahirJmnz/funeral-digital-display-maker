
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
      console.log("=== Comenzando la captura de imagen desde la vista previa... ===");
      
      setTimeout(() => {
        const previewElement = document.querySelector('.memorial-display') as HTMLElement;
        if (previewElement) {
          // DEBUG: Check if visible
          const style = window.getComputedStyle(previewElement);
          const rect = previewElement.getBoundingClientRect();
          console.log("Elemento .memorial-display que será capturado:", previewElement);
          console.log("Tamaño:", previewElement.offsetWidth, previewElement.offsetHeight);
          console.log("Bounding rect:", rect);
          console.log("Style.display:", style.display, "Opacity:", style.opacity, "Visibility:", style.visibility);
          console.log("HTML del elemento a capturar:", previewElement.innerHTML);

          // Si no es visible o no tiene tamaño, advertir
          if(style.display === "none" || Number(style.opacity) === 0 || style.visibility === "hidden" || previewElement.offsetWidth === 0 || previewElement.offsetHeight === 0){
            console.warn("ADVERTENCIA: El elemento .memorial-display NO ES VISIBLE y la captura será negra.");
          }

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
            console.log("Imagen capturada exitosamente. DataURL length:", imageData.length, "Ejemplo:", imageData.substring(0,80));
            setPreviewImage(imageData);
            setIsCapturing(false);
          }).catch(error => {
            console.error("Error capturando la vista previa:", error);
            setIsCapturing(false);
          });
        } else {
          console.error("No se encontró el elemento .memorial-display");
          setIsCapturing(false);
        }
      }, 1400); // Tiempo aumentado a 1.4s para mayor seguridad de que el DOM cargó completo
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


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
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [isCapturing, setIsCapturing] = React.useState(false);

  React.useEffect(() => {
    if (open && previewRef.current && !isCapturing) {
      setIsCapturing(true);
      console.log("Starting image capture...");
      
      // Longer delay to ensure the DOM is fully rendered
      setTimeout(() => {
        if (previewRef.current) {
          html2canvas(previewRef.current, {
            backgroundColor: '#2D1B69',
            logging: true,
            scale: 1,
            useCORS: true,
            allowTaint: true,
            width: 1920,
            height: 1080,
          }).then(canvas => {
            const imageData = canvas.toDataURL('image/png');
            console.log("Image captured successfully, data URL length:", imageData.length);
            setPreviewImage(imageData);
            setIsCapturing(false);
          }).catch(error => {
            console.error("Error capturing preview:", error);
            setIsCapturing(false);
          });
        }
      }, 500);
    }
  }, [open, isCapturing]);

  return (
    <>
      {/* Hidden div to capture the current preview */}
      <div 
        className="fixed left-[-9999px] top-0" 
        ref={previewRef}
        style={{ position: 'fixed', left: '-9999px', top: '0' }}
      >
        <div className="w-[1920px] h-[1080px] bg-funeral text-funeral-foreground p-12 flex flex-col font-sans">
          
          <div className="flex justify-end mb-4">
            <div className="text-2xl font-medium tracking-wider opacity-70">FUNERARIA SAN JOSÉ</div>
          </div>
          
          <div className="flex flex-1">
            {/* Left side - Photo */}
            <div className="w-1/2 pr-16 flex items-center justify-center">
              <div className="relative w-full h-[700px] rounded-md overflow-hidden border-4 border-funeral-foreground/20">
                <img 
                  src={deceasedInfo.photoUrl || "/placeholder.svg"} 
                  alt="Fotografía del fallecido" 
                  className="absolute inset-0 w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
            
            {/* Right side - Information */}
            <div className="w-1/2 flex flex-col justify-center pl-8">
              <div className="space-y-12">
                <div>
                  <h1 className="text-7xl font-serif font-semibold">
                    {deceasedInfo.name || "Nombre del fallecido"}
                  </h1>
                </div>
                
                <div className="text-3xl">
                  <div className="text-funeral-foreground/90">
                    {deceasedInfo.date ? new Date(deceasedInfo.date + 'T00:00:00').toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : ""}
                    {deceasedInfo.date && deceasedInfo.time ? " - " : ""}
                    {deceasedInfo.time}
                  </div>
                </div>
                
                <div className="text-3xl">
                  <div className="text-funeral-foreground/90">
                    Sala: {deceasedInfo.room || "Por asignar"}
                  </div>
                </div>
                
                <div className="mt-12 border-t-2 border-funeral-foreground/20 pt-8">
                  <p className="text-2xl italic text-funeral-foreground/90">
                    "{deceasedInfo.message || "Mensaje de condolencias"}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl">Vista previa en 3D</DialogTitle>
            <DialogDescription>
              Así se verá la señalización digital en la pantalla de la funeraria.
              {isCapturing && " Capturando imagen..."}
              {previewImage && " Imagen lista para mostrar."}
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
    </>
  );
};

export default Preview3DDialog;


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

  React.useEffect(() => {
    if (open && previewRef.current) {
      // Small delay to ensure the DOM is ready
      setTimeout(() => {
        if (previewRef.current) {
          html2canvas(previewRef.current, {
            backgroundColor: null,
            logging: false,
            scale: 2, // Higher quality
          }).then(canvas => {
            setPreviewImage(canvas.toDataURL());
          }).catch(error => {
            console.error("Error capturing preview:", error);
          });
        }
      }, 100);
    }
  }, [open]);

  return (
    <>
      {/* Hidden div to capture the current preview */}
      <div className="fixed left-[-9999px]" ref={previewRef}>
        <div className="w-[1920px] h-[1080px] bg-funeral">
          <div className="w-full h-full p-12">
            {/* Logo placement */}
            <div className="flex justify-end mb-4">
              <div className="text-lg font-medium tracking-wider opacity-70">FUNERARIA SAN JOSÉ</div>
            </div>
            
            <div className="flex h-full">
              {/* Left side - Photo */}
              <div className="w-1/2 pr-16 flex items-center justify-center">
                <div className="relative w-full h-full max-h-[70vh] rounded-md overflow-hidden border border-funeral-foreground/20">
                  <img 
                    src={deceasedInfo.photoUrl || "/placeholder.svg"} 
                    alt="Fotografía del fallecido" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Right side - Information */}
              <div className="w-1/2 flex flex-col justify-center">
                <div className="space-y-12">
                  {/* Name */}
                  <div>
                    <h1 className="text-6xl font-serif font-semibold">
                      {deceasedInfo.name || "Nombre del fallecido"}
                    </h1>
                  </div>
                  
                  {/* Date and Time */}
                  <div className="flex items-center space-x-4 text-2xl">
                    <div className="text-funeral-foreground/90">
                      {deceasedInfo.date ? new Date(deceasedInfo.date).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : ""}
                      {deceasedInfo.date && deceasedInfo.time ? " - " : ""}
                      {deceasedInfo.time}
                    </div>
                  </div>
                  
                  {/* Room */}
                  <div className="flex items-center space-x-4 text-2xl">
                    <div className="text-funeral-foreground/90">
                      Sala: {deceasedInfo.room || "Por asignar"}
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div className="mt-12 border-t border-funeral-foreground/20 pt-6">
                    <p className="text-xl italic text-funeral-foreground/90">
                      {deceasedInfo.message || "Mensaje de condolencias"}
                    </p>
                  </div>
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
              Así se verá la señalización digital en la pantalla de la funeraria
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

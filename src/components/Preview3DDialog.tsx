
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
  const webGLSupported = useWebGLSupport();

  if (!webGLSupported) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl">Vista previa</DialogTitle>
            <DialogDescription>
              La vista 3D no está disponible en este navegador (WebGL no soportado).
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <div className="w-full h-[500px] bg-gray-900 flex items-center justify-center text-white rounded">
              <p>WebGL no está disponible en este navegador</p>
            </div>
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
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <RoomPreview3D deceasedInfo={deceasedInfo} previewImage={null} />
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


import { useState } from 'react';
import { User, CalendarDays, MapPin, MessageSquare, Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { DeceasedInfo } from "@/types/deceased";

interface EditorSidebarProps {
  deceasedInfo: DeceasedInfo;
  onUpdate: (info: Partial<DeceasedInfo>) => void;
}

export default function EditorSidebar({ deceasedInfo, onUpdate }: EditorSidebarProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(deceasedInfo.photoUrl || null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Archivo demasiado grande",
          description: "La imagen debe ser menor a 5MB",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        onUpdate({ photoUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full bg-white border-r border-border overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Gestión de Servicios</h2>
        
        {/* Información Básica */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-funeral-muted" />
            <h3 className="section-title">Información básica</h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Nombre completo</Label>
              <Input 
                id="name" 
                value={deceasedInfo.name} 
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="Nombre del fallecido"
              />
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* Fecha y Hora */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="h-4 w-4 text-funeral-muted" />
            <h3 className="section-title">Fecha y hora</h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label htmlFor="date">Fecha</Label>
              <Input 
                id="date" 
                type="date"
                value={deceasedInfo.date} 
                onChange={(e) => onUpdate({ date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="time">Hora</Label>
              <Input 
                id="time" 
                type="time"
                value={deceasedInfo.time} 
                onChange={(e) => onUpdate({ time: e.target.value })}
              />
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* Fotografía */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Image className="h-4 w-4 text-funeral-muted" />
            <h3 className="section-title">Fotografía</h3>
          </div>
          <div className="space-y-3">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-4">
              {imagePreview ? (
                <div className="relative w-full pb-[100%]">
                  <img 
                    src={imagePreview} 
                    alt="Vista previa" 
                    className="absolute inset-0 w-full h-full object-cover rounded"
                  />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview(null);
                      onUpdate({ photoUrl: null });
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Image className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">Subir fotografía</p>
                  <p className="text-xs text-muted-foreground/70 mb-4">JPG, PNG o GIF (máx. 5MB)</p>
                  <Button asChild variant="outline" size="sm">
                    <label className="cursor-pointer">
                      Seleccionar archivo
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        accept="image/*" 
                      />
                    </label>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* Ubicación */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-funeral-muted" />
            <h3 className="section-title">Ubicación</h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label htmlFor="room">Sala</Label>
              <Input 
                id="room" 
                value={deceasedInfo.room} 
                onChange={(e) => onUpdate({ room: e.target.value })}
                placeholder="Número o nombre de sala"
              />
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* Mensaje */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-funeral-muted" />
            <h3 className="section-title">Mensaje</h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label htmlFor="message">Mensaje de condolencias</Label>
              <Textarea 
                id="message" 
                value={deceasedInfo.message} 
                onChange={(e) => onUpdate({ message: e.target.value })}
                placeholder="Mensaje para los familiares y asistentes"
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

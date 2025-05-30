
import { Cog, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Preview3DDialog from "./Preview3DDialog";

interface HeaderProps {
  showBackButton?: boolean;
  deceasedInfo?: any;
}

export default function Header({ showBackButton, deceasedInfo }: HeaderProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPreview3D, setShowPreview3D] = useState(false);
  
  const handlePublish = () => {
    // Show the 3D preview
    setShowPreview3D(true);
    
    // Also show the toast
    toast({
      title: "Publicado en pantallas",
      description: "La señalización ha sido publicada exitosamente en las pantallas del lobby.",
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-3 bg-white">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-xl font-medium">
          {showBackButton ? "Creador de Señalización Digital" : "Sistema de Señalización Digital"}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {showBackButton && deceasedInfo && (
          <>
            <Button onClick={handlePublish} className="bg-funeral hover:bg-funeral/90 text-white">
              Publicar en pantallas
            </Button>
            <Preview3DDialog 
              open={showPreview3D} 
              onOpenChange={setShowPreview3D} 
              deceasedInfo={deceasedInfo} 
            />
          </>
        )}
        <Button variant="ghost" size="icon">
          <Cog className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

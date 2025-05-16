
import { Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Header() {
  const { toast } = useToast();
  
  const handlePublish = () => {
    toast({
      title: "Publicado en pantallas",
      description: "La señalización ha sido publicada exitosamente en las pantallas del lobby.",
    });
  };

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-3 bg-white">
      <h1 className="text-xl font-medium">Creador de Señalización Digital</h1>
      <div className="flex items-center gap-4">
        <Button onClick={handlePublish} className="bg-funeral hover:bg-funeral/90 text-white">
          Publicar en pantallas
        </Button>
        <Button variant="ghost" size="icon">
          <Cog className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

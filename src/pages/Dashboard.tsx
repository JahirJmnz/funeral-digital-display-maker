
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Monitor } from "lucide-react";
import Header from '@/components/Header';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface Screen {
  id: string;
  name: string;
  location: string;
  hasContent: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estado para las pantallas disponibles (simuladas)
  const [screens, setScreens] = useState<Screen[]>([
    { id: "screen1", name: "Pantalla Lobby Principal", location: "Recepción", hasContent: true },
    { id: "screen2", name: "Pantalla Sala Esperanza", location: "Sala Esperanza", hasContent: false },
    { id: "screen3", name: "Pantalla Sala Paz", location: "Sala Paz", hasContent: true },
    { id: "screen4", name: "Nueva Pantalla", location: "Sin asignar", hasContent: false }
  ]);

  // Función para editar una pantalla (navegar al editor)
  const handleEdit = (screenId: string) => {
    navigate(`/edit/${screenId}`);
  };

  // Función para eliminar una pantalla
  const handleDelete = (screenId: string) => {
    toast({
      title: "Pantalla eliminada",
      description: "La pantalla ha sido eliminada correctamente",
    });
    
    setScreens(screens.filter(screen => screen.id !== screenId));
  };

  // Función para crear contenido nuevo
  const handleCreate = (screenId: string) => {
    navigate(`/edit/${screenId}`);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Gestión de Pantallas</h1>
          <p className="text-muted-foreground">Administra la señalización digital en las pantallas de la funeraria</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {screens.map((screen) => (
            <Card key={screen.id} className="overflow-hidden">
              <div className="h-32 bg-gray-200 flex items-center justify-center">
                <Monitor className="h-12 w-12 text-gray-400" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium">{screen.name}</h3>
                <p className="text-sm text-muted-foreground">{screen.location}</p>
              </CardContent>
              <CardFooter className="bg-gray-50 px-4 py-3 border-t">
                {screen.hasContent ? (
                  <div className="flex w-full gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(screen.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(screen.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-funeral hover:bg-funeral/90 text-white border-funeral"
                    onClick={() => handleCreate(screen.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Crear señalización
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

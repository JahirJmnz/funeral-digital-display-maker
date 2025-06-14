import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Monitor } from "lucide-react";
import Header from '@/components/Header';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { DeceasedInfo } from '@/types/deceased';
import { CalendarDays, MapPin } from "lucide-react";

interface Screen {
  id: string;
  name: string;
  location: string;
  hasContent: boolean;
}

// Mini preview component for the dashboard cards
const MiniPreviewDisplay = ({ deceasedInfo }: { deceasedInfo: DeceasedInfo }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <div className="w-full h-full bg-black flex items-center justify-center p-1">
      <div className="memorial-display w-full h-full p-2 rounded-sm overflow-hidden text-white" style={{ fontSize: '4px', lineHeight: '1.2' }}>
        {/* Logo placement */}
        <div className="flex justify-end mb-1">
          <div className="text-[3px] font-medium tracking-wider opacity-70">FUNERARIA SAN JOSÉ</div>
        </div>
        
        <div className="flex h-full">
          {/* Right side - Information only, no photo */}
          <div className="w-full flex flex-col justify-center">
            <div className="space-y-2">
              {/* Name */}
              <div>
                <h1 className="text-[6px] font-bold text-white mb-1">
                  {deceasedInfo.name}
                </h1>
              </div>
              
              {/* Date and Time */}
              <div className="flex items-center space-x-1">
                <CalendarDays className="h-[4px] w-[4px] text-white/70" />
                <div className="text-[4px] text-white/90">
                  {formatDate(deceasedInfo.date)}
                  {deceasedInfo.date && deceasedInfo.time ? " - " : ""}
                  {deceasedInfo.time}
                </div>
              </div>
              
              {/* Room */}
              <div className="flex items-center space-x-1">
                <MapPin className="h-[4px] w-[4px] text-white/70" />
                <div className="text-[4px] text-white/90">
                  Sala: {deceasedInfo.room}
                </div>
              </div>
              
              {/* Message */}
              <div className="mt-1 border-t border-white/20 pt-1">
                <p className="text-[4px] text-white/90 italic">
                  {deceasedInfo.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Sample deceased info for preview template
  const sampleDeceasedInfo: DeceasedInfo = {
    name: "Juan Pérez Rodríguez",
    date: "2025-05-17",
    time: "18:00",
    photoUrl: null,
    room: "Sala Esperanza 3",
    message: "Descanse en paz. Su recuerdo permanecerá siempre en nuestros corazones."
  };
  
  // Estado para las pantallas disponibles (simuladas)
  const [screens, setScreens] = useState<Screen[]>([
    { 
      id: "screen1", 
      name: "Pantalla Lobby Principal", 
      location: "Recepción", 
      hasContent: true
    },
    { 
      id: "screen2", 
      name: "Pantalla Sala Esperanza", 
      location: "Sala Esperanza", 
      hasContent: false 
    },
    { 
      id: "screen3", 
      name: "Pantalla Sala Paz", 
      location: "Sala Paz", 
      hasContent: true
    },
    { 
      id: "screen4", 
      name: "Pantalla Sala Serenidad", 
      location: "Sala Serenidad", 
      hasContent: false
    },
    { 
      id: "screen5", 
      name: "Pantalla Capilla", 
      location: "Capilla", 
      hasContent: true
    },
    { 
      id: "screen6", 
      name: "Pantalla Cafetería", 
      location: "Cafetería", 
      hasContent: false
    }
  ]);

  // Función para editar una pantalla (navegar al editor)
  const handleEdit = (screenId: string) => {
    navigate(`/edit/${screenId}`);
  };

  // Función para eliminar el contenido de una pantalla
  const handleDeleteContent = (screenId: string) => {
    toast({
      title: "Contenido eliminado",
      description: "La señalización digital ha sido eliminada de la pantalla.",
    });
    
    setScreens(screens.map(screen => 
      screen.id === screenId ? { ...screen, hasContent: false } : screen
    ));
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {screens.map((screen) => (
            <Card key={screen.id} className="overflow-hidden">
              <div className="h-36 bg-gray-200 flex items-center justify-center relative">
                {screen.name === "Pantalla Sala Esperanza" ? (
                  <Monitor className="h-12 w-12 text-gray-400" />
                ) : (
                  <MiniPreviewDisplay deceasedInfo={sampleDeceasedInfo} />
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="text-base font-medium">{screen.name}</h3>
                <p className="text-xs text-muted-foreground">{screen.location}</p>
                {screen.hasContent && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Contenido activo
                    </span>
                  </div>
                )}
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
                      onClick={() => handleDeleteContent(screen.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar contenido
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

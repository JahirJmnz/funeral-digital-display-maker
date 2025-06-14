
import React from 'react';
import { CalendarDays, MapPin } from "lucide-react";
import { DeceasedInfo } from "@/types/deceased";

interface PreviewDisplayProps {
  deceasedInfo: DeceasedInfo;
  onImageLoad?: () => void;
}

export default function PreviewDisplay({ deceasedInfo, onImageLoad }: PreviewDisplayProps) {
  // Default image placeholder
  const placeholderImage = "/placeholder.svg";

  React.useEffect(() => {
    // Always trigger onImageLoad after component mounts and renders
    const timer = setTimeout(() => {
      console.log("PreviewDisplay: Triggering onImageLoad callback");
      if (onImageLoad) {
        onImageLoad();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [onImageLoad]);
  
  // Format the date and time
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

  const handleImageLoad = () => {
    console.log("PreviewDisplay: Image loaded successfully");
    if (onImageLoad) {
      onImageLoad();
    }
  };

  const handleImageError = () => {
    console.log("PreviewDisplay: Image failed to load, using placeholder");
    if (onImageLoad) {
      onImageLoad();
    }
  };

  return (
    <div className="w-full h-full p-6 bg-gray-100 flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-medium">Vista previa de pantalla</h2>
        <div className="text-sm text-muted-foreground">55"</div>
      </div>
      
      {/* TV frame simulation */}
      <div className="flex-1 bg-black p-3 rounded-lg shadow-lg flex items-center justify-center">
        <div className="memorial-display w-full h-full p-8 rounded-sm animate-fade-in overflow-hidden">
          {/* Logo placement */}
          <div className="flex justify-end mb-2">
            <div className="text-xs font-medium tracking-wider opacity-70">FUNERARIA SAN JOSÉ</div>
          </div>
          
          <div className="flex h-full">
            {/* Left side - Photo */}
            <div className="w-1/2 pr-10 flex items-center justify-center">
              <div className="relative w-full h-full max-h-[70vh] rounded-md overflow-hidden border border-funeral-foreground/20">
                <img 
                  src={deceasedInfo.photoUrl || placeholderImage} 
                  alt="Fotografía del fallecido" 
                  className="absolute inset-0 w-full h-full object-cover"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>
            </div>
            
            {/* Right side - Information */}
            <div className="w-1/2 flex flex-col justify-center">
              <div className="space-y-8">
                {/* Name */}
                <div>
                  <h1 className="memorial-name">
                    {deceasedInfo.name || "Nombre del fallecido"}
                  </h1>
                </div>
                
                {/* Date and Time */}
                <div className="flex items-center space-x-3">
                  <CalendarDays className="h-5 w-5 text-funeral-foreground/70" />
                  <div className="memorial-info">
                    {formatDate(deceasedInfo.date)}
                    {deceasedInfo.date && deceasedInfo.time ? " - " : ""}
                    {deceasedInfo.time}
                  </div>
                </div>
                
                {/* Room */}
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-funeral-foreground/70" />
                  <div className="memorial-info">
                    Sala: {deceasedInfo.room || "Por asignar"}
                  </div>
                </div>
                
                {/* Message */}
                <div className="mt-8 border-t border-funeral-foreground/20 pt-4">
                  <p className="memorial-info italic">
                    {deceasedInfo.message || "Mensaje de condolencias"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

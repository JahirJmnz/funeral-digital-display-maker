
import { useState } from 'react';
import Header from '@/components/Header';
import EditorSidebar from '@/components/EditorSidebar';
import PreviewDisplay from '@/components/PreviewDisplay';
import { DeceasedInfo } from '@/types/deceased';

const Index = () => {
  // Initialize with default values
  const [deceasedInfo, setDeceasedInfo] = useState<DeceasedInfo>({
    name: "Juan Pérez Rodríguez",
    date: "2025-05-17",
    time: "18:00",
    photoUrl: null,
    room: "Sala Esperanza 3",
    message: "Descanse en paz. Su recuerdo permanecerá siempre en nuestros corazones."
  });

  // Update the deceased information
  const handleInfoUpdate = (updatedInfo: Partial<DeceasedInfo>) => {
    setDeceasedInfo(prev => ({
      ...prev,
      ...updatedInfo
    }));
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Sidebar - 30% */}
        <div className="w-[30%]">
          <EditorSidebar 
            deceasedInfo={deceasedInfo}
            onUpdate={handleInfoUpdate}
          />
        </div>
        
        {/* Preview Area - 70% */}
        <div className="w-[70%]">
          <PreviewDisplay deceasedInfo={deceasedInfo} />
        </div>
      </div>
    </div>
  );
};

export default Index;

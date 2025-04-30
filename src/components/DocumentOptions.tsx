
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Camera, Upload } from "lucide-react";

interface DocumentOptionsProps {
  onOptionSelected: (option: "mobile" | "camera" | "upload") => void;
}

const DocumentOptions: React.FC<DocumentOptionsProps> = ({ onOptionSelected }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-center mb-6">Escolha como proceder</h2>
      
      <Card 
        className="relative border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
        onClick={() => onOptionSelected("mobile")}
      >
        <div className="absolute top-0 left-0 p-1 bg-green-600 text-white text-xs font-medium px-2 rounded-br">RECOMENDADO</div>
        <div className="p-4 flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Smartphone className="h-6 w-6 text-primary"/>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Usar telefone celular</h3>
            <p className="text-sm text-muted-foreground">É possível tirar fotos mais nítidas de seus documentos com smartphones</p>
          </div>
        </div>
      </Card>
      
      <Card 
        className="border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
        onClick={() => onOptionSelected("camera")}
      >
        <div className="p-4 flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Camera className="h-6 w-6 text-primary"/>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Continuar neste dispositivo</h3>
            <p className="text-sm text-muted-foreground">Use a câmera integrada ou uma webcam conectada</p>
          </div>
        </div>
      </Card>
      
      <Card 
        className="border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
        onClick={() => onOptionSelected("upload")}
      >
        <div className="p-4 flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Upload className="h-6 w-6 text-primary"/>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Carregue o arquivo</h3>
            <p className="text-sm text-muted-foreground">Envie deste dispositivo o arquivo em um dos seguintes formatos: JPG, JPEG, PNG</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DocumentOptions;

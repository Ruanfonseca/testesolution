
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentOptions from "@/components/DocumentOptions";
import Camera from "@/components/Camera";
import DocumentUploader from "@/components/DocumentUploader";
import { DocumentCaptureMethod, VerificationMethod } from "@/types/kyc";

interface DocumentVerificationFormProps {
  verificationMethod: VerificationMethod;
  documentType: "cnh" | "document";
  captureMethod: DocumentCaptureMethod;
  capturedImage: string | null;
  isLoading: boolean;
  onVerificationMethodChange: (method: VerificationMethod) => void;
  onDocumentTypeChange: (type: "cnh" | "document") => void;
  onCaptureMethodChange: (method: DocumentCaptureMethod) => void;
  onImageCapture: (imageData: string) => void;
  onVerify: () => void;
}

const DocumentVerificationForm: React.FC<DocumentVerificationFormProps> = ({
  verificationMethod,
  documentType,
  captureMethod,
  capturedImage,
  isLoading,
  onVerificationMethodChange,
  onDocumentTypeChange,
  onCaptureMethodChange,
  onImageCapture,
  onVerify,
}) => {
  return (
    <div>
      <Tabs defaultValue={verificationMethod} onValueChange={(v) => onVerificationMethodChange(v as VerificationMethod)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {/* <TabsTrigger value="regular">Verificação Padrão</TabsTrigger>
          <TabsTrigger value="faceLiveness">Verificação Facial ao Vivo</TabsTrigger> */}
          <TabsTrigger value="rekognition">Rekognition</TabsTrigger>
        </TabsList>
        
        <TabsContent value="regular">
          <div className="space-y-4">
            <div className="flex flex-col space-y-3">
              <label className="font-medium">Tipo de Documento:</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={documentType === "cnh"}
                    onChange={() => onDocumentTypeChange("cnh")}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span>CNH Digital</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={documentType === "document"}
                    onChange={() => onDocumentTypeChange("document")}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span>Outro documento com foto</span>
                </label>
              </div>
            </div>
            
            {captureMethod === "options" ? (
              <DocumentOptions onOptionSelected={onCaptureMethodChange} />
            ) : captureMethod === "camera" ? (
              <Camera onCapture={onImageCapture} />
            ) : (
              <DocumentUploader 
                onImageSelected={onImageCapture}
                documentType={documentType}
              />
            )}
            
            {captureMethod !== "options" && (
              <Button 
                onClick={() => onCaptureMethodChange("options")} 
                variant="outline" 
                className="w-full mt-2"
              >
                Voltar para opções
              </Button>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="faceLiveness">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-2">
              Siga as instruções para realizar a verificação facial ao vivo.
              Certifique-se de estar em um local bem iluminado e olhe diretamente para a câmera.
            </p>
            
            <Camera 
              onCapture={onImageCapture} 
              faceLiveness={true}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="rekognition">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-2">
              Posicione seu rosto no quadro para análise biométrica com o sistema Amazon Rekognition.
              Este processo verifica sua identidade de forma segura e precisa.
            </p>
            
            <Camera 
              onCapture={onImageCapture} 
              rekognition={true}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <Button 
          onClick={onVerify} 
          disabled={!capturedImage || isLoading}
          className="w-full"
        >
          {isLoading ? "Processando..." : "Verificar identidade"}
        </Button>
      </div>
    </div>
  );
};

export default DocumentVerificationForm;

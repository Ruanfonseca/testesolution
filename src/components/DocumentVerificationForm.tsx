
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RegulaData, UserData } from "@/types/kyc";


interface DocumentVerificationFormProps {
  capturedImage: string | null;
  isLoading: boolean;
  onImageCapture: (imageData: string, side: "front" | "back") => void;
  onVerify: () => void;
  userData:UserData
}

const DocumentVerificationForm: React.FC<DocumentVerificationFormProps> = ({
  isLoading,
  onImageCapture,
  onVerify,
  userData
}) => {
  const [documentImages, setDocumentImages] = useState<RegulaData>({
    ...userData,
    front: null,
    back: null,
    type:"documentLess"
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const formData = new FormData();

 const handleFileChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
  side: "front" | "back"
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    const base64 = reader.result as string;

    const documentBytes = Object.values(file ?? []);
    const uint8Array = new Uint8Array(documentBytes);
    formData.append(
      side === "front" ? "documentBytesFront" : "documentBytesBack",
      new Blob([uint8Array])
    );

    setDocumentImages((prev) => ({
      ...prev,
      [side]: base64,
    }));

    onImageCapture(base64, side);
  };
  reader.readAsDataURL(file);
};




  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="front-document" className="block font-medium mb-2">Frente do documento</Label>
        <div className="flex flex-col space-y-2">
          <input
            id="front-document"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "front")}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
          />
          {documentImages.front && (
              <div className="relative mt-2 border rounded-md overflow-hidden">
                <img 
                  src={documentImages.front} 
                  alt="Frente do documento" 
                  className="w-full h-auto max-h-48 object-contain"
                />
              </div>
            )}
        </div>
      </div>

      <div>
        <Label htmlFor="back-document" className="block font-medium mb-2">Verso do documento</Label>
        <div className="flex flex-col space-y-2">
          <input
            id="back-document"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "back")}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
          />
          {documentImages.back && (
              <div className="relative mt-2 border rounded-md overflow-hidden">
                <img 
                  src={documentImages.back} 
                  alt="Verso do documento" 
                  className="w-full h-auto max-h-48 object-contain"
                />
              </div>
            )}
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-4">
        <Checkbox 
          id="terms" 
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm text-muted-foreground">
          Eu concordo com os termos de privacidade e de verificação de identidade
        </Label>
      </div>

      <Button
          onClick={onVerify}
          disabled={!documentImages.front || !documentImages.back || !termsAccepted || isLoading}
          className="w-full mt-4"
        >
          {isLoading ? "Processando..." : "Verificar identidade"}
        </Button>

    </div>
  );
};

export default DocumentVerificationForm;

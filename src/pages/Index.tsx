
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import KycVerificationContainer from "@/components/KycVerificationContainer";
import VerificationProgress from "@/components/VerificationProgress";
import { 
  UserData, 
  VerificationMethod, 
  DocumentCaptureMethod, 
  KycResponseDTO 
} from "@/types/kyc";
import { parseURLParams, setupIframeMessageListener } from "@/utils/formatters";
import { validateUserData, formatDateForAPI } from "@/utils/validations";
import { registerUser } from "@/services/api";

// Componente principal da página de verificação KYC
const Index = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<number>(0);
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>("regular");
  const [documentType, setDocumentType] = useState<"cnh" | "document">("cnh");
  const [captureMethod, setCaptureMethod] = useState<DocumentCaptureMethod>("options");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    cpf: "",
    birthDate: "",
    referenceImg:null,
    fatherUrl:''
  });
  const [verificationResult, setVerificationResult] = useState<KycResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Sinal para o pai quando a verificação estiver completa
  const notifyParentWindow = (result: KycResponseDTO | null) => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'KYC_VERIFICATION_COMPLETE',
        data: JSON.stringify(result)
      }, '*');
    }
  };
  
  // Analisa parâmetros de URL quando o componente é montado
  useEffect(() => {
    const params = parseURLParams();
    const isReady = params.name && params.cpf && params.birthDate && params.fatherUrl;

    if (isReady) {
      const updatedData = {
        fullName: params.name,
        cpf: params.cpf,
        birthDate: params.birthDate,
        referenceImg: null,
        fatherUrl:params.fatherUrl
      };
  
      setUserData(updatedData);
  
      if (validateUserData(updatedData)) {
      //

        console.log("✅ Dados válidos, mudando step");
        setVerificationMethod("rekognition");
        setTimeout(() => {
          setStep(1);
        }, 0);
      } else {
        console.log("❌ Dados inválidos:", updatedData);
      }
    }
  
    // setupIframeMessageListener((data) => {
    //   const complete = data.name && data.cpf && data.birthDate && data.fatherUrl;
    //   if (complete) {
    //     const updated = {
    //       fullName: data.name,
    //       cpf: data.cpf,
    //       birthDate: data.birthDate,
    //       referenceImg: null,
    //       fatherUrl:data.fatherUrl
    //     };
    //     setUserData(updated);
  
    //     if (validateUserData(updated)) {
    //       setVerificationMethod("rekognition");
    //       setStep(1)
    //     }
    //   }
    // });
  }, []);
  
  
  
  // Quando a verificação estiver completa, notifique o pai
  useEffect(() => {
    if (verificationResult) {
      notifyParentWindow(verificationResult);
    }
  }, [verificationResult]);
  
  // Função para iniciar o processo de verificação
  const handleVerification = async () => {
    if (!capturedImage) {
      toast({
        title: "Imagem não capturada",
        description: "Por favor, capture ou envie uma imagem para continuar.",
        variant: "destructive"
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Termos de privacidade",
        description: "Você precisa aceitar os termos de privacidade para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setStep(2);
    
    try {
      // Chamada para a API real do KycBetService.registerUser
      const response = await registerUser({
        username: userData.fullName,
        cpf: userData.cpf,
        birthDate: formatDateForAPI(userData.birthDate),
        referenceImage: capturedImage,
        type: documentType,
        verificationMethod: verificationMethod,
        front: "",
        back: ""
      });
      
      if (response) {
        setVerificationResult(response);
        setStep(3);
      } else {
        throw new Error("Falha na verificação");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Erro na verificação",
        description: "Ocorreu um erro ao processar sua verificação. Por favor, tente novamente.",
        variant: "destructive"
      });
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para redefinir o processo de verificação
  const resetVerification = () => {
    setCapturedImage(null);
    setVerificationResult(null);
    setStep(1);
  };
  
  return (
    <div className="min-h-screen bg-kyc-background p-4 sm:p-6">
      <VerificationProgress 
        currentStep={step} 
        faceLiveness={ verificationMethod === "rekognition"} 
      />
      
      <KycVerificationContainer 
        step={step}
        userData={userData}
        verificationMethod={verificationMethod}
        documentType={documentType}
        captureMethod={captureMethod}
        capturedImage={capturedImage}
        termsAccepted={termsAccepted}
        isLoading={isLoading}
        verificationResult={verificationResult}
        onStepChange={setStep}
        onUserDataChange={setUserData}
        onVerificationMethodChange={setVerificationMethod}
        onDocumentTypeChange={setDocumentType}
        onCaptureMethodChange={setCaptureMethod}
        onImageCapture={setCapturedImage}
        onTermsAcceptedChange={setTermsAccepted}
        onVerify={handleVerification}
        onRetry={resetVerification}     
          />
    </div>
  );
};

export default Index;

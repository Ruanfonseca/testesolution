import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import UserInfoForm from "@/components/UserInfoForm";
import ProcessingVerification from "@/components/ProcessingVerification";
import UserInfoCard from "@/components/UserInfoCard";
import VerificationResult from "@/components/VerificationResult";
import {
  UserData,
  KycResponseDTO,
  DocumentCaptureMethod,
  VerificationMethod,
  KycVerificationContainerProps
} from "@/types/kyc";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useFaceLivenessSessionId } from "@/services/faceLiveness/hooks/useFaceLivenessSessionId";
import { useFaceLivenessResult } from "@/services/faceLiveness/hooks/useFaceLivenessResult";
import { Loader, ThemeProvider } from "@aws-amplify/ui-react";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { toast } from "sonner";
import "@aws-amplify/ui-react/styles.css";
import { faceLesstheme } from "@/components/interfaces";
import { defaultLivenessDisplayText } from "@/utils/utils";


const KycVerificationContainer: React.FC<KycVerificationContainerProps> = ({
  step,
  userData,
  verificationMethod,
  documentType,
  captureMethod,
  capturedImage,
  termsAccepted,
  isLoading,
  verificationResult,
  onStepChange,
  onUserDataChange,
  onVerificationMethodChange,
  onDocumentTypeChange,
  onCaptureMethodChange,
  onImageCapture,
  onTermsAcceptedChange,
  onVerify,
  onRetry
}) => {
  const [startDetection, setStartDetection] = useState(true);
  const { data: sessionId, isLoading: loadingSession } = useFaceLivenessSessionId(startDetection);
  const mutation = useFaceLivenessResult();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (sessionId && step === 1) setDialogOpen(true);
  }, [sessionId, step]);

  const handleClose = () => {
    setDialogOpen(false);
    setStartDetection(false);
  };

  const handleAnalysisComplete = async () => {
    const result = await mutation.mutateAsync(sessionId!);
    const confidence = Number(result.Confidence?.toFixed(2));

    if (confidence <= Number(import.meta.env.VITE_FACELIVENESS_CONFIDENCE)) {
      toast.error(`Baixa confiabilidade: ${confidence}`);
      handleClose();
      return;
    }

    try {
      const video = document.querySelector("video");
      if (video) {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
        onImageCapture(dataUrl); // envia a imagem como base64
        toast.success("Imagem capturada com sucesso!");
        onStepChange(2);
      }
    } catch (error) {
      console.error("Erro ao capturar imagem:", error);
      toast.error("Erro ao capturar imagem.");
    }

    toast.success(`Verificação facial concluída! Confiabilidade: ${confidence}`);
    handleClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <UserInfoCard userData={userData} />
            <AlertDialog open={dialogOpen}>
              <AlertDialogContent className="flex w-full h-full md:h-auto p-1 md:p-6 bg-white outline-none border-none max-w-xl">
                <section className="w-full p-0 relative flex flex-col gap-4 justify-center items-center">
                  {loadingSession ? (
                    <Loader className="w-20" />
                  ) : (
                    <>
                      <ThemeProvider theme={faceLesstheme}>
                        <FaceLivenessDetector
                          displayText={defaultLivenessDisplayText}
                          sessionId={sessionId}
                          region="us-east-1"
                          onAnalysisComplete={handleAnalysisComplete}
                          onUserCancel={handleClose}
                          onError={(err) => {
                            console.error("Erro no detector:", err);
                            toast.error("Erro na verificação facial");
                            handleClose();
                          }}
                        />
                      </ThemeProvider>

                      <Button onClick={handleClose} variant="secondary">
                        Cancelar
                      </Button>
                    </>
                  )}
                </section>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );

      case 2:
        return (
          <>
            <UserInfoCard userData={userData} />
            <ProcessingVerification />
          </>
        );

      case 3:
        return (
          <>
            <UserInfoCard userData={userData} />
            <VerificationResult result={verificationResult} onRetry={onRetry} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-primary">KYC Verification</h1>
        </div>
      </div>

      {renderStepContent()}
    </div>
  );
};

export default KycVerificationContainer;

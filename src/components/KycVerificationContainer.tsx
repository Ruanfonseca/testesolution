import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  KycVerificationContainerProps,
  ResponseWebService
} from "@/types/kyc";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useFaceLivenessSessionId } from "@/services/faceLiveness/hooks/useFaceLivenessSessionId";
import { useFaceLivenessResult } from "@/services/faceLiveness/hooks/useFaceLivenessResult";
import { Loader, ThemeProvider } from "@aws-amplify/ui-react";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { toast } from "sonner";
import "@aws-amplify/ui-react/styles.css";
import { defaultLivenessDisplayText } from "@/utils/utils";
import { verifyFacialLiveness } from "@/services/api";
import DocumentVerificationForm from "./DocumentVerificationForm";
import { faceLesstheme } from "./interfaces";


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
  const [responseWebService, setResponseWebService] = useState<ResponseWebService | null>(null);
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
    const formData = new FormData();
    const confidence = Number(result.Confidence?.toFixed(2));
    const urlPai = new URL(userData.fatherUrl);
      
  
    try {
      const video = document.querySelector("video");
      if (video) {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
  
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
  
        const imgJpg = canvas.toDataURL("image/jpeg", 0.95);

        //Gerando um base 64
        const base64 = imgJpg.split(",")[1];

        // Decodifica a base64 em uma string binária
        const binaryString = atob(base64);

        // Converte string binária em Uint8Array
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Cria um Blob do tipo JPEG
        const blob = new Blob([bytes], { type: "image/jpeg" });

        

        //verificando se é um ser Humano
        if (confidence < Number(import.meta.env.VITE_FACELIVENESS_CONFIDENCE)) {
            //   window.parent.postMessage(
            //     {
            //       status: "error",
            //       faceMatch: false,
            //       confidence,
            //       userId: "123456",
            //       message: "Baixa Confidencialidade"
            //     },
            //     urlPai.toString()
            //   );
            // handleClose();
            // return;

             //verificando se existe no banco
             onStepChange(3);
           
          }else{
            onStepChange(3);
                     
          }

        }
      } catch (error) {
        console.error("Erro ao capturar imagem:", error);
        toast.error("Erro ao capturar imagem.",error);
      } finally {
        handleClose();
      }
    };
    
  

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <UserInfoCard userData={userData} />
            {dialogOpen && (
                <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
                  {loadingSession ? (
                    <Loader className="w-20" />
                  ) : (
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
                  )}
                </div>
              )}


          </>
        );

        case 2:
          const handleDocumentVerify = () => {
            onStepChange(4);
          };

          return (
            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle>Verificação de Identidade</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <DocumentVerificationForm 
                  capturedImage={capturedImage} 
                  isLoading={isLoading} 
                  userData={userData}
                  onImageCapture={(imageData, side) => {
                    if (side === "front") {
                      onImageCapture(imageData);
                    }
                  }} 
                  onVerify={handleDocumentVerify} 
                />
              </CardContent>
            </Card>
          );

  
          case 3:
              return (
                <>
                  <UserInfoCard userData={userData} />
                  <ProcessingVerification
                    userData={userData}
                    onStepChange={onStepChange}
                    setResponseWebService={setResponseWebService}
                  />

                </>
              );
    
            case 4:
                return (
                  <>
                    <VerificationResult
                      result={responseWebService}
                      onRetry={onRetry}
                      finished={true}
                      originUrl={userData.fatherUrl}
                      onClose={handleClose} 
                    />
                  </>
                );

            
    
          default:
            return null;
        }
  };

  return (
    <div className="max-w-md mx-auto relative min-h-[400px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
  
};

export default KycVerificationContainer;

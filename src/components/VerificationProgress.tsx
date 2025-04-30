
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VerificationProgressProps {
  currentStep: number;
  faceLiveness?: boolean;
}

const VerificationProgress: React.FC<VerificationProgressProps> = ({ 
  currentStep, 
  faceLiveness = false 
}) => {
  const steps = [
    "Informações pessoais",
    faceLiveness ? "Verificação facial ao vivo" : "Envio de documento",
    "Verificação",
    "Resultado"
  ];
  
  return (
    <Card className="mb-6">
      <CardHeader className="bg-primary/5 pb-2">
        <CardTitle className="text-lg text-primary">Processo de Verificação</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-3">
        <div className="flex w-full justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center mb-2
                ${index < currentStep 
                  ? "bg-primary text-primary-foreground" 
                  : index === currentStep 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-gray-200 text-gray-500"}
              `}>
                {index < currentStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={`text-xs text-center ${index === currentStep ? "font-semibold" : "text-gray-500"}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-3 flex w-full">
          {steps.slice(0, -1).map((_, index) => (
            <div 
              key={index}
              className={`flex-1 h-1 ${index < currentStep ? "bg-primary" : "bg-gray-200"}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationProgress;

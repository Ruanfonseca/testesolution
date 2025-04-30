
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KycResponseDTO } from "@/types/kyc";

interface VerificationResultProps {
  result: KycResponseDTO | null;
  onRetry: () => void;
}

const VerificationResult: React.FC<VerificationResultProps> = ({ result, onRetry }) => {
  if (!result) {
    return (
      <Card>
        <CardHeader className="bg-muted">
          <CardTitle>Aguardando resultados</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p>Os resultados da verificação ainda não estão disponíveis.</p>
        </CardContent>
      </Card>
    );
  }
  
  const { userDocumentDTO, facialValidationDTO, pepValidationDTO } = result;
  const allApproved = userDocumentDTO.approved && facialValidationDTO.approved && pepValidationDTO.approved;
  
  return (
    <Card>
      <CardHeader className={`${allApproved ? 'bg-green-50' : 'bg-red-50'}`}>
        <CardTitle className={`${allApproved ? 'text-green-700' : 'text-red-700'}`}>
          {allApproved ? 'Verificação Aprovada' : 'Verificação Não Aprovada'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Resultado da verificação de documento - userDocumentDTO */}
          <ResultItem 
            title="Verificação de Documento" 
            approved={userDocumentDTO.approved} 
            message={userDocumentDTO.message}
          />
          
          {/* Resultado da verificação facial - facialValidationDTO */}
          <ResultItem 
            title="Verificação Facial" 
            approved={facialValidationDTO.approved} 
            message={facialValidationDTO.message}
          />
          
          {/* Resultado da verificação PEP - pepValidationDTO */}
          <ResultItem 
            title="Verificação PEP" 
            approved={pepValidationDTO.approved} 
            message={pepValidationDTO.message}
          />
          
          {!allApproved && (
            <div className="pt-4">
              <Button onClick={onRetry} className="w-full">
                Tentar novamente
              </Button>
            </div>
          )}
          
          {/* Exibe funções políticas se existirem */}
          {pepValidationDTO.functions && pepValidationDTO.functions.length > 0 && (
            <div className="pt-2 border-t">
              <h4 className="font-medium mb-2">Funções políticas identificadas:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {pepValidationDTO.functions.map((func, index) => (
                  <li key={index} className="text-sm">{func}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface ResultItemProps {
  title: string;
  approved: boolean;
  message: string;
}

const ResultItem: React.FC<ResultItemProps> = ({ title, approved, message }) => {
  return (
    <div className="flex items-start">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${approved ? 'bg-green-100' : 'bg-red-100'}`}>
        {approved ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-600">{message || (approved ? "Verificação concluída com sucesso." : "A verificação não foi aprovada.")}</p>
      </div>
    </div>
  );
};

export default VerificationResult;


import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ProcessingVerification: React.FC = () => {
  return (
    <Card>
      <CardHeader className="bg-primary/5">
        <CardTitle>Processando Verificação</CardTitle>
      </CardHeader>
      <CardContent className="py-10">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          </div>
          <p className="mt-6 text-center text-gray-600">
            Estamos processando sua verificação. Por favor, aguarde um momento...
          </p>
          <ul className="mt-4 text-sm text-gray-500 space-y-2 max-w-md mx-auto">
            <li className="flex items-center">
              <span className="mr-2">•</span>
              <span>Analisando documentação</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              <span>Verificando biometria facial</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              <span>Realizando consultas PEP</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingVerification;

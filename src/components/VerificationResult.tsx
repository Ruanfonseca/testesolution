import React, { useEffect, useState } from "react";
import { ResponseWebService } from "@/types/kyc";
import gif from "@/assets/Confirmed.gif";

interface VerificationResultProps {
  result: ResponseWebService | null;
  onRetry: () => void;
  finished?: boolean;
  originUrl: string;
  onClose: () => void;
}

const VerificationResult: React.FC<VerificationResultProps> = ({
  result,
  onRetry,
  finished,
  originUrl,
  onClose,
}) => {
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    if (messageSent && result) {
      window.parent.postMessage(
        {
          status: "error",
          faceMatch: false,
          userId: "123456",
          message: result.message,
        },
        "*"
      );
      onClose();
    }
  }, [messageSent, result, originUrl, onClose]);

  if (!finished) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-white rounded-2xl shadow-md relative">
      <img
        src={gif}
        alt="Verificação concluída"
        className="w-48 h-48 object-contain mb-4"
      />
      <p className="text-xl font-semibold text-gray-700 text-center mb-6">
        Verificação concluída com sucesso!
      </p>

      <button
        onClick={() => setMessageSent(true)}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
      >
        Fechar
      </button>
    </div>
  );
};

export default VerificationResult;

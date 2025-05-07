import React, { useEffect } from "react";
import { ResponseWebService } from "@/types/kyc";

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
  onClose
}) => {

  useEffect(() => {
    console.log("useEffect triggered in VerificationResult");
    console.log("finished:", finished);
    console.log("result:", result);

    if (finished) {
      console.log("Posting message to parent window:", {
        isApproved: result.approved,
        message: result.message
      });

      window.parent.postMessage(
        {
          status: "error",
                  faceMatch: false,
                  confidence:result.approved ,
                  userId: "123456",
                  message: result.message
        },
        originUrl.toString()
      );

      console.log("Calling onClose to close modal.");
      const timeout = setTimeout(() => {
        onClose();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [finished, result, originUrl, onClose]);

  return null;
};

export default VerificationResult;

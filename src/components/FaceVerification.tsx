// components/FaceVerification.tsx
import { useEffect } from "react";

type Props = {
  onVerified: (result: { faceMatch: boolean; userId: string }) => void;
};

export default function FaceVerification({ onVerified }: Props) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://testesolution.vercel.app") return;

      const { status, faceMatch, userId } = event.data;

      if (status === "success") {
        onVerified({ faceMatch, userId }); // 🔁 Notifica o pai
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onVerified]);

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white flex justify-center items-center">
      <iframe
        src="https://testesolution.vercel.app?name=João Silva&cpf=17192891746&birthDate=1990-01-01"
        width="90%"
        allow="camera"
        height="600px"
        style={{ border: "none" }}
        title="Verificação Facial"
      ></iframe>
    </div>
  );
}

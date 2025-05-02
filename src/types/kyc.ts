
export interface UserData {
  fullName: string;
  cpf: string;
  birthDate: string;
  referenceImg?: Uint8Array; 
}

export interface KycVerificationContainerProps {
  step: number;
  userData: UserData;
  verificationMethod: VerificationMethod;
  documentType: "cnh" | "document";
  captureMethod: DocumentCaptureMethod;
  capturedImage: string | null;
  termsAccepted: boolean;
  isLoading: boolean;
  fatherDomain:string;
  verificationResult: KycResponseDTO | null;
  onStepChange: (step: number) => void;
  onUserDataChange: (data: UserData) => void;
  onVerificationMethodChange: (method: VerificationMethod) => void;
  onDocumentTypeChange: (type: "cnh" | "document") => void;
  onCaptureMethodChange: (method: DocumentCaptureMethod) => void;
  onImageCapture: (imageData: string) => void;
  onTermsAcceptedChange: (accepted: boolean) => void;
  onVerify: () => void;
  onRetry: () => void;
}

export interface VerificationResult {
  documentApproved: boolean;
  facialApproved: boolean;
  pepApproved: boolean;
  message: string;
}

// Equivalente ao KycFacialValidationDTO do backend
export interface FacialValidationDTO {
  approved: boolean;
  message: string;
}

// Equivalente ao KycUserDocumentDTO do backend
export interface UserDocumentDTO {
  name: string | null;
  approved: boolean;
  message: string;
  birthDate: string;
  cpf: string;
  documentTittle?: string;
  dType?: number;
}

// Equivalente ao KycPepValidationDTO do backend
export interface PepValidationDTO {
  approved: boolean;
  message: string;
  functions: string[]; // Lista de funções políticas encontradas
}

// Equivalente ao KycResponseDTO do backend
export interface KycResponseDTO {
  userDocumentDTO: UserDocumentDTO;
  facialValidationDTO: FacialValidationDTO;
  pepValidationDTO: PepValidationDTO;
}

// Equivalente ao KycRegisterUserPayloadDTO do backend
export interface KycRegisterPayload {
  username: string;
  cpf: string;
  birthDate: string;
  referenceImage: string; // Imagem codificada em base64
  type: 'cnh' | 'document'; // Tipo de verificação
  verificationMethod?: VerificationMethod; // Método de verificação opcional
}

export type VerificationMethod = 'regular' | 'faceLiveness' | 'rekognition';

// Interface para comunicação com iframe
export interface IframeMessage {
  name?: string;
  fullName?: string;
  cpf?: string;
  birthDate?: string;
  dataNascimento?: string;
}

// Interface para comunicação de resultados para o pai
export interface KycResultMessage {
  type: 'KYC_VERIFICATION_COMPLETE';
  data: KycResponseDTO | null;
}

// Interfaces do Regula Document Reader baseadas na documentação
export interface RegulaOneCandidateDTO {
  dType: number;
  dDescription: string;
}

export interface RegulaTextDTO {
  fullName: string;
  birthDate: string;
  documentNumber: string;
}

export interface RegulaAuthenticityCheckDTO {
  hasImageDocument: boolean; // Se o documento possui uma imagem
  percentValue: number; // Percentual de similaridade para correspondência facial
}

export interface RegulaContainer {
  oneCandidateDTO: RegulaOneCandidateDTO;
  regulaTextDTO: RegulaTextDTO;
  authenticityCheckListDTO: RegulaAuthenticityCheckDTO;
}

export interface RegulaResponse {
  ContainerList: RegulaContainer;
  status: string;
  statusCode: number;
}

// Opções para upload e captura de documento
export type DocumentCaptureMethod = 'mobile' | 'camera' | 'upload' | 'options';


import { KycRegisterPayload, KycResponseDTO, UserData } from "@/types/kyc";
import { toast } from "@/components/ui/use-toast";

// URL base da API KycBet
export const API_BASE_URL = import.meta.env.VITE_URL;

/**
 * Função para registrar um novo usuário no sistema KYC
 * Integra diretamente com o KycBetService.registerUser do backend
 * @param payload Dados do usuário e informações da verificação
 * @returns Resposta da validação ou null em caso de erro
 */
export const registerUser = async (payload: KycRegisterPayload): Promise<KycResponseDTO | null> => {
  try {
    // Chamada real à API do backend KycBetService.registerUser
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    toast({
      title: "Erro na verificação",
      description: "Ocorreu um erro ao processar a verificação. Por favor, tente novamente.",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Função para verificar a vivacidade facial do usuário
 * Integra com o método facialValidation do KycBetService
 * @param cpf CPF do usuário
 * @param referenceImage Imagem de referência em base64
 * @returns Resultado da validação facial
 */
export const verifyFacialLiveness = async (cpf: string, referenceImage: string): Promise<boolean> => {
  try {
    // Chamada real à API do backend KycBetService.facialValidation
    const response = await fetch(`${API_BASE_URL}/facial-validation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cpf,
        referenceImage,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    const data = await response.json();
    return data.approved;
  } catch (error) {
    console.error("Erro na verificação facial:", error);
    toast({
      title: "Erro na verificação facial",
      description: "Ocorreu um erro ao processar a verificação facial. Por favor, tente novamente.",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Função para verificar CPF do usuário
 * Integra com o método verifyCpf do KycBetService
 * @param cpf CPF do usuário a ser verificado
 * @returns Dados do usuário ou null em caso de erro
 */
export const verifyCpf = async (cpf: string): Promise<{ 
  name: string;
  birthDate: string;
  document: string;
  motherName: string;
} | null> => {
  try {
    // Chamada real à API do backend KycBetService.verifyCpf
    const response = await fetch(`${API_BASE_URL}/verify-cpf/${cpf}`);
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erro na verificação do CPF:", error);
    toast({
      title: "Erro na verificação do CPF",
      description: "Não foi possível verificar o CPF informado. Por favor, tente novamente.",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Função para verificar se um usuário é politicamente exposto (PEP)
 * Integra com o método kycVerifyPep do KycBetService
 * @param cpf CPF do usuário
 * @param fullName Nome completo do usuário
 * @returns Resultado da validação PEP
 */
export const verifyPEP = async (cpf: string, fullName: string): Promise<{
  approved: boolean;
  message: string;
  functions: string[];
}> => {
  try {
    // Chamada real à API do backend KycBetService.kycVerifyPep
    const response = await fetch(`${API_BASE_URL}/verify-pep`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cpf,
        fullName
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erro na verificação PEP:", error);
    toast({
      title: "Erro na verificação PEP",
      description: "Não foi possível verificar se o usuário é politicamente exposto. Por favor, tente novamente.",
      variant: "destructive"
    });
    return {
      approved: false,
      message: "Erro na verificação PEP",
      functions: []
    };
  }
};

/**
 * Função para processar documentos com o Regula
 * Integra com o regulaService do backend
 * @param payload Dados do documento e imagem
 * @returns Resultado do processamento do Regula
 */
export const processDocument = async (payload: KycRegisterPayload): Promise<any> => {
  try {
    // Chamada real à API do backend regulaService.process
    const response = await fetch(`${API_BASE_URL}/process-document`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erro no processamento do documento:", error);
    toast({
      title: "Erro no processamento",
      description: "Não foi possível processar o documento. Por favor, tente novamente.",
      variant: "destructive"
    });
    return null;
  }
};




/**
 * Função para verificar se usuario existe na base de dados
 * Integra com service de validação de cnh
 * @param payload cpf, data de nascimento e nome completo
 * @returns Resultado do processamento, se for booleano então esta apto para validação da pep
 */
export const validateAutomaticCNH = async(payload : UserData ) =>{
    try {
      const response = await fetch(`${API_BASE_URL}/validate-cnh`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload
        }),
      });

      
      if(!response.ok){
        toast({
          title: "Erro na API",
          description: `${response.status}`,
          variant: "destructive"
        });
      }

      return await response.json();
    } catch (error) {
      toast({
        title: "Erro no Processo de Validação",
        description: `${error}`,
        variant: "destructive"
      });
      return false;
    }
}





export const sendData = async(payload : UserData)=>{
  try {
    const response = await fetch(`${API_BASE_URL}/validate-facial`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payload
      }),
    });
  } catch (error) {
    
  }
}

/**
 * Realiza validação facial com o DataValid
 * Integra com o método validatePfFacial do DataValidService
 * @param cpf CPF do usuário
 * @param imageData Imagem em base64
 * @returns Resultado da validação facial
 */
export const validatePfFacial = async (cpf: string, imageData: string): Promise<{
  available: boolean;
  similarity: number;
  probability: string;
}> => {
  try {
    // Chamada real à API do DataValidService.validatePfFacial
    const response = await fetch(`${API_BASE_URL}/validate-facial`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cpf,
        imageData
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erro na validação facial com DataValid:", error);
    toast({
      title: "Erro na validação facial",
      description: "Não foi possível validar a imagem facial. Por favor, tente novamente.",
      variant: "destructive"
    });
    return {
      available: false,
      similarity: 0,
      probability: ""
    };
  }
};

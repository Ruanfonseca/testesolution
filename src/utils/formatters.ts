
export const formatCPF = (cpf: string): string => {
  const cleanedCPF = cpf.replace(/\D/g, '');
  
  if (cleanedCPF.length <= 3) {
    return cleanedCPF;
  }
  if (cleanedCPF.length <= 6) {
    return `${cleanedCPF.slice(0, 3)}.${cleanedCPF.slice(3)}`;
  }
  if (cleanedCPF.length <= 9) {
    return `${cleanedCPF.slice(0, 3)}.${cleanedCPF.slice(3, 6)}.${cleanedCPF.slice(6)}`;
  }
  
  return `${cleanedCPF.slice(0, 3)}.${cleanedCPF.slice(3, 6)}.${cleanedCPF.slice(6, 9)}-${cleanedCPF.slice(9, 11)}`;
};

export const formatDateString = (date: string): string => {
  // Convert from YYYY-MM-DD to DD/MM/YYYY
  if (!date) return '';
  
  // If the date is already in DD/MM/YYYY format
  if (date.includes('/')) {
    return date;
  }
  
  const parts = date.split('-');
  if (parts.length !== 3) return date;
  
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

export const parseURLParams = (): { name?: string, cpf?: string, birthDate?: string } => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  
  // Support multiple parameter naming conventions for compatibility
  return {
    name: params.nome || params.name || params.fullName || params.fullname || '',
    cpf: params.cpf || params.documento || params.document || '',
    birthDate: params.dataNascimento || params.birthDate || params.data || params.date || ''
  };
};

// Add event listener to receive messages from parent iframe
export const setupIframeMessageListener = (callback: (data: { name?: string, cpf?: string, birthDate?: string }) => void) => {
  window.addEventListener('message', (event) => {
    // For security, you may want to check event.origin here
    const { name, cpf, birthDate, dataNascimento, fullName } = event.data || {};
    
    if (name || cpf || birthDate || dataNascimento || fullName) {
      callback({
        name: fullName || name || '',
        cpf: cpf || '',
        birthDate: dataNascimento || birthDate || ''
      });
    }
  });
};


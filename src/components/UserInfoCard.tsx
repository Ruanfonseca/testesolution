
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserData } from "@/types/kyc";
import { formatCPF, formatDateString } from "@/utils/formatters";

interface UserInfoCardProps {
  userData: UserData;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ userData }) => {
  return (
    <Card className="mb-6">
      <CardHeader className="bg-primary/5 pb-3">
        <CardTitle className="text-lg text-primary">Informações do Usuário</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Nome completo</p>
            <p className="font-medium">{userData.fullName}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">CPF</p>
            <p className="font-medium">{formatCPF(userData.cpf)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Data de nascimento</p>
            <p className="font-medium">{formatDateString(userData.birthDate)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;

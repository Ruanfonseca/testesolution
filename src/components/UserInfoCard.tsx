
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { UserData } from "@/types/kyc";

interface UserInfoCardProps {
  userData: UserData;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ userData }) => {
  return (
    <Card className="mb-6">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-lg">Informações Pessoais</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-2">
          <div>
            <p className="font-medium">Nome completo:</p>
            <p className="text-muted-foreground">{userData.fullName}</p>
          </div>
          <div>
            <p className="font-medium">CPF:</p>
            <p className="text-muted-foreground">{userData.cpf}</p>
          </div>
          <div>
            <p className="font-medium">Data de nascimento:</p>
            <p className="text-muted-foreground">{userData.birthDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;

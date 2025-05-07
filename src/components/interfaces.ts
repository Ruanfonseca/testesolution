import { createTheme } from "@aws-amplify/ui-react";

export const faceLesstheme = createTheme({
  name: "custom-theme",
  tokens: {
    colors: {
      background: {
        primary: { value: "#ffffff" },   // fundo principal branco
        secondary: { value: "#f9fafb" }, // fundo secundário suave
      },
      font: {
        primary: { value: "#111827" },   // texto principal escuro
        secondary: { value: "#6b7280" }, // texto secundário acinzentado
        inverse: { value: "#ffffff" },   // texto em fundo escuro
      },
      border: {
        primary: { value: "#d1d5db" },   // bordas suaves
      },
      red: {
        60: { value: "#ef4444" }, // vermelho para avisos
      },
      green: {
        60: { value: "#10b981" }, // verde para sucesso
      },
      blue: {
        60: { value: "#3b82f6" }, // azul para elementos ativos
      },
    },
    radii: {
      small: { value: "6px" },
      medium: { value: "12px" },
      large: { value: "20px" },
    },
    components: {
      button: {
        primary: {
          backgroundColor: { value: "{colors.blue.60}" },
          color: { value: "{colors.font.inverse}" },
        },
        link: {
          color: { value: "{colors.blue.60}" },
        },
      },
    },
  },
});

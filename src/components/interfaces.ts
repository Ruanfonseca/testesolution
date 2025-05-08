import { createTheme } from "@aws-amplify/ui-react";

export const faceLesstheme = createTheme({
  name: "custom-theme",
  tokens: {

    colors: {
      background: {
        primary: { value: "#ffffff" },
        secondary: { value: "#f9fafb" },
      },
      font: {
        primary: { value: "#111827" },
        secondary: { value: "#6b7280" },
        inverse: { value: "#ffffff" },
      },
      border: {
        primary: { value: "#d1d5db" },
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
          backgroundColor: { value: "#111827" },
          color: { value: "#ffffff" },
        },
        link: {
          color: { value: "#111827" },
        },
      },
    },
  },
});


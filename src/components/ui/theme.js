import { createSystem, defaultConfig } from "@chakra-ui/react";

const chakraTheme = createSystem(defaultConfig, {
  // disableLayers: true,
  preflight: false,
  theme: {
    tokens: {
      colors: {
        primary: { value: "#DF9904" },
        secondary: { value: "#101828" },
      },
    },
  },
});

export default chakraTheme;

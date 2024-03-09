import { ThemeProviderContext } from "@/components/providers/theme-provider";
import { useContext } from "react";

export const useTheme = () => {
  return useContext(ThemeProviderContext);
};

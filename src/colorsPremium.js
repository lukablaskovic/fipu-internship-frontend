import { gradientBgBase } from "@/colors.js";

export const gradientBgYellowRed = `${gradientBgBase} from-yellow-400 via-red-500 to-purple-500`;
export const gradientBgRedYellow = `${gradientBgBase} from-red-400 via-yellow-500 to-blue-500`;

export const controlTextColor = (error, success) => {
  if (error) {
    return "text-red-600";
  }

  if (success) {
    return "text-emerald-600";
  }

  return null;
};

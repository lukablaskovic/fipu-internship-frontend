export const gradientBgBase = "md:bg-gradient-to-tr";
export const gradientBgBlue = `${gradientBgBase} md:from-blue-500 md:via-blue-300 md:to-fipu_blue`;
export const gradientBgDark = `${gradientBgBase} md:from-slate-700 md:via-slate-900 md:to-slate-800`;
export const gradientBgPinkRed = `${gradientBgBase} md:from-pink-400 md:via-red-500 md:to-yellow-500`;

export const colorsBgLight = {
  white: "bg-white text-black",
  light: "bg-white text-black dark:bg-slate-900/70 dark:text-white",
  contrast: "bg-gray-800 text-white dark:bg-white dark:text-black",
  success: "bg-emerald-500 border-emerald-500 text-white dark:text-emerald-950 font-medium dark:font-bold",
  danger: "bg-rose-600 border-rose-600 text-white dark:text-rose-950 font-medium dark:font-bold",
  warning: "bg-amber-500 border-amber-500 text-white dark:text-amber-950 font-medium dark:font-bold",
  info: "bg-fipu_blue border-fipu_blue text-white dark:text-slate-900 font-medium",
  fipu_blue: "bg-fipu_blue border-fipu_blue text-white dark:text-slate-900 font-medium",
};

export const colorsText = {
  white: "text-black dark:text-slate-100",
  light: "text-gray-700 dark:text-slate-400",
  contrast: "dark:text-white",
  success: "text-emerald-500",
  danger: "text-rose-600",
  warning: "text-amber-500",
  info: "text-fipu_blue",
  fipu_blue: "text-fipu_blue",
};

export const colorsOutline = {
  white: [colorsText.white, "border-gray-100"],
  light: [colorsText.light, "border-gray-100"],
  contrast: [colorsText.contrast, "border-gray-900 dark:border-slate-100"],
  success: [colorsText.success, "border-emerald-500"],
  danger: [colorsText.danger, "border-rose-600"],
  warning: [colorsText.warning, "border-amber-500"],
  info: [colorsText.fipu_blue, "border-fipu_blue"],
};

export const getButtonColor = (
  color,
  isOutlined,
  hasHover,
  isActive = false
) => {
  const colors = {
    ring: {
      white: "ring-gray-200 dark:ring-gray-500",
      whiteDark: "ring-gray-200 dark:ring-gray-500",
      lightDark: "ring-gray-200 dark:ring-gray-500",
      contrast: "ring-gray-300 dark:ring-gray-400",
      success: "ring-green-300 dark:ring-green-700",
      danger: "ring-red-300 dark:ring-red-700",
      warning: "ring-yellow-300 dark:ring-yellow-700",
      info: "ring-fipu_blue dark:ring-fipu_blue",
      fipu_blue: "ring-fipu_blue dark:ring-fipu_blue",
    },
    active: {
      white: "bg-gray-100",
      whiteDark: "bg-gray-100 dark:bg-slate-800",
      lightDark: "bg-gray-200 dark:bg-slate-700",
      contrast: "bg-gray-700 dark:bg-slate-100",
      success: "bg-green-700 dark:bg-green-600",
      danger: "bg-red-700 dark:bg-red-600",
      warning: "bg-yellow-700 dark:bg-yellow-600",
      info: "bg-fipu_blue dark:bg-fipu_light_blue",
      fipu_blue: "bg-fipu_blue dark:bg-fipu_light_blue",
      fipu_light_blue: "bg-fipu_light_blue dark:bg-fipu_blue",
      fipu_dark_blue: "bg-fipu_dark_blue dark:bg-fipu_light_blue",
      fipu_text_blue: "bg-fipu_text_blue text-white",
    },
    bg: {
      white: "bg-white text-black",
      whiteDark: "bg-white text-black dark:bg-slate-900 dark:text-white",
      lightDark: "bg-gray-100 text-black dark:bg-slate-800 dark:text-white",
      contrast: "bg-gray-800 text-white dark:bg-white dark:text-black",
      success: "bg-green-600 dark:bg-green-300 text-white",
      danger: "bg-red-600 dark:bg-red-500 text-white",
      warning: "bg-yellow-600 dark:bg-yellow-500 text-white",
      info: "bg-fipu_blue dark:fipu_light_blue text-white",
      fipu_blue: "bg-fipu_blue text-white text-white",
      fipu_light_blue: "bg-fipu_light_blue text-white",
      fipu_dark_blue: "bg-fipu_dark_blue text-white",
      fipu_text_blue: "bg-fipu_text_blue text-white",
    },
    bgHover: {
      white: "hover:bg-gray-100",
      whiteDark: "hover:bg-gray-100 hover:dark:bg-slate-800",
      lightDark: "hover:bg-gray-200 hover:dark:bg-slate-700",
      contrast: "hover:bg-gray-700 hover:dark:bg-slate-100",
      success:
        "hover:bg-green-700 hover:border-green-700 hover:dark:bg-green-600 hover:dark:border-green-600",
      danger:
        "hover:bg-red-700 hover:border-red-700 hover:dark:bg-red-600 hover:dark:border-red-600",
      warning:
        "hover:bg-yellow-700 hover:border-yellow-700 hover:dark:bg-yellow-600 hover:dark:border-yellow-600",
      info: "hover:bg-fipu_blue hover:border-fipu_blue hover:dark:bg-fipu_light_blue hover:dark:border-fipu_light_blue",
      fipu_blue: "hover:bg-fipu_light_blue hover:border-fipu_dark_blue",
    },
    borders: {
      white: "border-white",
      whiteDark: "border-white dark:border-slate-900",
      lightDark: "border-gray-100 dark:border-slate-800",
      contrast: "border-gray-800 dark:border-white",
      success: "border-green-600 dark:border-green-300",
      danger: "border-red-600 dark:border-red-500",
      warning: "border-yellow-600 dark:border-yellow-500",
      info: "border-blue-600 dark:border-blue-500",
      fipu_blue: "border-fipu_blue",
      fipu_light_blue: "border-fipu_light_blue",
      fipu_dark_blue: "border-fipu_dark_blue",
      fipu_text_blue: "border-fipu_text_blue",
    },
    text: {
      contrast: "dark:text-slate-100",
      success: "text-green-300 dark:text-green-400",
      danger: "text-red-600 dark:text-red-500",
      warning: "text-yellow-600 dark:text-yellow-500",
      info: "text-fipu_blue dark:fipu_light_blue",
      fipu_blue: "text-fipu_blue",
      fipu_dark_blue: "text-fipu_dark_blue",
      fipu_text_blue: "text-fipu_text_blue",
    },
    outlineHover: {
      contrast:
        "hover:bg-gray-800 hover:text-gray-100 hover:dark:bg-slate-100 hover:dark:text-black",
      success:
        "hover:bg-green-600 hover:text-white hover:text-white hover:dark:text-white hover:dark:border-green-600",
      danger:
        "hover:bg-red-600 hover:text-white hover:text-white hover:dark:text-white hover:dark:border-red-600",
      warning:
        "hover:bg-yellow-600 hover:text-white hover:text-white hover:dark:text-white hover:dark:border-yellow-600",
      info: "hover:bg-fipu_light_blue hover:text-white hover:dark:text-white hover:dark:border-fipu_light_blue",
      fipu_blue: "hover:bg-fipu_light_blue hover:text-white",
    },
  };

  if (!colors.bg[color]) {
    return color;
  }

  const isOutlinedProcessed =
    isOutlined && ["white", "whiteDark", "lightDark"].indexOf(color) < 0;

  const base = [colors.borders[color], colors.ring[color]];

  if (isActive) {
    base.push(colors.active[color]);
  } else {
    base.push(isOutlinedProcessed ? colors.text[color] : colors.bg[color]);
  }

  if (hasHover) {
    base.push(
      isOutlinedProcessed ? colors.outlineHover[color] : colors.bgHover[color]
    );
  }

  return base;
};

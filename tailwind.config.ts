import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
              "on-error-container": "#93000a",
              "on-surface-variant": "#45464d",
              "tertiary-fixed-dim": "#c4c7c9",
              "on-background": "#0b1c30",
              "secondary-fixed-dim": "#adc6ff",
              "outline-variant": "#c6c6cd",
              "primary": "#000000",
              "surface-container-low": "#eff4ff",
              "on-tertiary-container": "#818486",
              "inverse-primary": "#bec6e0",
              "secondary-fixed": "#d8e2ff",
              "primary-container": "#131b2e",
              "on-surface": "#0b1c30",
              "surface-container-highest": "#d3e4fe",
              "on-secondary-fixed-variant": "#004395",
              "surface": "#f8f9ff",
              "outline": "#76777d",
              "surface-variant": "#d3e4fe",
              "surface-bright": "#f8f9ff",
              "surface-container-high": "#dce9ff",
              "surface-tint": "#565e74",
              "on-primary": "#ffffff",
              "on-tertiary": "#ffffff",
              "secondary-container": "#2170e4",
              "surface-container": "#e5eeff",
              "primary-fixed": "#dae2fd",
              "surface-dim": "#cbdbf5",
              "primary-fixed-dim": "#bec6e0",
              "surface-container-lowest": "#ffffff",
              "tertiary-container": "#191c1e",
              "on-secondary-container": "#fefcff",
              "inverse-surface": "#213145",
              "on-error": "#ffffff",
              "tertiary-fixed": "#e0e3e5",
              "on-secondary-fixed": "#001a42",
              "tertiary": "#000000",
              "error": "#ba1a1a",
              "secondary": "#0058be",
              "on-tertiary-fixed-variant": "#444749",
              "on-tertiary-fixed": "#191c1e",
              "on-primary-fixed": "#131b2e",
              "on-primary-fixed-variant": "#3f465c",
              "error-container": "#ffdad6",
              "on-secondary": "#ffffff",
              "inverse-on-surface": "#eaf1ff",
              "background": "#f8f9ff",
              "on-primary-container": "#7c839b"
      },
      "borderRadius": {
              "DEFAULT": "0.125rem",
              "lg": "0.25rem",
              "xl": "0.5rem",
              "full": "0.75rem"
      },
      "spacing": {
              "margin-mobile": "16px",
              "container-max": "1280px",
              "base": "8px",
              "gutter": "24px",
              "xs": "4px",
              "xl": "80px",
              "2xl": "120px",
              "3xl": "160px",
              "sm": "12px",
              "lg": "48px",
              "md": "24px"
      },
      "fontFamily": {
              "display-lg": ["Hanken Grotesk"],
              "headline-md": ["Hanken Grotesk"],
              "body-md": ["Inter"],
              "body-sm": ["Inter"],
              "button": ["Inter"],
              "display-lg-mobile": ["Hanken Grotesk"],
              "label-md": ["Inter"],
              "body-lg": ["Inter"],
              "headline-sm": ["Hanken Grotesk"]
      },
      "fontSize": {
              "display-lg": ["44px", { "lineHeight": "52px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
              "headline-md": ["30px", { "lineHeight": "38px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
              "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
              "body-sm": ["15px", { "lineHeight": "22px", "fontWeight": "400" }],
              "button": ["15px", { "lineHeight": "22px", "fontWeight": "600" }],
              "display-lg-mobile": ["36px", { "lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
              "label-md": ["13px", { "lineHeight": "18px", "letterSpacing": "0.05em", "fontWeight": "600" }],
              "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
              "headline-sm": ["24px", { "lineHeight": "32px", "fontWeight": "600" }]
      }
    }
  },
  plugins: [],
};

export default config;

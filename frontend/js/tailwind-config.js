tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "background": "#f8f9ff",
                "on-secondary-container": "#005b78",
                "surface-bright": "#f8f9ff",
                "error-container": "#ffdad6",
                "surface-container": "#e5eeff",
                "secondary": "#006686",
                "on-primary-fixed": "#002109",
                "inverse-surface": "#213145",
                "tertiary": "#a43073",
                "inverse-primary": "#4ae176",
                "surface-container-highest": "#d3e4fe",
                "on-surface": "#0b1c30",
                "outline": "#6d7b6c",
                "on-secondary": "#ffffff",
                "surface-dim": "#cbdbf5",
                "on-primary": "#ffffff",
                "tertiary-fixed": "#ffd8e7",
                "on-tertiary-container": "#7c0953",
                "surface-variant": "#d3e4fe",
                "surface-container-lowest": "#ffffff",
                "primary": "#006e2f",
                "primary-container": "#22c55e",
                "error": "#ba1a1a",
                "secondary-fixed": "#c0e8ff",
                "on-surface-variant": "#3d4a3d",
                "on-primary-container": "#004b1e",
                "outline-variant": "#bccbb9",
                "on-tertiary": "#ffffff",
                "tertiary-container": "#ff82c2",
                "inverse-on-surface": "#eaf1ff",
                "secondary-fixed-dim": "#7bd1fa",
                "primary-fixed-dim": "#4ae176",
                "surface": "#f8f9ff",
                "primary-fixed": "#6bff8f",
                "secondary-container": "#7ed4fd",
                "surface-container-high": "#dce9ff",
                "surface-container-low": "#eff4ff"
            },
            borderRadius: {
                DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px"
            },
            spacing: {
                sm: "12px", base: "8px", container_max: "1440px", xs: "4px",
                xl: "64px", md: "24px", gutter: "24px", lg: "40px",
                "margin-mobile": "16px", "margin-desktop": "32px"
            },
            fontFamily: { sans: ["Plus Jakarta Sans"] },
            fontSize: {
                "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "700" }],
                "display-lg": ["48px", { lineHeight: "60px", fontWeight: "700" }],
                "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
                "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "700" }],
                "label-md": ["12px", { lineHeight: "16px", fontWeight: "600" }],
                "body-sm": ["14px", { lineHeight: "20px" }],
                "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
                "body-lg": ["18px", { lineHeight: "28px" }],
                "body-md": ["16px", { lineHeight: "24px" }]
            }
        }
    }
};

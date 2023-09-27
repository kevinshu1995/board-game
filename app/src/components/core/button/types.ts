import { themeTypes } from "@utils";

export type BaseButtonTheme = themeTypes.theme;
export type BaseButtonShape = "normal" | "rounded";

export interface BaseButtonProps {
    theme?: BaseButtonTheme;
    shape?: BaseButtonShape;
}


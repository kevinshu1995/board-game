import type { BaseButtonTheme, BaseButtonShape } from "@widget/button/types";

export type size =
    | "max-w-xs"
    | "max-w-sm"
    | "max-w-md"
    | "max-w-lg"
    | "max-w-xl"
    | "max-w-2xl"
    | "max-w-3xl"
    | "max-w-4xl";

export type isClickBackdropClose = boolean;
export type isShowCloseBtn = boolean;
export type placement = string;
export type isNeedToggleBtn = boolean;
export type closeBtnPlacement = "left" | "right";
export type closeBtnGap = string;
export type toggleBtnTheme = BaseButtonTheme;
export type toggleBtnShape = BaseButtonShape;
export type toggleBtnText = string;
export type onHide = () => void;
export type onShow = () => void;
export type onToggle = () => void;

export interface BaseModalTemplateProps {
    size?: size;
    isClickBackdropClose?: isClickBackdropClose;
    isShowCloseBtn?: isShowCloseBtn;
    placement?: placement;
    isNeedToggleBtn?: isNeedToggleBtn;
    closeBtnPlacement?: closeBtnPlacement;
    closeBtnGap?: closeBtnGap;
    toggleBtnTheme?: toggleBtnTheme;
    toggleBtnShape?: toggleBtnShape;
    toggleBtnText?: toggleBtnText;
    onHide?: onHide;
    onShow?: onShow;
    onToggle?: onToggle;
}


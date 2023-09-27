import type { BaseButtonTheme, BaseButtonShape } from "@core/button/types";

export type Size = "max-w-xs" | "max-w-sm" | "max-w-md" | "max-w-lg" | "max-w-xl" | "max-w-2xl" | "max-w-3xl" | "max-w-4xl";

export type IsClickBackdropClose = boolean;
export type IsShowCloseBtn = boolean;
export type Placement = string;
export type IsNeedToggleBtn = boolean;
export type CloseBtnPlacement = "left" | "right";
export type CloseBtnGap = string;
export type ToggleBtnTheme = BaseButtonTheme;
export type ToggleBtnShape = BaseButtonShape;
export type ToggleBtnText = string;
export type OnHide = () => void;
export type OnShow = () => void;
export type OnToggle = () => void;

export type ModalInstance = {
    toggle: () => void;
    show: () => void;
    hide: () => void;
    isHidden: () => void;
};

export interface BaseModalTemplateProps {
    size?: Size;
    isClickBackdropClose?: IsClickBackdropClose;
    isShowCloseBtn?: IsShowCloseBtn;
    placement?: Placement;
    isNeedToggleBtn?: IsNeedToggleBtn;
    closeBtnPlacement?: CloseBtnPlacement;
    closeBtnGap?: CloseBtnGap;
    toggleBtnTheme?: ToggleBtnTheme;
    toggleBtnShape?: ToggleBtnShape;
    toggleBtnText?: ToggleBtnText;
    onHide?: OnHide;
    onShow?: OnShow;
    onToggle?: OnToggle;
}


import type { BaseModalTemplateProps } from "./types";

export const BaseModalTemplateDefaultProps: BaseModalTemplateProps = {
    isClickBackdropClose: true,
    isShowCloseBtn: true,
    placement: "center-center",
    isNeedToggleBtn: false,
    closeBtnPlacement: "right",
    closeBtnGap: "4",
    toggleBtnTheme: "primary",
    toggleBtnShape: "normal",
    toggleBtnText: "Toggle modal",
    onHide: () => {},
    onShow: () => {},
    onToggle: () => {},
};

export const availableCloseBtnGapClass = ["m-4", "m-6", "m-8", "m-12", "m-16", "m-20"];

// validators
export function baseModalTemplatePropValidator(props: BaseModalTemplateProps) {
    // placement
    if (props.placement) {
        const placementRegex = /^(top|center|right)-(top|center|right)$/;
        const placementTest = placementRegex.test(props.placement);
        if (placementTest === false) {
            console.warn("[BaseModalTemplate] prop.placement does not pass the validation.");
        }
    }
    // closeBtnGap
    if (props.closeBtnGap) {
        const closeBtnGapTest = availableCloseBtnGapClass
            .map(item => item.slice(2))
            .includes(props.closeBtnGap);
        if (closeBtnGapTest === false) {
            console.warn("[BaseModalTemplate] prop.closeBtnGap does not pass the validation.");
        }
    }
}


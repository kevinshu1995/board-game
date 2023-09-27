export interface CollapseOptions {
    triggerEl?: HTMLElement;
    onCollapse?: () => void;
    onExpand?: () => void;
    onToggle?: () => void;
}

export type CollapseMethods = {
    collapse: () => void;
    expand: () => void;
    toggle: () => void;
};


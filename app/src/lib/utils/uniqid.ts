import uniqid from "uniqid";

export const generateUuid = (...args: any) => {
    return uniqid(...args);
};


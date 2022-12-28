// types
interface StatusClasses {
    normal: string;
    success: string;
    error: string;
}

interface StatusBaseClasses {
    [key: string]: StatusClasses;
}

interface FormatStatusClasses extends StatusClasses {
    allClasses: StatusBaseClasses;
}

// utils
const assembleClasses = (classObj: StatusBaseClasses, key: keyof StatusClasses): string => {
    return Object.keys(classObj)
        .map(objKey => classObj[objKey][key])
        .join(" ");
};

const generateFormatClasses = (classObj: StatusBaseClasses): FormatStatusClasses => {
    return {
        allClasses: classObj,
        normal: assembleClasses(classObj, "normal"),
        success: assembleClasses(classObj, "success"),
        error: assembleClasses(classObj, "error"),
    };
};

// classes
const input: StatusBaseClasses = {
    bg: {
        normal: "bg-gray-50 dark:bg-gray-700",
        success: "bg-green-50 dark:bg-gray-700",
        error: "bg-red-50 dark:bg-gray-700",
    },
    border: {
        normal: "border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-500",
        success: "border-green-500 focus:border-green-500 dark:border-green-500",
        error: "border-red-500 focus:border-red-500 dark:border-red-500",
    },
    text: {
        normal: "text-gray-900  dark:text-white",
        success: "text-green-900 dark:text-green-400",
        error: "text-red-900 dark:text-red-500",
    },
    ring: {
        normal: "focus:ring-blue-500 dark:focus:ring-blue-500",
        success: "focus:ring-green-500",
        error: "focus:ring-red-500",
    },
    placeholder: {
        normal: "dark:placeholder-gray-400",
        success: "placeholder-green-700 dark:placeholder-green-500",
        error: "placeholder-red-700 dark:placeholder-red-500",
    },
};

const feedbackText: StatusBaseClasses = {
    text: {
        normal: "text-gray-500 dark:text-gray-400",
        success: "text-green-600 dark:text-green-500",
        error: "text-red-600 dark:text-red-500",
    },
};

const label: StatusBaseClasses = {
    base: {
        normal: "block text-sm font-medium cursor-pointer",
        success: "block text-sm font-medium cursor-pointer",
        error: "block text-sm font-medium cursor-pointer",
    },
    text: {
        normal: "text-gray-900 dark:text-white",
        success: "text-green-700 dark:text-green-500",
        error: "text-red-700 dark:text-red-500",
    },
};

const formatInput: FormatStatusClasses = generateFormatClasses(input);
const formatFeedbackText: FormatStatusClasses = generateFormatClasses(feedbackText);
const formatLabel: FormatStatusClasses = generateFormatClasses(label);

export { formatInput as input, formatFeedbackText as feedbackText, formatLabel as label };


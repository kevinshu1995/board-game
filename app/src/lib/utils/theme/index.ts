import * as themeTypes from "./types";

const getTheme = (targetTheme: themeTypes.theme): string => {
    switch (targetTheme) {
        case "secondary":
            return " text-white bg-green-700 hover:bg-green-800  focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800";
        case "primary":
            return "text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800";
        case "light-n-border":
            return "text-gray-900 bg-white hover:bg-gray-100 focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700";
        case "transparent":
            return "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700";
        case "success":
            return "text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800";
        case "error":
            return "text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900";
        case "warn":
            return "text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-300 dark:focus:ring-yellow-900";
        case "light":
        default:
            return "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700";
    }
};

export { themeTypes, getTheme };


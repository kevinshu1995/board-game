export const convertEnum = (enumTarget: any): { value: any; key: string }[] => {
    return Object.keys(enumTarget)
        .filter(v => isNaN(Number(v)))
        .map(key => {
            return {
                value: enumTarget[key as keyof typeof enumTarget],
                key: key,
            };
        });
};


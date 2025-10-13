export const formatUnknownToValidStringArray = (
    arr: string[] | string,
): string[] => {
    const result: string[] = [];
    if (typeof arr === 'string') {
        const convertStringToArray = arr.split(',');
        return formatUnknownToValidStringArray(convertStringToArray);
    } else {
        for (let i = 0; i < arr.length; i++) {
            result.push(arr[i]);
        }
    }
    return result;
};

export const formatStringArrayToObjectWithTrueValue = (
    arr: string[],
): Record<string, any> => {
    const result: Record<string, boolean> = {};
    for (let i = 0; i < arr.length; i++) {
        result[arr[i]] = true;
    }
    return result;
};

export const objectHasKey = (obj: Record<string, unknown>, key: string) => {
    return key in obj;
};

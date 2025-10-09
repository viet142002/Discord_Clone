export const formatUnknownToValidStringArray = (arr: unknown[]) => {
    const result: string[] = [];
    for (let i = 0; i < arr.length; i++) {
        if (
            (typeof arr[i] === 'string' || typeof arr[i] === 'number') &&
            arr[i]
        ) {
            result.push(String(arr[i]));
        }
    }
    return result;
};

export const formatStringArrayToObjectWithTrueValue = (arr: string[]) => {
    const result: Record<string, boolean> = {};
    for (let i = 0; i < arr.length; i++) {
        result[arr[i]] = true;
    }
    return result;
};

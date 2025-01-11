export const getFullName = (
    firstName: string | null,
    lastName: string | null
): string => {
    return `${ firstName ?? '' } ${ lastName ?? '' }`.trim();
};

export const targetForReduction = (
    yearRange: number | null,
    target: number
) => {
    if (!yearRange || yearRange < 1) {
        return 0
    }
    return yearRange * target;
}
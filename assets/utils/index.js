export const getTwoDecimal = value => {
    if (typeof value !== 'number') {
        return value
    } else {
        return value.toFixed(2)
    }
}
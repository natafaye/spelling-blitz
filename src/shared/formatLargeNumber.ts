export const formatLargeNumber = (number: number) => {
    if(number < 1000) return number.toString()
    return (number / 1000).toFixed(1) + "k"
}

export function range(low:number, high:number):ReadonlyArray<number> {
    const size = (high - low + 1)
    return Array.from(Array(size).keys()).map(i => i + low);
}
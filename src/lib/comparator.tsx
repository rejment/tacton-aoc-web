
export function comparingInt<T>(extractor : (a: T) => number) : (a:T, b:T) => number {
    return (a, b) => extractor(a) - extractor(b);
}
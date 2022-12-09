
export function releaseSecond(year: number, day: number) : number {
    return Date.UTC(year, 11, day, 5, 0) / 1000;
}

export function formatSeconds(seconds: number) : string {

    const days = Math.floor(seconds / (60 * 60 * 24));
    seconds -= days * 60 * 60 * 24;

    const hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * 60 * 60;

    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    const result = [];
    if (days > 0) {
        result.push(`${days} days`);
    } 
    if (hours > 0) {
        result.push(`${hours} h`);
    } 
    if (minutes > 0) {
        result.push(`${minutes} min`);
    } 
    if (seconds > 0) {
        result.push(`${seconds} sec`);
    } 
    return result.join(" ");
}
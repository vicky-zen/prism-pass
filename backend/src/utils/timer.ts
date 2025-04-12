
export class Timer {
    private startTime: [number, number];
    public start() {
        this.startTime = process.hrtime();
    }

    public stop() {
        const elapsedSeconds = this.parseHrtimeToSeconds(
            process.hrtime(this.startTime)
        );
        return Number(elapsedSeconds);
    }

    private parseHrtimeToSeconds(hrtime: [number, number]) {
        const seconds = (hrtime[0] + (hrtime[1] / 1e6)).toFixed(2);
        return seconds;
    }
}
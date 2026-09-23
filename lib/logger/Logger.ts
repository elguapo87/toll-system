export class Logger {
    public static log(message: string): void {
        const timestamp = new Date();

        console.log(`[${timestamp.toLocaleString()}] ${message}`);
    };
}
export class TollWorker {
    private collectedAmount = 0;

    constructor(
        public firstName: string,
        public lastName: string
    ) {}

    public addCollection(amount: number): void {
        this.collectedAmount += amount;
    }

    public getCollectedAmount(): number {
        return this.collectedAmount;
    }
}
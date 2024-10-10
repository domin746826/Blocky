export class PRNG {
    constructor(seed) {
        this.seed = seed;
    }

    random() {
        let x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }
}
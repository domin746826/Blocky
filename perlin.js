import { PRNG } from './prng.js'

export class PerlinNoise2D {
    constructor(seed = Math.random()) {
        this.p = [];
        this.seed = seed;
        this.prng = new PRNG(this.seed);
        this.init();
    }

    init() {
        const permutation = [];
        for (let i = 0; i < 256; i++) {
            permutation[i] = i;
        }

        for (let i = 255; i > 0; i--) {
            const j = Math.floor(this.prng.random() * (i + 1));
            [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
        }

        this.p = permutation.concat(permutation);
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
        return a + t * (b - a);
    }

    grad(hash, x, y) {
        const h = hash & 7;
        const u = h < 4 ? x : y;
        const v = h < 4 ? y : x;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    noise = (x, y) => {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);

        const u = this.fade(x);
        const v = this.fade(y);

        const aa = this.p[this.p[X] + Y];
        const ab = this.p[this.p[X] + Y + 1];
        const ba = this.p[this.p[X + 1] + Y];
        const bb = this.p[this.p[X + 1] + Y + 1];

        const lerp1 = this.lerp(u, this.grad(aa, x, y), this.grad(ba, x - 1, y));
        const lerp2 = this.lerp(u, this.grad(ab, x, y - 1), this.grad(bb, x - 1, y - 1));

        return this.lerp(v, lerp1, lerp2);
    }
}


declare module 'bn.js' {
  export default class BN {
    constructor(
      number: number | string | number[] | Buffer | BN,
      base?: number | 'hex',
      endian?: 'le' | 'be'
    );

    toString(base?: number | 'hex', length?: number): string;
    toNumber(): number;
    toJSON(): string;
    toBuffer(endian?: 'be' | 'le', length?: number): Buffer;
    toArrayLike(ArrayType: any, endian?: 'be' | 'le', length?: number): any;

    add(b: BN): BN;
    sub(b: BN): BN;
    mul(b: BN): BN;
    div(b: BN): BN;
    mod(b: BN): BN;
    pow(b: BN): BN;

    gt(b: BN): boolean;
    gte(b: BN): boolean;
    lt(b: BN): boolean;
    lte(b: BN): boolean;
    eq(b: BN): boolean;

    isZero(): boolean;
    isNeg(): boolean;

    static isBN(b: any): b is BN;
  }
}

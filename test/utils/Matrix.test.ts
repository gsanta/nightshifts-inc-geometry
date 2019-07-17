import { Matrix } from '../../src/utils/Matrix';
import { expect } from 'chai';


describe(`Matrix`, () => {
    describe(`multiply`, () => {
        it ('multiplies A and B', () => {
            const A = [[1, 2, 3], [4, 5, 6]];
            const B = [[7, 8], [9, 10], [11, 12]];

            const matrix = new Matrix();

            expect(matrix.multiply(A, B)).to.eql([[58, 64], [139, 154]]);
        });
    });

    describe(`add`, () => {
        it ('adds A to B', () => {
            const A = [[1, 2], [3, 4], [5, 6]];
            const B = [[7, 8], [9, 10], [11, 12]];

            const matrix = new Matrix();

            expect(matrix.add(A, B)).to.eql([[8, 10], [12, 14], [16, 18]]);
        });
    });

    describe(`subtract`, () => {
        it ('subtract A from B', () => {
            const A = [[1, 2], [3, 4], [5, 6]];
            const B = [[7, 8], [9, 10], [11, 12]];

            const matrix = new Matrix();

            expect(matrix.subtract(A, B)).to.eql([[-6, -6], [-6, -6], [-6, -6]]);
        });
    });
});
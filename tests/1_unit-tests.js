const chai = require('chai');
const assert = chai.assert;

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings');
const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('UnitTests', () => {
    test('Logic handles a valid puzzle string of 81 characters', function(done) {
        solver = new Solver();
        puzzlesAndSolutions.forEach(puzzle => {
            assert.isTrue(solver.validate(puzzle[0]));
        })
        done();
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function(done) {
        solver = new Solver();
        let puzzle = [...puzzlesAndSolutions[0][0]];
        puzzle[5] = 'A';
        puzzle = puzzle.join();
        assert.isFalse(solver.validate(puzzle));
        done();
    });

    test('Logic handles a puzzle string that is not 81 characters in length', function(done) {
        solver = new Solver();
        let puzzle = [...puzzlesAndSolutions[0][0]];
        puzzle.push('3')
        puzzle = puzzle.join();
        assert.isFalse(solver.validate(puzzle));
        done();
    });

    test('Logic handles a valid row placement', function(done) {
        solver = new Solver();
        let puzzle = puzzlesAndSolutions[0][0];
        assert.isTrue(solver.checkRowPlacement(puzzle, 0, 3, 3));
        done();
    });

    test('Logic handles an invalid row placement', function(done) {
        solver = new Solver();
        let puzzle = puzzlesAndSolutions[0][0];
        assert.isFalse(solver.checkRowPlacement(puzzle, 0, 3, '2'));
        done();
    });

    test('Logic handles a valid column placement', function(done) {
        solver = new Solver();
        let puzzle = puzzlesAndSolutions[0][0];
        assert.isTrue(solver.checkColPlacement(puzzle, 0, 1, '3'));
        done();
    });

    test('Logic handles an invalid column placement', function(done) {
        solver = new Solver();
        let puzzle = puzzlesAndSolutions[0][0];
        assert.isFalse(solver.checkColPlacement(puzzle, 1, 0, '1'));
        done();
    });

    test('Logic handles a valid region (3x3 grid) placement', function(done) {
        solver = new Solver();
        let puzzle = puzzlesAndSolutions[0][0];
        assert.isTrue(solver.checkRegionPlacement(puzzle, 0, 1, '3'));
        done();
    });

    test('Logic handles an invalid region (3x3 grid) placement', function(done) {
        solver = new Solver();
        let puzzle = puzzlesAndSolutions[0][0];
        assert.isFalse(solver.checkRegionPlacement(puzzle, 0, 1, '1'));
        done();
    });

    test('Valid puzzle strings pass the solver', function(done) {
        solver = new Solver();
        let puzzle = puzzlesAndSolutions[0][0];
        assert.isTrue(solver.validate(puzzle));
        done();
    });
    
    test('Invalid puzzle strings fail the solver', function(done) {
        solver = new Solver();
        let puzzle = [...puzzlesAndSolutions[0][0]];
        puzzle[0] = '2';
        puzzle = puzzle.join();
        assert.isFalse(solver.validate(puzzle));
        done();
    });

    test('Solver returns the the expected solution for an incomplete puzzzle', function(done) {
        solver = new Solver();
        puzzlesAndSolutions.forEach(item => {
            const [ puzzle, solution ] = item;
            assert.equal(solver.solve(puzzle), solution);
        })
        done();
    });


});

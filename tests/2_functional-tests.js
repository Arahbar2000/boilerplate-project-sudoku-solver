const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('Solve tests', function() {
        test('Solve a puzzle with valid puzzle string', function(done) {
            const [ validPuzzle, validSolution ] = puzzlesAndSolutions[0];
            chai.request(server)
                .post('/api/solve')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ puzzle: validPuzzle })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'solution');
                    assert.equal(res.body.solution, validSolution);
                    done();
                })
        });

        test('Solve a puzzle with missing puzzle string', function(done) {
            chai.request(server)
                .post('/api/solve')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Required field missing');
                    done();
                });
        });

        test('Solve a puzzle with invalid characters', function(done) {
            let invalidPuzzle = [...puzzlesAndSolutions[0][0]];
            invalidPuzzle[5] = 'B';
            chai.request(server)
                .post('/api/solve')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ puzzle: invalidPuzzle.join('') })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        test('Solve a puzzle with incorrect length', function(done) {
            const invalidPuzzle = [...puzzlesAndSolutions[0][0]];
            invalidPuzzle.push('1');
            chai.request(server)
                .post('/api/solve')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ puzzle: invalidPuzzle.join('') })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });

        test('Solve a puzzle that cannot be solved', function(done) {
            const invalidPuzzle = [...puzzlesAndSolutions[0][0]];
            invalidPuzzle[0] = '2';
            chai.request(server)
                .post('/api/solve')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ puzzle: invalidPuzzle.join('') })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Puzzle cannot be solved');
                    done();
                });
        });
    });

    suite('Check tests', function() {
        test('Check a puzzle placement with all fields', function(done) {
            const [ validPuzzle, validSolution ] = puzzlesAndSolutions[0];
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ puzzle: validPuzzle, coordinate: 'A2', value: 3 })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.isTrue(res.body.valid);
                    done();
                })
        });

        test('Check a puzzle placement with single placement conflict', function(done) {
            const [ validPuzzle, validSolution ] = puzzlesAndSolutions[0];
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ puzzle: validPuzzle, coordinate: 'A2', value: 8 })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.property(res.body, 'conflict');
                    assert.isFalse(res.body.valid);
                    assert.deepEqual(res.body.conflict, ['row']);
                    done();
                });
        });

        test('Check a puzzle placement with multiple placement conflicts', function(done) {
            const [ validPuzzle, validSolution ] = puzzlesAndSolutions[0];
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ puzzle: validPuzzle, coordinate: 'F7', value: 2 })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.property(res.body, 'conflict');
                    assert.isFalse(res.body.valid);
                    assert.deepEqual(res.body.conflict, ['row', 'column']);
                    done();
                });
        });

        test('Check a puzzle placement with all placement conflicts', function(done) {
            const [ validPuzzle, validSolution ] = puzzlesAndSolutions[0];
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ puzzle: validPuzzle, coordinate: 'A2', value: 2 })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.property(res.body, 'conflict');
                    assert.isFalse(res.body.valid);
                    assert.deepEqual(res.body.conflict, ['row', 'column', 'region']);
                    done();
                });
        });

        test('Check a puzzle placement with missing required fields', function(done) {
            const [ validPuzzle, validSolution ] = puzzlesAndSolutions[0];
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ puzzle: validPuzzle, coordinate: 'A2' })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Required field(s) missing');
                    done();
                });
        });

        test('Check a puzzle placement with invalid characters', function(done) {
            let invalidPuzzle = [...puzzlesAndSolutions[0][0]];
            invalidPuzzle[5] = 'B';
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ puzzle: invalidPuzzle.join(''), coordinate: 'A2', value: 2 })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        test('Check a puzzle placement with incorrect length', function(done) {
            const invalidPuzzle = [...puzzlesAndSolutions[0][0]];
            invalidPuzzle.push('1');
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ puzzle: invalidPuzzle.join(''), coordinate: 'A2', value: 2 })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });

        test('Check a puzzle placement with invalid placement coordinate', function(done) {
            const [ validPuzzle, validSolution ] = puzzlesAndSolutions[0];
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ puzzle: validPuzzle, coordinate: 'J2', value: 3 })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid coordinate');
                    done();
                })
        });

        test('Check a puzzle placement with invalid placement value', function(done) {
            const [ validPuzzle, validSolution ] = puzzlesAndSolutions[0];
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ puzzle: validPuzzle, coordinate: 'A2', value: 10 })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid value');
                    done();
                })
        });
    })
});


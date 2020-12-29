'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

const REF = {
  'A': 0,
  'B': 1,
  'C': 2,
  'D': 3,
  'E': 4,
  'F': 5,
  'G': 6,
  'H': 7,
  'I': 8,
}

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) return res.json({ error: 'Required field(s) missing' });
      if (puzzle.length != 81) return res.json({ error: 'Expected puzzle to be 81 characters long' });
      const row = REF[coordinate[0]];
      const col = parseInt(coordinate[1]) - 1;
      if ((!row && row !== 0) || (col < 0 || col > 8)) return res.json({ error: 'Invalid coordinate' });
      if (value < 1 || value > 9) return res.json({ error: 'Invalid value' });
      for(let i = 0; i < puzzle.length; i++) {
        const value = puzzle[i];
        if (value != '.') {
          if (isNaN(parseInt(value)) || value == '0') return res.json({ error: 'Invalid characters in puzzle' });
        }
      }
      const invalids = [];
      if (!solver.checkRowPlacement(puzzle, row, col, value)) invalids.push('row');
      if (!solver.checkColPlacement(puzzle, row, col, value)) invalids.push('column');
      if (!solver.checkRegionPlacement(puzzle, row, col, value)) invalids.push('region');
      return res.json({
        valid: invalids == false ? true: false,
        conflict: invalids == false ? undefined : invalids
      });
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) return res.json({ error: 'Required field missing' });
      if (puzzle.length != 81) return res.json({ error: 'Expected puzzle to be 81 characters long' });
      for(let i = 0; i < puzzle.length; i++) {
        const value = puzzle[i];
        if (value != '.') {
          if (isNaN(parseInt(value)) || value == '0') return res.json({ error: 'Invalid characters in puzzle' });
        }
      }
      if (!solver.validate(puzzle)) return res.json({ error: 'Puzzle cannot be solved'});
      const solution = solver.solve(puzzle);
      return res.json({ solution });
    });
};

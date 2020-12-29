function checkIfComplete(puzzleString) {
  for (let i = 0; i < puzzleString.length; i++) {
    if (puzzleString[i] === '.') return false;
  }
  return true;
}

function indexToCoord(index) {
  const row = Math.floor(index / 9);
  const col = index % 9;
  return [row, col];
}

function indexToRow(index) {
  return Math.floor(index / 9);
}

function coordToIndex(coord) {
  return coord[0] * 9 + coord[1];
}

class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length != 81) return false;
    let row = 0;
    while (row < 9) {
      let col = 0;
      while (col < 9) {
        const value = puzzleString[coordToIndex([row, col])];
        if (value != '.') {
          if (isNaN(parseInt(value)) || value == '0') return false;
        }
        if (!this.checkRowPlacement(puzzleString, row, col, value))
          return false;
        if (!this.checkColPlacement(puzzleString, row, col, value))
          return false;
        if (!this.checkRegionPlacement(puzzleString, row, col, value))
          return false;
        col++;
      }
      row++;
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const index = coordToIndex([row, column]);
    // if (puzzleString[index] != '.') return false;
    let curr = row * 9;
    while (indexToRow(curr) === row) {
      if (parseInt(puzzleString[curr]) === parseInt(value) && curr != index) {
        return false;
      }
      curr++;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const index = coordToIndex([row, column]);
    // if (puzzleString[index] != '.') return false;
    let curr = column;
    while (curr < 81) {
      if (parseInt(puzzleString[curr]) === parseInt(value) && curr != index) {
        return false;
      }
      curr += 9;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const index = coordToIndex([row, column]);
    // if (puzzleString[index] != '.') return false;
    const startRow = Math.floor(row/3) * 3;
    const startCol = Math.floor(column/3) * 3;
    let currRow = startRow;
    while (currRow < startRow + 3) {
      let currCol = startCol;
      while (currCol < startCol + 3) {
        let curr = coordToIndex([currRow, currCol]);
        if (curr != index && parseInt(puzzleString[curr]) === parseInt(value)) {
          return false;
        }
        currCol++;
      }
      currRow++;
    }
    return true;
  }

  solve(puzzleString) {
    let puzzleArray = [...puzzleString]
    this.solveHelper(puzzleArray, 0);
    return puzzleArray.join('');
  }

  solveHelper(puzzleString, index) {
    if (checkIfComplete(puzzleString)) {
      return true;
    }
    if (puzzleString[index] != '.') return this.solveHelper(puzzleString, index+1);
    const [row, col] = indexToCoord(index);
    for (let i = 1; i < 10; i++) {
      if (this.checkRowPlacement(puzzleString, row, col, i) && 
      this.checkColPlacement(puzzleString, row, col, i) &&
      this.checkRegionPlacement(puzzleString, row, col, i)) {
        puzzleString[index] = i;
        if (this.solveHelper(puzzleString, index+1)) return true;
        puzzleString[index] = '.';
      }
    }
    return false;
  }
}

module.exports = SudokuSolver;


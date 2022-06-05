
const board = (() => {

    const grid = document.querySelectorAll('#board>div');
    const blockArr = Array.from(grid);


    function getIndex(target) {
        return blockArr.indexOf(target);
    }

    function input(index, char) {
        blockArr[index].textContent = char;
    }

    function initBoard(fn) {
        grid.forEach(node => node.addEventListener('click', e =>
            fn(getIndex(e.target))));
    }

    const clearBoard = function () {
        grid.forEach((node) => node.textContent = '');
    }
    return { initBoard, clearBoard, input };
})();


function Player(name, symbol) {
    return { name, symbol };
}

const game = (() => {
    const inputArr = ['', '', '', '', '', '', '', '', ''];
    const chars = ['x', 'o'];
    const players = [Player('kunal', '+'), Player('Ayush', '-')];
    let turn = 0;
    let curPlayer = players[turn];
    let gameOver = false;

    const resultCheck = (() => {

        let boardState = [];
        function h_check(index) {
            let row = Math.trunc(index / 3);
            let i = row * 3 + ((index + 1) % 3);
            while (i != index) {
                if (boardState[index] != boardState[i])
                    break;
                i = row * 3 + ((i + 1) % 3);
            }
            return i == index;
        }

        function v_check(index) {
            let i = (index + 3) % 9;
            while (i != index) {
                if (boardState[index] != boardState[i])
                    break;
                i = (i + 3) % 9;
            }
            return i == index;
        }
        function d_check(index) {
            function d1_check() {
                let i = (index + 4) % 12;
                while (i != index) {
                    if (boardState[i] != boardState[index])
                        break;
                    i = (i + 4) % 12;
                }
                return i == index;
            }
            function d2_check() {
                let i = (index % 6) + 2;
                while (i != index) {
                    if (boardState[i] != boardState[index])
                        break;
                    i = (i % 6) + 2;
                }
                return i == index;
            }
            if (index == 4)
                return d1_check() || d2_check();
            else if (index % 4 == 0)
                return d1_check();
            else
                return d2_check();

        }
        function run(index, arr) {
            boardState = arr;
            if (h_check(index) || v_check(index) || d_check(index))
                return 1;
            return boardState.every(value => value) ? 0 : -1;   //draw : not finished yet

        }
        return { run };
    })();
    function endCheck(index) {
        const value = resultCheck.run(index, inputArr);
        if (value == 1) {
            console.log(`winner is ${curPlayer.symbol}`);
            return true;
        }
        if (value == 0) {
            console.log('draw');
            return true;
        }
        return false;
    }

    function playerInput(index) {
        inputArr[index] = chars[turn];
        board.input(index, curPlayer.symbol);
        gameOver = endCheck(index);
        turn = (turn + 1) % 2;
        curPlayer = players[turn];
    }
    function processClick(index) {
        if (!gameOver) {
            if (!inputArr[index]) {
                playerInput(index);

                if (gameOver)
                    return;
                playerInput(choice(turn));
            }
        }
    }

    function minmax(depth, childIndex, maximizingPlayer, arr) {
        const tempBoard = [...arr];
        tempBoard[childIndex] = maximizingPlayer ? 'x' : 'o';
        const result = resultCheck.run(childIndex, tempBoard);
        if (result == 1)
            return maximizingPlayer ? 10-depth : depth-10;

        if (result == 0)
            return 0;

        if (maximizingPlayer) {
            let value = Number.POSITIVE_INFINITY;
            for (let i = 0; i < 9; i++) {
                if (!tempBoard[i]) {
                    value = Math.min(value, minmax(depth + 1, i, false, tempBoard));
                }
            }
            return value;
        }
        else {
            let value = Number.NEGATIVE_INFINITY;
            for (let i = 0; i < 9; i++) {
                if (!tempBoard[i]) {
                    value = Math.max(value, minmax(depth + 1, i, true, tempBoard));
                }
            }
            return value;
        }
    }

    function choice(turn) {
        const boardState = turn ? inputArr.map(value => value ? (value == 'o' ? 'x' : 'o') : '') : inputArr;
        let optimalIndex = 0;
        let value = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < 9; i++) {
            if (!boardState[i]) {
                const temp = minmax(0, i, true, boardState);
                if (value < temp) {
                    value = temp;
                    optimalIndex = i;
                }
            }
        }
        return optimalIndex;
    }
    function start() {
        board.initBoard(processClick);
    }
    return { start };

})();

game.start();



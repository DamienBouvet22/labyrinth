async function loadJson() {

    const data = await fetch('labyrinthes.json')
        .then(response => response.json());

    let gridSize = 25;
    let mazeName = 'ex-2';
    // console.log(data)
    return {
        gridSize: gridSize,
        cellData: data[gridSize][mazeName]
    };
}

function createMaze(mazeBoard) {

    // We destructure the object
    const {cellData, gridSize} = mazeBoard;

    // We create the grid layout
    const mainDiv = document.getElementById('mainDiv');
    mainDiv.style.gridTemplateColumns = 'repeat(' + gridSize + ', 100px)';
    mainDiv.style.gridTemplateRows = 'repeat(' + gridSize + ', 100px)';

    // We loop through to create cells and walls
    for (let i = 0; i < cellData.length; i++) {
        let cell = document.createElement('div');
        let currentCell = cellData[i];
        // We add the cellNumber and adjacent cells property to the cellData Object
        currentCell.cellNumber = i;
        currentCell.adjacentCells = [];
        // We add the cellNumber in the display
        cell.innerHTML += '<div>' +(currentCell.cellNumber)+ '</div>';
        // We set the first cell in orange
        if (i === 0) {
            cell.style.backgroundColor = 'orange'
        }

        // We get the last iteration to set the cell in green
        if (i === cellData.length - 1) {
            cell.style.backgroundColor = "green"
        }
        // We apply the class for the color
        cell.className = 'cell-color cell-' + i;
        // We apply the border for the walls and add adjacent cells property
        let walls = cellData[i]["walls"];
        if (walls[0]) {
            cell.style.borderTop = '1px solid';
        } else {
            currentCell.adjacentCells.push(currentCell.cellNumber-gridSize);
        }
        if (walls[3]) {
            cell.style.borderLeft = '1px solid';
        } else {
            currentCell.adjacentCells.push(currentCell.cellNumber-1);
        }
        if (walls[1]) {
            cell.style.borderRight = '1px solid';
        } else {
            currentCell.adjacentCells.push(currentCell.cellNumber+1);
        }
        if (walls[2]) {
            cell.style.borderBottom = '1px solid';
        } else {
            currentCell.adjacentCells.push(currentCell.cellNumber+gridSize);
        }
        mainDiv.appendChild(cell)
        // console.log('Cell ' + currentCell.cellNumber + ' : ', currentCell)
    }
    dfs(cellData[0], cellData[cellData.length-1], cellData)
}

function dfs(startPos, targetPos, grid) {
    const visited = [];
    const stack = [];
    const root = startPos;
    const target = targetPos;
    target.isTarget = true;

    stack.push(root);

    while(stack.length) {
        // debugger

        const current = stack.pop();
        let test = document.getElementsByClassName('cell-'+current.cellNumber);

        if (current === target) {
            visited.push(current);
            break;
        }

        if (visited.indexOf(current) !== -1) {
            continue;
        }
        if(current.cellNumber !== 0){
            test[0].style.background='mediumpurple'
        }
        visited.push(current);

        for (let node of current.adjacentCells) {
            stack.push(grid[node]);
        }
    }
    console.log(visited, 'Congrats')
}


async function main() {
    // Async main function to call our maze generator functions
    createMaze(await loadJson());
}

main();

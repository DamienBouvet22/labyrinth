async function loadJson() {

    const data = await fetch('labyrinthes.json')
        .then(response => response.json());

    let gridSize = 15;
    let mazeName = 'ex-0';
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
    document.getElementById('dfsIterative').addEventListener('click', function() {
        dfsIterative(cellData[0], cellData);
    }, false);
    document.getElementById('dfsRecursive').addEventListener('click', function() {
        dfsRecursive(cellData[0], cellData);
    }, false);
    document.getElementById('bfsIterative').addEventListener('click', function() {
        bfsIterative(cellData[0], cellData);
    }, false);
    document.getElementById('bfsRecursive').addEventListener('click', function() {
        alert("Work in progress");
    }, false);

    //dfsRecursive(cellData[0], cellData)
}

const timer = ms => new Promise(res => setTimeout(res, ms))

async function dfs(startPos, targetPos, grid) {
    const visited = [];
    const stack = [];
    const root = startPos;
    const target = targetPos;

    stack.push(root);

    while(stack.length) {
        const current = stack.pop();
        let cellToColor = document.getElementsByClassName('cell-'+current.cellNumber);

        if (current === target) {
            cellToColor[0].style.background='springgreen'
            visited.push(current);
            console.log(visited, 'Congrats')
            return current;
        }
        if (visited.indexOf(current) !== -1) {
            continue;
        }
        if(current.cellNumber !== 0){
            cellToColor[0].style.background='mediumpurple'
        }
        visited.push(current);

        for (let node of current.adjacentCells) {
            stack.push(grid[node]);
        }
        await timer(50);
    }
}

const path = [];

async function dfsIterative(vertex, grid) {
    const target = grid[grid.length-1]
    const stack = [];
    stack.push(vertex);
    while(stack.length) {
        if (vertex === target) {
            console.log('you reached cell ' + vertex.cellNumber + ' : Congrats')
            console.log('Optimal Path : ', path)
            displayPath(path, grid.length-1);
            return;
        }
        vertex = stack.pop();
        if (!vertex.visited) {
            vertex.visited = true;
            stack.push(vertex);
            path.push(vertex.cellNumber);
            for (let node of vertex.adjacentCells) {
                stack.push(grid[node]);
            }
        }
    }
}

async function dfsRecursive(vertex, grid) {
    const target = grid[grid.length-1]
    path.push(vertex.cellNumber)
    vertex.visited = true;
    if(vertex === target) {
        console.log('you reached cell ' + vertex.cellNumber + ' : Congrats');
        console.log('path', path);
        displayPath(path, grid.length-1);
        return true;
    }
    for (let node of vertex.adjacentCells.reverse()) {
        if(!grid[node].visited) {
            if (await dfsRecursive(grid[node], grid)) {
                return true;
            }
        }
    }
}

async function bfsIterative(vertex, grid) {
    const target = grid[grid.length-1]
    const stack = [];
    stack.push(vertex);
    while(stack.length) {
        if (vertex === target) {
            console.log('you reached cell ' + vertex.cellNumber + ' : Congrats')
            console.log('Optimal Path : ', path)
            displayPath(path, grid.length-1);
            return;
        }
        vertex = stack.shift();
        if (!vertex.visited) {
            vertex.visited = true;
            stack.push(vertex);
            path.push(vertex.cellNumber);
            for (let node of vertex.adjacentCells) {
                stack.push(grid[node]);
            }
        }
    }
}

async function displayPath(optimalPath, lastCell) {
    let displayDfsPath
    for (let i = 0; i < optimalPath.length; i++) {
        if (optimalPath[i] !== 0) {
            displayDfsPath = document.getElementsByClassName('cell-' + optimalPath[i]);
            if (optimalPath[i] !== lastCell) {
                displayDfsPath[0].style.background = 'mediumpurple';
        } else {
            displayDfsPath[0].style.background = 'springgreen';
        }
    }
    await timer(50);
    }
}


async function main() {
    // Async main function to call our maze generator functions
    createMaze(await loadJson());
}

main()

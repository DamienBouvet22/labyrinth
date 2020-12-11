async function loadJson(size, example) {
    const data = await fetch('labyrinthes.json')
        .then(response => response.json());

    let gridSize = size;
    let mazeName = 'ex-'+example;
    return {
        gridSize: gridSize,
        cellData: data[gridSize][mazeName]
    };
}
function createMaze(mazeBoard, size) {

    // We destructure the object
    const {cellData, gridSize} = mazeBoard;

    let width = 50;
    if (size > 18) {
        width = 30;
    }

    // We create the grid layout
    const mainDiv = document.getElementById('mainDiv');
    mainDiv.style.gridTemplateColumns = 'repeat(' + gridSize + ',' + width + 'px)';
    mainDiv.style.gridTemplateRows = 'repeat(' + gridSize + ',' + width + 'px)';
    let selectedTarget = null;

    // We loop through to create cells and walls
    for (let i = 0; i < cellData.length; i++) {
        let cell = document.createElement('div');
            cell.addEventListener('click', function() {
                if (selectedTarget === null){
                   selectedTarget = i;
                   cell.style.backgroundColor = "green"
                }
            }, false);
        let currentCell = cellData[i];
        // We add the cellNumber and adjacent cells property to the cellData Object
        currentCell.cellNumber = i;
        currentCell.adjacentCells = [];
        // We add the cellNumber in the display
        // cell.innerHTML += '<div>' +i+ '</div>';
        // We set the first cell in orange
        if (i === 0) {
            cell.style.backgroundColor = 'orange'
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
        if(selectedTarget === null){
            alert('Pick an exit')
        } else {
        dfsIterative(cellData[0], selectedTarget, cellData);
        }
    }, false);
    document.getElementById('dfsRecursive').addEventListener('click', function() {
        if(selectedTarget === null){
            alert('Pick an exit cell')
        } else {
            dfsRecursive(cellData[0], selectedTarget, cellData);
        }
    }, false);
    document.getElementById('bfsIterative').addEventListener('click', function() {
        if(selectedTarget === null){
            alert('Pick an exit cell')
        } else {
            bfsIterative(cellData[0], selectedTarget, cellData);
        }
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

let path = [];

async function dfsIterative(vertex, targetCell, grid) {
    const target = grid[targetCell];
    const stack = [];
    stack.push(vertex);
    while(stack.length) {
        if (vertex === target) {
            console.log('you reached cell ' + vertex.cellNumber + ' : Congrats')
            console.log('Path : ', path)
            displayPath(path, targetCell);
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

async function dfsRecursive(vertex, targetCell, grid) {
    const target = grid[targetCell];
    path.push(vertex.cellNumber)
    vertex.visited = true;
    if(vertex === target) {
        console.log('you reached cell ' + vertex.cellNumber + ' : Congrats');
        console.log('Path', path);
        displayPath(path, targetCell);
        return true;
    }
    for (let node of vertex.adjacentCells.reverse()) {
        if(!grid[node].visited) {
            if (await dfsRecursive(grid[node], targetCell, grid)) {
                return true;
            }
        }
    }
}

async function bfsIterative(vertex, targetCell, grid) {
    const target = grid[targetCell];
    const queue = [];
    queue.push(vertex);
    while(queue.length) {
        if (vertex === target) {
            console.log('you reached cell ' + vertex.cellNumber + ' : Congrats')
            console.log('Path : ', path)
            displayPath(path, targetCell);
            return;
        }
        vertex = queue.shift();
        if (!vertex.visited) {
            vertex.visited = true;
            queue.push(vertex);
            path.push(vertex.cellNumber);
            for (let node of vertex.adjacentCells) {
                queue.push(grid[node]);
            }
        }
    }
}

async function displayPath(optimalPath, targetCell) {
    let displayDfsPath
    for (let i = 0; i < optimalPath.length; i++) {
        if (optimalPath[i] !== 0) {
            displayDfsPath = document.getElementsByClassName('cell-' + optimalPath[i]);
            if (optimalPath[i] !== targetCell) {
                displayDfsPath[0].style.background = 'mediumpurple';
        } else {
            displayDfsPath[0].style.background = 'springgreen';
        }
    }
    await timer(50);
    }
}
let mazeSize = 15;
let mazeExample = 0;

function generate() {
    mazeSize = parseInt(document.getElementById('size').value);
    mazeExample = parseInt(document.getElementById('example').value);

    if (isNaN(mazeSize) || isNaN(mazeExample) || mazeSize < 3 || mazeSize > 25 || mazeExample < 0 || mazeExample > 2) {
        alert("size must be between 3 and 25 and example must be 0, 1 or 2");
    } else {
        path = [];
        $("#mainDiv").load(" #mainDiv > *");
        main(mazeSize, mazeExample);
    }
}
async function main(s, e) {
    // Async main function to call our maze generator functions
    createMaze(await loadJson(s, e), s);
}

main(mazeSize, mazeExample)

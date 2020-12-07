async function loadJson() {

    const data = await fetch('labyrinthes.json')
        .then(response => response.json());

    let gridSize = 3;
    let mazeName = 'ex-1';

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

    // We loop trough to create cells and walls
    for (let i = 0; i < cellData.length; i++) {
        let cell = document.createElement('div');
        // We apply the class for the color
        cell.className = 'cell-color cell-' + i;
        // We apply the border for the walls
        let walls = cellData[i]["walls"];
        if (walls[0]) {
            cell.style.borderTop = '1px solid'
        }
        if (walls[1]) {
            cell.style.borderRight = '1px solid'
        }
        if (walls[2]) {
            cell.style.borderBottom = '1px solid'
        }
        if (walls[3]) {
            cell.style.borderLeft = '1px solid'
        }

        mainDiv.appendChild(cell)
    }
}

async function main() {
    // Async main function to call our maze generator functions
    createMaze(await loadJson());
}

main();

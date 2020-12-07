async function loadJson() {
    return await fetch('labyrinthes.json')
        .then(response => response.json())
}

console.log(loadJson());

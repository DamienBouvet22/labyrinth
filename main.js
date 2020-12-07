function loadJSON(callback) {

    let request = new XMLHttpRequest();
    request.overrideMimeType("application/json");
    request.open('GET', 'labyrinthes.json', true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(request.responseText);
        }
    };
    request.send(null);
}

function init() {
    loadJSON(function(response) {
        // Parse JSON string into object
        let actual_JSON = JSON.parse(response);
    });
}

async function labyrinths() {
    return await fetch('labyrinthes.json')
        .then(response => response.json())
}

console.log(labyrinths());

let invadersId
let laserId
const grid = document.querySelector(".grid")
const resultDisplay = document.querySelector(".results")
let currentShooterIndex = 202
const width = 15
const aliensRemoved = []
let isGoingRight = true
let direction = 1
let results = 0
const squares = []
let contador = 0;
const contadorDisplay = document.querySelector(".contador")

const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39 
]


function createGrid() {
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement("div")
        grid.appendChild(square)
        squares.push(square)
    }
}

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add("invader")
        }
    }
}

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove("invader")
    }
}

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter")
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
            break
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
            break
    }
    squares[currentShooterIndex].classList.add("shooter")
}

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1
    remove()

    if (rightEdge && isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
            direction = -1
            isGoingRight = false
        }
    }

    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1
            direction = 1
            isGoingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()

    if (squares[currentShooterIndex].classList.contains("invader")) {
        resultDisplay.innerHTML = "GAME OVER"
        clearInterval(invadersId)
        contador = 0;
        contadorDisplay.innerHTML = "Racha: " + contador

        const boton = document.getElementById('jugar');
        boton.addEventListener('click', resetear);
        

    }
    
    if (aliensRemoved.length === alienInvaders.length) {
        resultDisplay.innerHTML = "YOU WIN"
        clearInterval(invadersId)
        contador += 1;
        contadorDisplay.innerHTML = "Racha: " + contador
        resetear()
    }
}

function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex

    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser")
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add("laser")

        if (squares[currentLaserIndex].classList.contains("invader")) {
            squares[currentLaserIndex].classList.remove("laser")
            squares[currentLaserIndex].classList.remove("invader")
            squares[currentLaserIndex].classList.add("boom")

            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300)
            clearInterval(laserId)

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultDisplay.innerHTML = results
        }
    }

    if (e.key === "ArrowUp") {
        laserId = setInterval(moveLaser, 100)
    }
}

function iniciar() {
    createGrid()
    draw()
    squares[currentShooterIndex].classList.add("shooter")
    document.addEventListener("keydown", moveShooter)
    document.addEventListener('keydown', shoot)
    invadersId = setInterval(moveInvaders, 600)
}

function resetear() {
    document.removeEventListener("keydown", moveShooter)
    document.removeEventListener('keydown', shoot)
    clearInterval(invadersId)
    clearInterval(laserId)
    

    // Limpiar las clases de los elementos del tablero
    squares.forEach(square => {
        square.classList.remove("shooter")
        square.classList.remove("laser")
        square.classList.remove("invader")
        square.classList.remove("boom")
    })

    // Limpiar el array de invasores eliminados y restablecer la puntuación
    aliensRemoved.length = 0
    results = 0
    resultDisplay.innerHTML = results

    // Restablecer la posición del jugador
    currentShooterIndex = 202

    // Restablecer los invasores a su posición original
    alienInvaders.length = 0
    alienInvaders.push(
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    );

  

    // Iniciar un nuevo juego
    iniciar()
}

const boton = document.getElementById('jugar');
boton.addEventListener('click', () => alert("Ya hay una partida en curso"));





iniciar()

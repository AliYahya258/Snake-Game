window.onload = function () {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    const restartButton = document.getElementById('restartButton');
    const titlePage = document.getElementById('titlePage');
    const gameContainer = document.getElementById('gameContainer');

    function drawBorder() {
        const borderWidth = 5;
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, borderWidth); // Top border
        context.fillRect(0, 0, borderWidth, canvas.height); // Left border
        context.fillRect(0, canvas.height - borderWidth, canvas.width, borderWidth); // Bottom border
        context.fillRect(canvas.width - borderWidth, 0, borderWidth, canvas.height); // Right border
    }

    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    let snake = [];
    let score = 0;
    let dx = 10, dy = 0;
    let foodX, foodY;
    let changingdirection = false;

    function initializeGame() {
        snake = [
            { x: 150, y: 150 },
            { x: 140, y: 150 },
            { x: 130, y: 150 },
            { x: 120, y: 150 },
            { x: 110, y: 150 },
        ];
        score = 0;
        dx = 10;
        dy = 0;
        document.getElementById('score').innerText = score;
        createFood();
        titlePage.style.display = 'none';
        gameContainer.style.display = 'block';
        onTick();
    }

    function drawSnakePart(snakePart) {
        context.fillStyle = 'red';
        context.strokeStyle = 'black';
        context.fillRect(snakePart.x, snakePart.y, 10, 10);
        context.strokeRect(snakePart.x, snakePart.y, 10, 10);
    }

    function drawSnake() {
        snake.forEach(drawSnakePart);
    }

    function advanceSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
        if (didEatFood) {
            score += 1;
            document.getElementById('score').innerText = score;
            createFood();
        } else {
            snake.pop();
        }
    }

    function drawFood() {
        context.fillStyle = 'blue';
        context.strokeStyle = 'darkred';
        context.fillRect(foodX, foodY, 10, 10);
        context.strokeRect(foodX, foodY, 10, 10);
    }

    function gameloop() {
        clearCanvas();
        drawBorder();
        advanceSnake();
        drawSnake();
        drawFood();
    }

    function changedirections(event) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;

        if (changingdirection) {
            return;
        }
        changingdirection = true;

        const keyPressed = event.keyCode;
        const goingUp = dy === -10;
        const goingDown = dy === 10;
        const goingRight = dx === 10;
        const goingLeft = dx === -10;

        if (keyPressed === LEFT_KEY && !goingRight) {
            dx = -10;
            dy = 0;
        }
        if (keyPressed === UP_KEY && !goingDown) {
            dx = 0;
            dy = -10;
        }
        if (keyPressed === RIGHT_KEY && !goingLeft) {
            dx = 10;
            dy = 0;
        }
        if (keyPressed === DOWN_KEY && !goingUp) {
            dx = 0;
            dy = 10;
        }
    }

    function randomTen(min, max) {
        return Math.round((Math.random() * (max - min) + min) / 10) * 10;
    }

    function createFood() {
        const borderWidth = 5;
        const cellSize = 10; // Size of the food item

        // Calculate the range for the food coordinates, avoiding the border
        const maxX = canvas.width - cellSize - borderWidth;
        const maxY = canvas.height - cellSize - borderWidth;

        foodX = randomTen(borderWidth, maxX);
        foodY = randomTen(borderWidth, maxY);

        // Ensure food is not generated in the border area
        while (foodX < borderWidth || foodY < borderWidth) {
            foodX = randomTen(borderWidth, maxX);
            foodY = randomTen(borderWidth, maxY);
        }

        // Check if food overlaps with the snake
        snake.forEach(function isFoodOnSnake(part) {
            const foodIsOnSnake = part.x === foodX && part.y === foodY;
            if (foodIsOnSnake) createFood();
        });
    }

    function didGameEnd() {
        for (let i = 4; i < snake.length; i++) {
            const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
            if (didCollide) {
                return true;
            }
        }
        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x >= canvas.width - 10 - 5;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y >= canvas.height - 10 - 5;
        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    function onTick() {
        if (didGameEnd()) {
            restartButton.style.display = 'block'; // Show restart button
            return;
        }
        changingdirection = false;
        gameloop();
        setTimeout(onTick, 150); // Call onTick again after 150ms
    }

    function startGame() {
        initializeGame();
    }

    function restartGame() {
        restartButton.style.display = 'none'; // Hide restart button
        initializeGame();
    }

    document.addEventListener("keydown", changedirections);
    restartButton.addEventListener("click", restartGame);
    document.getElementById('startButton').addEventListener('click', startGame);
};

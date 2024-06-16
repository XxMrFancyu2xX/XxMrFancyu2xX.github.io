document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.grid-container');
    const targetGridContainer = document.querySelector('.target-grid-container');
    const resetButton = document.getElementById('reset-button');
    const setSizeButton = document.getElementById('set-size-button');
    const gridSizeInput = document.getElementById('grid-size');
    const onColorInput = document.getElementById('on-color');
    const winText = document.getElementById('win-counter').querySelector('p');
    const solutionButton = document.getElementById('solution-button');
    const outerCodeBlock = document.getElementById('outer-code-block');
    let gridSize = parseInt(gridSizeInput.value);
    let grid = [];
    let history = [];
    let wins = 0;

    // Function to display a warning message
    function displayWarning(message) {
        alert(message);
    }

    // Initialize the grid with all lights off
    function initializeGrid() {
        gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
        targetGridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
        grid = [];
        targetGrid = [];
        for (let i = 0; i < gridSize; i++) {
            grid[i] = [];
            targetGrid[i] = [];
            for (let j = 0; j < gridSize; j++) {
                grid[i][j] = false;
                targetGrid[i][j] = Math.random() < 0.5; // Randomly set target grid cells

                const gridItem = document.createElement('div');
                gridItem.classList.add('grid-item');
                gridItem.addEventListener('click', () => {
                    toggleLights(i, j);
                    addHistory(i, j);
                    if (checkWin()) {
                        wins += 1;
                        winText.textContent = `Wins: ${wins}`;
                        launchConfetti();
                        resetGrid(true); // Reset triggered by a win
                    }
                });
                gridContainer.appendChild(gridItem);

                const targetGridItem = document.createElement('div');
                targetGridItem.classList.add('grid-item');
                if (targetGrid[i][j]) {
                    targetGridItem.classList.add('on');
                }
                targetGridContainer.appendChild(targetGridItem);
            }
        }
    }

    // Function to launch confetti
    function launchConfetti() {
        const duration = 2 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // Add the current grid state to history
    function addHistory(i, j) {
        const gridState = grid.map(row => [...row]);
        history.push({ state: gridState, coordinates: { i: i + 1, j: j + 1 } }); // Store coordinates
        updateHistoryUI();
    }

    // Update the history UI
    function updateHistoryUI() {
        const historyList = document.querySelector('.history-list');
        historyList.innerHTML = '';
        history.forEach((entry, index) => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');

            const coordinatesText = document.createElement('p');
            coordinatesText.textContent = `Clicked: (${entry.coordinates.i}, ${entry.coordinates.j}) \u21A6 ${(entry.coordinates.i - 1) * gridSize + (entry.coordinates.j)}`;

            const miniGridContainer = document.createElement('div');
            miniGridContainer.classList.add('mini-grid-container');
            miniGridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 30px)`;

            entry.state.forEach(row => {
                row.forEach(cell => {
                    const miniGridItem = document.createElement('div');
                    miniGridItem.classList.add('mini-grid-container-item');
                    if (cell) miniGridItem.style.backgroundColor = onColorInput.value;
                    miniGridContainer.appendChild(miniGridItem);
                });
            });

            const revertButton = document.createElement('button');
            revertButton.textContent = 'Revert';
            revertButton.style.padding = '10px 20px';
            revertButton.style.backgroundColor = '#138cff';
            revertButton.style.color = 'white';
            revertButton.style.border = 'none';
            revertButton.style.borderRadius = '5px';
            revertButton.style.cursor = 'pointer';
            revertButton.style.fontSize = '16px';
            revertButton.style.fontFamily = "'Roboto', sans-serif";
            revertButton.style.transition = 'background-color 0.4s';
            revertButton.addEventListener('click', () => revertToHistory(index));
            revertButton.addEventListener('mouseover', () => revertButton.style.backgroundColor = '#0056b3');
            revertButton.addEventListener('mouseout', () => revertButton.style.backgroundColor = '#138cff');

            historyItem.appendChild(coordinatesText); // Add coordinates text
            historyItem.appendChild(miniGridContainer);
            historyItem.appendChild(revertButton);
            historyList.prepend(historyItem);  // Use prepend to add new items at the top
        });
    }

    // Check if the player board matches the target board
    function checkWin() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] !== targetGrid[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    // Revert to a specific history state
    function revertToHistory(index) {
        grid = history[index].state.map(row => [...row]); // Access the 'state' property
        updateGridUI();
    }

    // Update the grid UI based on the current grid state
    function updateGridUI() {
        const gridItems = gridContainer.children;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const gridItem = gridItems[i * gridSize + j];
                if (grid[i][j]) {
                    gridItem.style.backgroundColor = onColorInput.value;
                } else {
                    gridItem.style.backgroundColor = '#333';
                }
            }
        }
    }

    // Toggle a specific light
    function toggleLight(row, col) {
        grid[row][col] = !grid[row][col];
        const index = row * gridSize + col;
        const gridItem = gridContainer.children[index];
        if (grid[row][col]) {
            gridItem.style.backgroundColor = onColorInput.value;
        } else {
            gridItem.style.backgroundColor = '#333';
        }
    }

    // Toggle the light and its neighbors
    function toggleLights(row, col) {
        toggleLight(row, col);
        if (row > 0) toggleLight(row - 1, col);
        if (row < gridSize - 1) toggleLight(row + 1, col);
        if (col > 0) toggleLight(row, col - 1);
        if (col < gridSize - 1) toggleLight(row, col + 1);
    }

    // Reset the grid to all lights off
    function resetGrid(triggeredByWin = false) {
        if (!triggeredByWin) {
            const userConfirmed = confirm("Are you sure you want to reset the grid?");
            if (!userConfirmed) {
                return; // Exit if the user cancels the reset
            }
        }
        gridContainer.innerHTML = '';
        targetGridContainer.innerHTML = '';
        history = [];  // Clear the history
        updateHistoryUI();  // Update the history UI to reflect the cleared history
        initializeGrid();
    }

    // Update grid size and reinitialize the grid with validation
    function setGridSize() {
        const newSize = parseFloat(gridSizeInput.value);
        if (newSize < 2 || newSize > 10) {
            displayWarning("Grid size must be between 2 and 10.");
            return;
        }
        if (newSize % 1 !== 0) {
            displayWarning("Grid size must be an integer.");
            return;
        }
        gridSize = newSize;
        resetGrid();
    }

    // Change the color of all "on" tiles when the on-color input value changes
    function updateOnColor() {
        const gridItems = gridContainer.children;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const gridItem = gridItems[i * gridSize + j];
                if (grid[i][j]) {
                    gridItem.style.backgroundColor = onColorInput.value;
                }
            }
        }
    }

    // Ensure that the history tab is closed when we switch tabs
    document.querySelectorAll('.nav-link').forEach(tab => {
        tab.addEventListener('click', () => {
            document.getElementById("history").style.width = "0";
            document.getElementById("main").style.marginLeft = "0";
        });
    });

    // Function to find solution
    function findSolution() {
        const targetGrid = Array.from(document.querySelectorAll('.target-grid-container .grid-item')).map(item => item.classList.contains('on') ? 1 : 0);
        
        function generateToggleMatrix(n) {
            const size = n * n;
            const A = Array.from({ length: size }, () => Array(size).fill(0));
        
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    const k = i * n + j;
                    A[k][k] = 1;  // Toggle itself
                    if (i > 0) A[k][k - n] = 1;  // Toggle the cell above
                    if (i < n - 1) A[k][k + n] = 1;  // Toggle the cell below
                    if (j > 0) A[k][k - 1] = 1;  // Toggle the cell to the left
                    if (j < n - 1) A[k][k + 1] = 1;  // Toggle the cell to the right
                }
            }
            return A;
        }
    
        function convertTo1Based(indices) {
            return indices.map(i => i + 1);
        }
    
        function findFirstCombination(n, targetGrid) {
            const A = generateToggleMatrix(n);
            const size = targetGrid.length;
            const indices = Array.from({ length: size }, (_, i) => i);
    
            function mod2Array(arr) {
                return arr.map(row => row.map(val => val % 2));
            }
    
            function mod2Vector(vec) {
                return vec.map(val => val % 2);
            }
    
            const Abinary = mod2Array(A);
            const bbinary = mod2Vector(targetGrid);
    
            function dotProductMod2(A, x) {
                return A.map(row => row.reduce((acc, val, idx) => acc + val * x[idx], 0) % 2);
            }
    
            for (let r = 1; r <= size; r++) {
                const combinations = getCombinations(indices, r);
                for (const combo of combinations) {
                    const x = Array(size).fill(0);
                    combo.forEach(idx => { x[idx] = 1; });
                    if (arraysEqual(dotProductMod2(Abinary, x), bbinary)) {
                        return convertTo1Based(combo);
                    }
                }
            }
            return null;
        }
    
        function getCombinations(arr, r) {
            const result = [];
            const combination = [];
            function combine(start) {
                if (combination.length === r) {
                    result.push([...combination]);
                    return;
                }
                for (let i = start; i < arr.length; i++) {
                    combination.push(arr[i]);
                    combine(i + 1);
                    combination.pop();
                }
            }
            combine(0);
            return result;
        }
    
        function arraysEqual(a, b) {
            return a.length === b.length && a.every((val, idx) => val === b[idx]);
        }

        const outerCodeBlock = document.getElementById('code-block-outer');
        if (!outerCodeBlock) {
            console.error('Element with id "code-block-outer" not found.');
            return;
        }
        
        const thinkingMessage = document.createElement('code');
        thinkingMessage.textContent = "---Fibonacci is thinking...---";
        outerCodeBlock.appendChild(thinkingMessage);
        const solution = findFirstCombination(gridSize, targetGrid);
    
        if (solution) {
            const newCodeLine = document.createElement('code');
            newCodeLine.textContent = `First solution found: ${solution.join(', ')}`;
            outerCodeBlock.appendChild(newCodeLine);
        } else {
            const newCodeLine = document.createElement('code');
            newCodeLine.textContent = "No solution found";
            outerCodeBlock.appendChild(newCodeLine);
        }
    }    

    // Initialize and reset button event
    initializeGrid();
    resetButton.addEventListener('click', () => resetGrid(false));
    setSizeButton.addEventListener('click', setGridSize);
    onColorInput.addEventListener('input', updateOnColor);
    solutionButton.addEventListener('click', findSolution);
});

function openHist() {
    document.getElementById("history").style.width = "500px";
    document.getElementById("main").style.marginLeft = "500px";
}

function closeHist() {
    document.getElementById("history").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}
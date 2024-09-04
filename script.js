document.addEventListener("DOMContentLoaded", function() {
    const journalInput = document.getElementById("journalInput");
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const timerDisplay = document.getElementById("timer");
    const startBtn = document.getElementById("startBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const resetBtn = document.getElementById("resetBtn");
    const newPageBtn = document.getElementById("newPageBtn");
    const noteInput = document.getElementById("noteInput");
    const saveNoteBtn = document.getElementById("saveNoteBtn");
    const notesList = document.getElementById("notesList");
    const clockDisplay = document.getElementById("clock");
    const pageTitle = document.getElementById("pageTitle");
    const themeToggle = document.getElementById("themeToggle");
    
    const graphCanvas = document.getElementById("graphCanvas");
    const saveGraphBtn = document.getElementById("saveGraphBtn");
    const updateGraphBtn = document.getElementById("updateGraphBtn");
    const graphInput = document.getElementById("graphInput");
    let graphData = [50, 70, 30, 90, 60, 80, 40];

    let timerInterval;
    let timeLeft = 1500;
    let isPaused = true;

    // Update clock every second
    setInterval(() => {
        const now = new Date();
        clockDisplay.textContent = now.toLocaleTimeString();
    }, 1000);

    addTaskBtn.addEventListener("click", function() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${taskText}</span>
                <div>
                    <button class="editBtn">✏️</button>
                    <button class="deleteBtn">🗑️</button>
                </div>
            `;
            taskList.appendChild(li);
            taskInput.value = "";

            li.querySelector(".editBtn").addEventListener("click", function() {
                const newTaskText = prompt("Edit task:", taskText);
                if (newTaskText) {
                    li.querySelector("span").textContent = newTaskText;
                }
            });

            li.querySelector(".deleteBtn").addEventListener("click", function() {
                taskList.removeChild(li);
            });
        }
    });

    saveNoteBtn.addEventListener("click", function() {
        const noteText = noteInput.value.trim();
        if (noteText) {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${noteText}</span>
                <div>
                    <button class="editNoteBtn">✏️</button>
                    <button class="deleteNoteBtn">🗑️</button>
                </div>
            `;
            notesList.appendChild(li);
            noteInput.value = "";

            li.querySelector(".editNoteBtn").addEventListener("click", function() {
                const newNoteText = prompt("Edit note:", noteText);
                if (newNoteText) {
                    li.querySelector("span").textContent = newNoteText;
                }
            });

            li.querySelector(".deleteNoteBtn").addEventListener("click", function() {
                notesList.removeChild(li);
            });
        }
    });

    savePageBtn.addEventListener("click", function() {
        const pageTitle = document.getElementById("pageTitle").innerText;
        const journalContent = document.getElementById("journalInput").value;
        const taskListItems = Array.from(taskList.children).map(li => li.innerHTML).join('');
        const notesListItems = Array.from(notesList.children).map(li => li.innerHTML).join('');
        const currentDate = new Date().toLocaleDateString();

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${pageTitle} - Saved on ${currentDate}</title>
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
                <h1>${pageTitle}</h1>
                <h2>Saved on: ${currentDate}</h2>
                <h2>Journal</h2>
                <textarea readonly>${journalContent}</textarea>
                <h2>Task List</h2>
                <ul>${taskListItems}</ul>
                <h2>Notes</h2>
                <ul>${notesListItems}</ul>
            </body>
            </html>
        `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${pageTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${currentDate.replace(/\//g, '-')}.html`;
        a.click();
        URL.revokeObjectURL(url);
    });

    function updateTimer() {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up!");
            resetTimer();
        } else {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }

    startBtn.addEventListener("click", function() {
        if (isPaused) {
            isPaused = false;
            timerInterval = setInterval(updateTimer, 1000);
        }
    });

    pauseBtn.addEventListener("click", function() {
        clearInterval(timerInterval);
        isPaused = true;
    });

    resetBtn.addEventListener("click", function() {
        clearInterval(timerInterval);
        resetTimer();
    });

    function resetTimer() {
        timeLeft = 1500;
        timerDisplay.textContent = "25:00";
        isPaused = true;
    }

    newPageBtn.addEventListener("click", function() {
        const newPage = document.createElement("div");
        newPage.classList.add("new-page");
        newPage.innerHTML = `
            <h2 contenteditable="true">New Page</h2>
            <textarea placeholder="Write your notes..."></textarea>
        `;
        document.body.appendChild(newPage);
    });

    themeToggle.addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
        document.querySelector("header").classList.toggle("dark-mode");
        journalInput.classList.toggle("dark-mode");
        timerDisplay.classList.toggle("dark-mode");
        
        // Add animation effect
        themeToggle.classList.add("clicked");
        setTimeout(() => {
            themeToggle.classList.remove("clicked");
        }, 300);
    });

    // Function to make elements draggable
    function makeDraggable(element) {
        let offsetX, offsetY;

        element.addEventListener('mousedown', function(e) {
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;

            function mouseMoveHandler(e) {
                element.style.position = 'absolute';
                element.style.left = e.clientX - offsetX + 'px';
                element.style.top = e.clientY - offsetY + 'px';
            }

            function mouseUpHandler() {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            }

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });
    }

    // Make all containers draggable
    const containers = document.querySelectorAll('.journal-container, #taskContainer, #notesContainer');
    containers.forEach(container => {
        makeDraggable(container);
    });

    // Function to plot graph
    function plotGraph() {
        const ctx = graphCanvas.getContext('2d');
        ctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
        ctx.beginPath();
        ctx.moveTo(0, graphCanvas.height - graphData[0]);

        for (let i = 1; i < graphData.length; i++) {
            ctx.lineTo(i * (graphCanvas.width / graphData.length), graphCanvas.height - graphData[i]);
        }

        ctx.strokeStyle = '#007bff';
        ctx.stroke();
    }

    plotGraph();

    saveGraphBtn.addEventListener("click", function() {
        const blob = new Blob([JSON.stringify(graphData)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'graphData.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    updateGraphBtn.addEventListener("click", function() {
        const inputValues = graphInput.value.split(',').map(value => parseFloat(value.trim())).filter(value => !isNaN(value));
        if (inputValues.length > 0) {
            graphData = inputValues;
            plotGraph();
            graphInput.value = ''; // Clear input after updating
        } else {
            alert("Please enter valid numbers.");
        }
    });

    // Function to auto-resize textareas
    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto'; // Reset height
        textarea.style.height = textarea.scrollHeight + 'px'; // Set to scroll height
    }

    // Attach auto-resize to journal and notes textareas
    const textareas = [journalInput, noteInput];
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            autoResizeTextarea(textarea);
        });
        autoResizeTextarea(textarea); // Initial resize
    });
});

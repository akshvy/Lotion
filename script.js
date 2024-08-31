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
});

// Home Page
const body = document.querySelector("body"),
      sidebar = body.querySelector(".sidebar")
      toggle = body.querySelector(".toggle")
      themeSwitch = body.querySelector(".toggle-switch")
      themeText = body.querySelector(".theme-text")

      toggle.addEventListener("click", () =>{
        sidebar.classList.toggle("close");
      })
      
      themeSwitch.addEventListener("click", () =>{
        body.classList.toggle("dark");

        if (body.classList.contains("dark")){
            themeText.innerText = "Light Mode"
        }
        else {
            themeText.innerText = "Dark Mode"
        }
      });

      sidebar.addEventListener("click")

// Navigation Functionality
const navButtons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');
const logo = document.getElementById('logo');

function navigateTo(pageId) {
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update active nav button
    navButtons.forEach(btn => {
        if (btn.dataset.page === pageId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // If navigating to data page, render calendar
    if (pageId === 'data') {
        renderCalendar();
    }
}

navButtons.forEach(button => {
    button.addEventListener('click', function() {
        navigateTo(this.dataset.page);
    });
});

logo.addEventListener('click', function() {
    navigateTo('home');
});

// Workout Log Page
async function addWorkout() {
    const dateInput = document.getElementById('date').value;
    const workoutsInput = document.getElementById('workouts').value;

    if (!dateInput || !workoutsInput.trim()) {
        alert('Please enter both a date and at least one workout.');
        return;
    }

    const workouts = workoutsInput.split('\n').map(workout => workout.trim()).filter(workout => workout);
    const newEntry = { date: dateInput, workouts: workouts };

    console.log('Sending workout data:', JSON.stringify(newEntry)); // Debugging log

    try {
        const response = await fetch('/add_workout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEntry)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Workout log response:', result); // Debugging log
        alert(result.message);
        displayWorkoutLog();
    } catch (error) {
        console.error('Error adding workout:', error);
        alert('Failed to add workout. Check console for details.');
    }
}

async function displayWorkoutLog() {
    try {
        const response = await fetch('/get_workouts');
        if (!response.ok) {
            throw new Error('Failed to fetch workout log');
        }

        const workoutLog = await response.json();
        const workoutLogDiv = document.getElementById('workoutLog');

        if (workoutLog.length === 0) {
            workoutLogDiv.innerHTML = '<p>No workouts logged yet.</p>';
            return;
        }

        // Sort workouts by date (most recent first)
        workoutLog.sort((a, b) => new Date(b.date) - new Date(a.date));

        const logHTML = workoutLog.map(entry => `
            <div class="log-entry">
                <strong>Date: ${entry.date}</strong>
                <ul>
                    ${entry.workouts.map(workout => `<li>${workout}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        workoutLogDiv.innerHTML = logHTML;
    } catch (error) {
        console.error('Error fetching workout log:', error);
        document.getElementById('workoutLog').innerHTML = '<p>Error loading workout log.</p>';
    }
}

function editWorkout(index, updatedText) {
    fetch("/edit_workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, updatedText })
    })
    .then(() => displayWorkoutLog())
    .catch(error => console.error("Error editing:", error));
}

function deleteWorkout(index) {
    fetch("/delete_workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index })
    })
    .then(() => displayWorkoutLog())
    .catch(error => console.error("Error deleting:", error));
}

// Load workout log when page loads
document.addEventListener('DOMContentLoaded', displayWorkoutLog);

function addWorkout() {
    const date = document.getElementById('date').value;
    const workoutType = document.getElementById('workoutType').value;
    const repetitions = document.getElementById('repetitions').value;
    const setCount = document.getElementById('setCount').value;
    const workoutLog = document.getElementById('workoutLog');

    if (!date) {
        alert("Please select a date.");
        return;
    }

    // Create new log entry
    const listItem = document.createElement('li');
    listItem.style.display = "flex";
    listItem.style.justifyContent = "space-between";
    listItem.style.alignItems = "center";
    listItem.style.padding = "10px";
    listItem.style.border = "1px solid #ccc";
    listItem.style.borderRadius = "5px";
    listItem.style.margin = "5px 0";
    listItem.style.background = "#f9f9f9";

    const workoutText = document.createElement('span');
    workoutText.textContent = `${date} - ${workoutType}: ${repetitions} x ${setCount}`;

    // Remove button (-)
    const removeBtn = document.createElement('button');
    removeBtn.textContent = "❌";
    removeBtn.style.marginRight = "10px";
    removeBtn.style.background = "red";
    removeBtn.style.color = "white";
    removeBtn.style.border = "none";
    removeBtn.style.padding = "5px 10px";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.borderRadius = "5px";
    removeBtn.onclick = function () {
        listItem.remove();
        if (workoutLog.children.length === 0) {
            workoutLog.innerHTML = "No workouts logged yet.";
        }
    };

    // Append elements to list item
    listItem.appendChild(removeBtn);
    listItem.appendChild(workoutText);

    // Append to log
    if (workoutLog.textContent === "No workouts logged yet.") {
        workoutLog.innerHTML = ''; // Clear placeholder text
    }
    workoutLog.appendChild(listItem);
}
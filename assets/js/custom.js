
// handleDateTime  =============
var handleDateTime = function () {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0];
    const dateElement = document.getElementById('current-date');
    const timeElement = document.getElementById('current-time');
    dateElement.textContent = currentDate;
    dateElement.setAttribute('value', currentDate);
    timeElement.textContent = currentTime;
    timeElement.setAttribute('datetime', currentTime);
    document.getElementById('dateField').value = currentDate;
    document.getElementById('timeField').value = currentTime;
}

// handle Form Submit  =============
var handleFormSubmit = function () {
    document.getElementById('markAttendanceBtn').addEventListener('click', function (e) {
        e.preventDefault();
        const nameInput = document.getElementById('InputName');
        const punchType = document.querySelector('input[name="punchType"]:checked');
        const punchinField = document.getElementById('punchinField');
        const punchoutField = document.getElementById('punchoutField');
        const form = document.getElementById('attendanceForm');

        if (!nameInput.value.trim()) {
            alert("Please enter your name.");
            return;
        }
        if (!punchType) {
            alert("Please select Punch In or Punch Out.");
            return;
        }
        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0];
        if (punchType.value === 'in') {
            punchinField.value = currentTime;
            punchoutField.value = '';
        } else if (punchType.value === 'out') {
            punchoutField.value = currentTime;
            punchinField.value = '';
        }

        const formData = new FormData(form);
        fetch('https://shivsunan.app.n8n.cloud/webhook/attendance', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === "Workflow was started") {
                    document.getElementById('viewList').classList.remove('d-none');
                    const successDiv = document.getElementById('successMessage');
                    successDiv.classList.remove('d-none');
                    form.reset();
                    punchinField.value = '';
                    punchoutField.value = '';
                    setTimeout(() => {
                        successDiv.classList.add('d-none');
                    }, 5000);
                } else {
                    alert("Unexpected response: " + JSON.stringify(data));
                }
            })
            .catch(err => {
                alert("Error submitting form: " + err.message);
            });
    });
}

// handle Get Data  =============
var handleGetData = function () {
    fetch('https://shivsunan.app.n8n.cloud/webhook/get-attendance')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('attendanceTableBody');
            data.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${record.Name}</td>
                <td>${record.PunchType}</td>
                <td>${record.PunchIn}</td>
                <td>${record.PunchOut}</td>
                <td>${record.Date}</td>
            `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching attendance records:', error));
}

// Register of Event Handlers  =============
var handleRegisterSubmit = function () {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const mobilenumber = document.getElementById('mobilenumber').value;
        const password = document.getElementById('password').value;
        const formData = { username, email, mobilenumber, password };
        try {
            const response = await fetch('https://shivsunan.app.n8n.cloud/webhook/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            let resultText = await response.text();
            let result;

            try {
                result = JSON.parse(resultText);
            } catch {
                result = { status: "ok", message: resultText || "No response body" }; 
            }
            successMessage.classList.add("d-none");
            errorMessage.classList.add("d-none");
            if (response.ok && result.status !== "error") {
                form.reset();
                successMessage.classList.remove("d-none");
            } else {
                errorMessage.textContent = "❌ " + (result.message || "Registration failed!");
                errorMessage.classList.remove("d-none");
            }
        } catch (error) {
            console.error('Registration failed:', error);
            successMessage.classList.add("d-none");
            errorMessage.textContent = "❌ Something went wrong!";
            errorMessage.classList.remove("d-none");
        }
    });
}

function handleLoginSubmit() {
    const form = document.getElementById('loginForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const mobilenumber = document.getElementById('mobilenumber').value;
        const password = document.getElementById('password').value;
        const formData = { mobilenumber, password };
        try {
            const response = await fetch('https://shivsunan.app.n8n.cloud/webhook/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            let resultText = await response.text();
            let result;
            try {
                result = JSON.parse(resultText);
            } catch {
                result = { status: "ok", message: resultText || "No response body" };
            }

            successMessage.classList.add("d-none");
            errorMessage.classList.add("d-none");
            if (response.ok && result.status !== "error") {
                successMessage.textContent = "✅ Login successful!";
                successMessage.classList.remove("d-none");
                form.reset();
                // optional redirect after login
                window.location.href = "dashboard.html";
            } else {
                errorMessage.textContent = "❌ " + (result.message || "Invalid mobile number or password!121");
                errorMessage.classList.remove("d-none");
            }
        } catch (error) {
            console.error("Login failed:", error);
            successMessage.classList.add("d-none");
            errorMessage.textContent = "❌ Something went wrong!";
            errorMessage.classList.remove("d-none");
        }
    });
}
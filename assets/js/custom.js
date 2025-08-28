
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

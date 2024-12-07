document.addEventListener("DOMContentLoaded", function () {
    let calendarData = {};
    let selectedDay = null;

    fetch('../reservations.json')
        .then(response => response.json())
        .then(data => {
            calendarData = data.reservations;
            generateCalendar();
        })

    function generateCalendar() {
        const calendarContainer = document.getElementById('calendar');
        const date = new Date();
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const totalDays = lastDay.getDate();
        const startDay = firstDay.getDay();

        let calendarHTML = `<div class="calendar-header">${months[currentMonth]} ${currentYear}</div>`;
        calendarHTML += `<table class="calendar-table"><thead><tr>`;

        daysOfWeek.forEach(day => {
            calendarHTML += `<th>${day}</th>`;
        });
        calendarHTML += `</tr></thead><tbody><tr>`;

        for (let i = 0; i < startDay; i++) {
            calendarHTML += `<td></td>`;
        }

        for (let day = 1; day <= totalDays; day++) {
            if ((startDay + day - 1) % 7 === 0 && day !== 1) {
                calendarHTML += `</tr><tr>`;
            }
            calendarHTML += `<td class="day" data-day="${day}">${day}</td>`;
        }

        calendarHTML += `</tr></tbody></table>`;
        calendarContainer.innerHTML = calendarHTML;

        document.querySelectorAll('.day').forEach(dayElement => {
            dayElement.addEventListener('click', function () {
                if (!getExistingReservation()) {
                    selectedDay = this.getAttribute('data-day');
                    updateAvailableTimes(selectedDay);
                }
            });
        });

        displayExistingReservation();
    }

    function updateAvailableTimes(day) {
        const timeSelect = document.getElementById('time-select');
        const times = Object.keys(calendarData[`day${day}`]);
        timeSelect.innerHTML = '<option value="">Select a time</option>';

        times.forEach(time => {
            if (!calendarData[`day${day}`][time] && !getCookie(`reservation_day${day}_${time}`)) {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                timeSelect.appendChild(option);
            }
        });

        timeSelect.disabled = false;
        document.getElementById('confirm-reservation').disabled = false;
    }

    document.getElementById('confirm-reservation').addEventListener('click', function () {
        const timeSelect = document.getElementById('time-select');
        const selectedTime = timeSelect.value;

        if (selectedTime && selectedDay !== null) {
            setCookie(`reservation_day${selectedDay}_${selectedTime}`, 'true', 365);
            calendarData[`day${selectedDay}`][selectedTime] = true;
            updateAvailableTimes(selectedDay);
            document.getElementById('message').textContent = `Reservation confirmed for ${selectedTime} on day ${selectedDay}.`;
            displayExistingReservation();
        } else {
            document.getElementById('message').textContent = 'Please select a valid time.';
        }
    });

    function getExistingReservation() {
        const reservedCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('reservation_'));
        return reservedCookie ? true : false;
    }

    function displayExistingReservation() {
        const reservation = getExistingReservation();
        if (reservation) {
            const reservationText = getCurrentReservationText();
            document.getElementById('existing-reservation').textContent = `You have a reservation set: ${reservationText}`;
            document.getElementById('time-select').disabled = true;
            document.getElementById('confirm-reservation').disabled = true;
        } else {
            document.getElementById('existing-reservation').textContent = '';
        }
    }

    function getCurrentReservationText() {
        const reservedCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('reservation_'));
        if (reservedCookie) {
            const parts = reservedCookie.split('=')[0].split('_');
            const day = parts[1];
            const time = parts[2];
            return `on ${day} for ${time}`;
        }
        return '';
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${name}=${value};${expires};path=/`;
    }

    function getCookie(name) {
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies = decodedCookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let c = cookies[i].trim();
            if (c.indexOf(name) === 0) {
                return c.substring(name.length + 1, c.length);
            }
        }
        return "";
    }
});

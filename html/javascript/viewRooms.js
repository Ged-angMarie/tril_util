//dito ung calendar where when you click on a room, it will show the calendar for that room
//then when you click on a date, it will show ung available time slots in that date for the selected room

//gpt made ts

let selectedRoomId = null;
let selectedRoomName = '';
let calendarInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('View Rooms page loaded');
    
    initRoomCards();
    initBackToRooms();
});

function initRoomCards() {
    const roomsGrid = document.getElementById('roomsGrid');
    
    const rooms = [
        {
            id: 'D420',
            name: 'D420',
            capacity: 30,
            availability: 'available'
        },
        {
            id: 'D421',
            name: 'D421',
            capacity: 25,
            availability: 'limited'
        },
        {
            id: 'D422',
            name: 'D422',
            capacity: 20,
            availability: 'available'
        },
        {
            id: 'D423',
            name: 'D423',
            capacity: 15,
            availability: 'unavailable'
        },
        {
            id: 'D424',
            name: 'D424',
            capacity: 18,
            availability: 'available'
        }
    ];
    
    roomsGrid.innerHTML = '';
    
    rooms.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = `room-card`;
        roomCard.setAttribute('data-room-id', room.id);
        
        roomCard.innerHTML = `
            <div class="room-header">
                <h3 class="room-name">${room.name}</h3>
                <span class="room-capacity">${room.capacity} seats</span>
            </div>
            <div class="room-availability">
                <span class="availability-status ${room.availability}">
                    ${room.availability === 'available' ? 'Available' : 
                      room.availability === 'limited' ? 'Limited' : 'Unavailable'}
                </span>
            </div>
        `;
        
        //click event to select room and show calendar
        roomCard.addEventListener('click', function() {
            if (room.availability === 'unavailable') {
                alert(`${room.name} is currently unavailable for reservations.`);
                return;
            }
            
            document.querySelectorAll('.room-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            this.classList.add('selected');
            
            selectedRoomId = room.id;
            selectedRoomName = room.name;
            
            showCalendarForRoom(room);
        });
        
        roomsGrid.appendChild(roomCard);
    });
}

function initBackToRooms() {
    const backToRoomsBtn = document.getElementById('backToRoomsBtn');
    if (backToRoomsBtn) {
        backToRoomsBtn.addEventListener('click', function() {
            const roomsSection = document.getElementById('roomsSection');
            const calendarSection = document.getElementById('calendarSection');
            
            roomsSection.style.display = 'block';
            calendarSection.style.display = 'none';
            
            clearTimeSlots();
            document.querySelectorAll('.calendar-day').forEach(day => {
                day.classList.remove('selected');
            });
            
            document.querySelectorAll('.room-card').forEach(card => {
                card.classList.remove('selected');
            });
            selectedRoomId = null;
            selectedRoomName = '';
        });
    }
}

function showCalendarForRoom(room) {
    const roomsSection = document.getElementById('roomsSection');
    const calendarSection = document.getElementById('calendarSection');
    const selectedRoomNameElement = document.getElementById('selectedRoomName');
    const selectedRoomDisplay = document.getElementById('selectedRoomDisplay');
    
    selectedRoomNameElement.textContent = room.name;
    selectedRoomDisplay.textContent = room.name;
    
    roomsSection.style.display = 'none';
    calendarSection.style.display = 'block';
    
    if (!calendarInitialized) {
        initCalendar();
        calendarInitialized = true;
    }
}

//for calendar
function initCalendar() {
    let currentDate = new Date();
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    function generateCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        currentMonthElement.textContent = date.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });

        calendarGrid.innerHTML = '';

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDay - 1; i >= 0; i--) {
            const dayElement = createDayElement(prevMonthLastDay - i, true);
            calendarGrid.appendChild(dayElement);
        }

        for (let day = 1; day <= totalDays; day++) {
            const dayElement = createDayElement(day, false);
            
            const availability = getRandomAvailability();
            if (availability === 'high') {
                dayElement.classList.add('has-availability');
                dayElement.querySelector('.availability-indicator').textContent = '5+ slots';
            } else if (availability === 'low') {
                dayElement.classList.add('low-availability');
                dayElement.querySelector('.availability-indicator').textContent = '1-4 slots';
            } else {
                dayElement.classList.add('no-availability');
                dayElement.querySelector('.availability-indicator').textContent = 'Full';
            }
            
            calendarGrid.appendChild(dayElement);
        }

        const totalCells = 42; 
        const remainingCells = totalCells - (startingDay + totalDays);
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = createDayElement(day, true);
            calendarGrid.appendChild(dayElement);
        }
    }

    function createDayElement(day, isOtherMonth) {
        const dayElement = document.createElement('button');
        dayElement.className = `calendar-day ${isOtherMonth ? 'other-month' : ''}`;
        
        dayElement.innerHTML = `
            <div class="day-number">${day}</div>
            <div class="availability-indicator"></div>
        `;

        if (!isOtherMonth) {
            dayElement.addEventListener('click', function() {
                if (!selectedRoomId) {
                    alert('Please select a room first.');
                    return;
                }

                document.querySelectorAll('.calendar-day').forEach(day => {
                    day.classList.remove('selected');
                });
                
                this.classList.add('selected');
                
                const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const formattedDate = selectedDate.toISOString().split('T')[0];
                
                console.log('Selected date:', selectedDate.toDateString(), 'for room:', selectedRoomId);
                
                showTimeSlotsForDate(selectedDate, this);
            });
        }

        return dayElement;
    }

    function getRandomAvailability() {
        const random = Math.random();
        if (random < 0.3) return 'high';
        if (random < 0.7) return 'low';
        return 'none';
    }

    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate);
        
        clearTimeSlots();
        hideSelectedDateInfo();
    });

    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate);
        
        clearTimeSlots();
        hideSelectedDateInfo();
    });

    generateCalendar(currentDate);
}

//this is for simulating ung time slots (display purposes lang)
function showTimeSlotsForDate(date, dayElement) {
    const availabilityClass = Array.from(dayElement.classList).find(cls => 
        cls === 'no-availability' || cls === 'low-availability' || cls === 'has-availability'
    );
    
    //if date is marked as full, show no time slots
    if (availabilityClass === 'no-availability') {
        displayNoTimeSlots(date);
        return;
    }
    
    showSelectedDateInfo(date);
    
    let timeSlotsContainer = document.getElementById('timeSlotsContainer');
    if (!timeSlotsContainer) {
        timeSlotsContainer = document.createElement('div');
        timeSlotsContainer.id = 'timeSlotsContainer';
        timeSlotsContainer.className = 'time-slots-container';
        
        // Insert after selected date info
        const selectedDateInfo = document.getElementById('selectedDateInfo');
        if (selectedDateInfo) {
            selectedDateInfo.parentNode.insertBefore(timeSlotsContainer, selectedDateInfo.nextSibling);
        }
    }
    
    timeSlotsContainer.innerHTML = '<div class="loading-time-slots">Loading available time slots...</div>';
    
    setTimeout(() => {
        const timeSlots = generateTimeSlots(date, availabilityClass);
        displayTimeSlots(timeSlots, date, timeSlotsContainer);
    }, 500);
}

//for display purposes lang to
function generateTimeSlots(date, availabilityClass) {
    const timeSlots = [];
    const timeRanges = [
        '8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM',
        '11:00 AM - 12:00 PM', '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM',
        '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM'
    ];
    
    let availabilityChance = 0.7; 
    
    if (availabilityClass === 'low-availability') {
        availabilityChance = 0.3; 
    } else if (availabilityClass === 'has-availability') {
        availabilityChance = 0.9; 
    }
    
    timeRanges.forEach(timeRange => {
        if (Math.random() < availabilityChance) {
            timeSlots.push({
                roomId: selectedRoomId,
                roomName: selectedRoomName,
                timeRange: timeRange,
                date: date.toISOString().split('T')[0],
                capacity: getRoomCapacity(selectedRoomId)
            });
        }
    });
    
    return timeSlots;
}

function displayNoTimeSlots(date) {
    //showing selected date info
    showSelectedDateInfo(date);
    
    let timeSlotsContainer = document.getElementById('timeSlotsContainer');
    if (!timeSlotsContainer) {
        timeSlotsContainer = document.createElement('div');
        timeSlotsContainer.id = 'timeSlotsContainer';
        timeSlotsContainer.className = 'time-slots-container';
        
        const selectedDateInfo = document.getElementById('selectedDateInfo');
        if (selectedDateInfo) {
            selectedDateInfo.parentNode.insertBefore(timeSlotsContainer, selectedDateInfo.nextSibling);
        }
    }
    
    const dateString = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    timeSlotsContainer.innerHTML = `
        <div class="no-time-slots">
            <h3>No Available Time Slots</h3>
            <p><strong>${dateString}</strong> is fully booked for <strong>${selectedRoomName}</strong>.</p>
            <p>Please select a different date with available time slots.</p>
        </div>
    `;
}

function showSelectedDateInfo(date) {
    const selectedDateInfo = document.getElementById('selectedDateInfo');
    const selectedDateDisplay = document.getElementById('selectedDateDisplay');
    
    if (selectedDateInfo && selectedDateDisplay) {
        const dateString = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        selectedDateDisplay.textContent = dateString;
        selectedDateInfo.style.display = 'block';
    }
}

function hideSelectedDateInfo() {
    const selectedDateInfo = document.getElementById('selectedDateInfo');
    if (selectedDateInfo) {
        selectedDateInfo.style.display = 'none';
    }
}

function displayTimeSlots(timeSlots, date, container) {
    if (timeSlots.length === 0) {
        container.innerHTML = `
            <div class="no-time-slots">
                <h3>No available time slots for ${date.toDateString()}</h3>
                <p>in <strong>${selectedRoomName}</strong></p>
                <p>Please try another date.</p>
            </div>
        `;
        return;
    }
    
    const dateString = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    let html = `
        <div class="time-slots-header">
            <h3>Available Time Slots for ${dateString}</h3>
            <p>in <strong>${selectedRoomName}</strong> (${getRoomCapacity(selectedRoomId)} seats)</p>
        </div>
        <div class="time-slots-grid">
            <div class="room-time-slot-group">
                <div class="time-slots-list">
    `;
    
    timeSlots.forEach(slot => {
        html += `
            <div class="time-slot-item">
                <span class="time-range">${slot.timeRange}</span>
                <button class="reserve-time-btn" 
                        onclick="reserveTimeSlot('${slot.roomId}', '${slot.date}', '${slot.timeRange}')">
                    Reserve
                </button>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

function clearTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');
    if (timeSlotsContainer) {
        timeSlotsContainer.remove();
    }
}
//thank u gpt dito:
// Helper functions
function getRoomName(roomId) {
    const roomNames = {
        'D420': 'D420',
        'D421': 'D421',
        'D422': 'D422',
        'D423': 'D423',
        'D424': 'D424'
    };
    return roomNames[roomId] || roomId;
}

function getRoomCapacity(roomId) {
    const capacities = {
        'D420': 30,
        'D421': 25,
        'D422': 20,
        'D423': 15,
        'D424': 18
    };
    return capacities[roomId] || 0;
}

function reserveTimeSlot(roomId, date, timeRange) {
    console.log('Reserving:', { roomId, date, timeRange });
    
    const confirmed = confirm(`Reserve ${getRoomName(roomId)} on ${date} at ${timeRange}?\n\nClick OK to proceed to reservation.`);
    
    if (confirmed) {
        window.location.href = `/html/user/reservation.html?room=${roomId}&date=${date}&time=${encodeURIComponent(timeRange)}`;
    }
}
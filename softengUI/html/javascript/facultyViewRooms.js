let selectedRoomId = null;
let selectedRoomName = '';
let calendarInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Faculty View Rooms page loaded');
    
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
            availability: 'available'
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
            availability: 'available'
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
                    ${room.availability === 'available' ? 'Available' : 'Unavailable'}
                </span>
            </div>
        `;
        
        roomCard.addEventListener('click', function() {
            document.querySelectorAll('.room-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            this.classList.add('selected');
            
            selectedRoomId = room.id;
            selectedRoomName = room.name;
            
            showScheduleForRoom(room);
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

function showScheduleForRoom(room) {
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
            
            const reservedCount = getReservedSlotsCount(date, day);
            if (reservedCount > 0) {
                dayElement.classList.add('has-reservations');
                dayElement.querySelector('.availability-indicator').textContent = `${reservedCount} reserved`;
            } else {
                dayElement.classList.add('no-reservations');
                dayElement.querySelector('.availability-indicator').textContent = 'Available';
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
                
                console.log('Selected date:', selectedDate.toDateString(), 'for room:', selectedRoomId);
                
                showReservedSlotsForDate(selectedDate, this);
            });
        }

        return dayElement;
    }
//more mock data
    function getReservedSlotsCount(date, day) {
        const selectedDate = new Date(date.getFullYear(), date.getMonth(), day);
        const reservedSlots = generateReservedSlots(selectedDate, selectedRoomId);
        return reservedSlots.length;
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

//simulation this part:
function generateReservedSlots(date, roomId) {
    const reservedSlots = [];
    const timeRanges = [
        '8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM',
        '11:00 AM - 12:00 PM', '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM',
        '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM'
    ];
    
    const students = [
        'John Smith (2024-12345)',
        'Maria Garcia (2024-12346)', 
        'David Chen (2024-12347)',
        'Sarah Johnson (2024-12348)',
        'Michael Brown (2024-12349)'
    ];

    const purposes = [
        'Group Project',
        'Research Work',
        'Thesis Work', 
        'Group Study',
        'Class Project'
    ];

    timeRanges.forEach(timeRange => {
        if (Math.random() < 0.4) {
            reservedSlots.push({
                timeRange: timeRange,
                reservedBy: students[Math.floor(Math.random() * students.length)],
                purpose: purposes[Math.floor(Math.random() * purposes.length)],
                participants: Math.floor(Math.random() * 20) + 1,
                status: Math.random() > 0.3 ? 'approved' : 'pending'
            });
        }
    });
    
    return reservedSlots;
}

function showReservedSlotsForDate(date, dayElement) {
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
    
    timeSlotsContainer.innerHTML = '<div class="loading-time-slots">Loading reserved time slots...</div>';
    
    setTimeout(() => {
        const reservedSlots = generateReservedSlots(date, selectedRoomId);
        displayReservedSlots(reservedSlots, date, timeSlotsContainer);
    }, 500);
}

function displayReservedSlots(reservedSlots, date, container) {
    if (reservedSlots.length === 0) {
        container.innerHTML = `
            <div class="no-time-slots">
                <h3>No Reserved Time Slots</h3>
                <p>There are no reservations for <strong>${date.toDateString()}</strong></p>
                <p>The room is available all day.</p>
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
            <h3>Reserved Time Slots for ${dateString}</h3>
            <p>in <strong>${selectedRoomName}</strong></p>
        </div>
        <div class="reserved-slots-list">
    `;
    
    reservedSlots.forEach(slot => {
        html += `
            <div class="reserved-slot-item ${slot.status}">
                <div class="slot-time">${slot.timeRange}</div>
                <div class="slot-details">
                    <div class="reserved-by">
                        <strong>Reserved by:</strong> ${slot.reservedBy}
                    </div>
                    <div class="purpose">
                        <strong>Purpose:</strong> ${slot.purpose}
                    </div>
                    <div class="slot-meta">
                        <span class="participants">${slot.participants} participants</span>
                        <span class="reservation-status ${slot.status}">
                            ${slot.status === 'approved' ? 'Approved' : 'Pending'}
                        </span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
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

function clearTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');
    if (timeSlotsContainer) {
        timeSlotsContainer.remove();
    }
}

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
/**
 * this is for page navigations bc wala pang authentication sa buong project na to
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('navigation.js loaded!');
    
    // Debug: Check if nav buttons exist
    const navButtons = document.querySelectorAll('.nav-btn');
    console.log('Found nav buttons:', navButtons.length);
    
    navButtons.forEach(button => {
        console.log('Button:', button.textContent.trim(), 'data-page:', button.getAttribute('data-page'));
    });
    
    if (typeof initUserTypeSelection === 'function') {
        initUserTypeSelection();
    }
    
    if (document.querySelector('.nav-btn')) {
        console.log('Initializing dashboard navigation...');
        initDashboardNavigation();
    } else {
        console.log('No nav buttons found!');
    }
    
    //from index.html to registration.html
    const registerLink = document.getElementById('registerLink');
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/html/registration.html';
        });
    }
    
    //from registration.html to index.html
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/html/index.html';
        });
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    const loginButton = document.querySelector('.login-button');
    if (loginButton && !loginButton.closest('#registerForm')) {
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    //from registration.html to index.html (after registration)
    const registerButton = document.querySelector('#registerForm .login-button');
    if (registerButton) {
        registerButton.addEventListener('click', function(e) {
            e.preventDefault();
            handleRegistration();
        });
    }
    
    initEditReservationButtons();
    
    initLogoutFunctionality();
});

function handleRegistration() {
    const userType = document.getElementById('userType')?.value || 'student';
    
    localStorage.setItem('userType', userType);
    
    console.log('Registration successful - User type:', userType);
    
    alert('Registration successful! Please login with your credentials.');
    window.location.href = '../html/index.html';
}

//login from index.html
function handleLogin() {
    const userType = localStorage.getItem('userType') || 'student';
    console.log('Login attempt - User type:', userType);
    
    //ifno user type is set (first time user), default to student
    if (!localStorage.getItem('userType')) {
        localStorage.setItem('userType', 'student');
    }
    
    redirectToAppropriateDashboard();
}

//go to appropriate dashboard based on user type
function redirectToAppropriateDashboard() {
    //get user type from localStorage (set during registration)
    const userType = localStorage.getItem('userType') || 'student';
    
    console.log('User type:', userType);
    
    if (userType === 'faculty') {
        window.location.href = '/html/faculty/facultyDashboard.html';
    } else if (userType === 'student') {
        window.location.href = '/html/user/dashboard.html';
    } else if (userType === 'supervisor') {
        window.location.href = '/html/trilSupervisor/supervisorDashboard.html';
    } else {
        // Default fallback for any unknown user type
        window.location.href = '/html/user/dashboard.html';
    }
}

//go to appropriate viewRooms based on user type
function redirectToAppropriateViewRooms() {
    //get user type from localStorage (set during registration)
    const userType = localStorage.getItem('userType') || 'student';
    
    console.log('User type:', userType);
    
    if (userType === 'faculty') {
        window.location.href = '/html/faculty/facultyViewRooms.html';
    } else if (userType === 'supervisor') {
        window.location.href = '/html/trilSupervisor/supervisorViewRooms.html';
    } else {
        window.location.href = '/html/user/viewRooms.html';
    }
}

//buttons in registration.html
function initUserTypeSelection() {
    const userTypeButtons = document.querySelectorAll('.user-type-btn');
    const userTypeInput = document.getElementById('userType');
    
    if (userTypeButtons.length > 0) {
        userTypeButtons.forEach(button => {
            button.addEventListener('click', function() {
                userTypeButtons.forEach(btn => btn.classList.remove('active'));
                
                this.classList.add('active');
                
                const userType = this.getAttribute('data-type');
                userTypeInput.value = userType;
                
                console.log('User type selected:', userType);
            });
        });
    }
}

function initDashboardNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    console.log('initDashboardNavigation called, buttons found:', navButtons.length);
    
    if (navButtons.length > 0) {
        navButtons.forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
        
        document.querySelectorAll('.nav-btn').forEach(button => {
            button.addEventListener('click', function() {
                console.log('Button clicked:', this.textContent.trim());
                
                navButtons.forEach(btn => btn.classList.remove('active'));
                
                this.classList.add('active');
                
                const page = this.getAttribute('data-page');
                console.log('Navigating to:', page);
                
                // Get user type once at the beginning
                const userType = localStorage.getItem('userType') || 'student';
                
                switch(page) {
                    case 'dashboard':
                        redirectToAppropriateDashboard();
                        break;
                    case 'viewRooms':
                        redirectToAppropriateViewRooms();
                        break;
                    case 'reservation':
                        if (userType === 'faculty' || userType === 'supervisor') {
                            alert('Faculty members and TRIL supervisors cannot make reservations. Redirecting to dashboard.');
                            redirectToAppropriateDashboard();
                        } else {
                            window.location.href = '/html/user/reservation.html';
                        }
                        break;
                    default:
                        console.log('Unknown page:', page);
                }
            });
        });
    }
}

function initEditReservationButtons() {
    window.editReservation = function(reservationId) {
        window.location.href = `/html/user/editReservation.html?id=${reservationId}`;
    };
}

//logout functionality
function initLogoutFunctionality() {
    const profileIcon = document.getElementById('profileIcon');
    const dropdownContent = document.getElementById('dropdownContent');
    const logoutBtn = document.getElementById('logoutBtn');
    
    //when profile icon is clicked, logout button will appear
    if (profileIcon && dropdownContent) {
        profileIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            const profileDropdown = this.closest('.profile-dropdown');
            profileDropdown.classList.toggle('active');
        });
    }
    
    document.addEventListener('click', function(e) {
        const profileDropdowns = document.querySelectorAll('.profile-dropdown');
        profileDropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });
    
    //logout button click
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (confirm('Are you sure you want to logout?')) {
                console.log('Logging out...');
                window.location.href = '../index.html';
            }
            
            const profileDropdown = this.closest('.profile-dropdown');
            if (profileDropdown) {
                profileDropdown.classList.remove('active');
            }
        });
    }
}
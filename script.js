

// Mock movie database - contains all available movies
const moviesDatabase = [
    {
        id: 1,
        title: "Avengers: Endgame",
        genre: "Action/Sci-Fi",
        duration: "181 min",
        price: 12,
        poster: "🦸",
        showtimes: ["10:00 AM", "2:00 PM", "6:00 PM", "9:30 PM"]
    },
    {
        id: 2,
        title: "Barbie",
        genre: "Comedy/Fantasy",
        duration: "114 min",
        price: 10,
        poster: "💖",
        showtimes: ["11:00 AM", "3:00 PM", "7:00 PM", "10:00 PM"]
    },
    {
        id: 3,
        title: "Oppenheimer",
        genre: "Biography/Drama",
        duration: "180 min",
        price: 13,
        poster: "💣",
        showtimes: ["10:30 AM", "2:30 PM", "6:30 PM", "9:00 PM"]
    },
    {
        id: 4,
        title: "The Batman",
        genre: "Action/Crime",
        duration: "176 min",
        price: 12,
        poster: "🦇",
        showtimes: ["11:30 AM", "3:30 PM", "7:30 PM", "10:30 PM"]
    },
    {
        id: 5,
        title: "Dune: Part Two",
        genre: "Sci-Fi/Adventure",
        duration: "166 min",
        price: 14,
        poster: "🏜️",
        showtimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"]
    },
    {
        id: 6,
        title: "Interstellar",
        genre: "Sci-Fi/Drama",
        duration: "169 min",
        price: 11,
        poster: "🚀",
        showtimes: ["9:00 AM", "1:00 PM", "5:30 PM", "9:00 PM"]
    }
];

// ==================== STATE MANAGEMENT ====================

// Application state - this is our single source of truth
const appState = {
    selectedMovie: null,
    selectedShowtime: null,
    selectedSeats: [], // Array of seat objects {row, number}
    customerInfo: {
        name: '',
        email: '',
        phone: ''
    },
    totalSeats: 0,
    totalPrice: 0
};

// Cinema configuration
const CINEMA_CONFIG = {
    rows: 8, // A to H
    seatsPerRow: 12,
    occupiedPercentage: 0.3 // 30% of seats will be randomly occupied
};

// ==================== UTILITY FUNCTIONS ====================

// Switch between sections (SPA navigation)
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Generate random occupied seats
function generateOccupiedSeats() {
    const totalSeats = CINEMA_CONFIG.rows * CINEMA_CONFIG.seatsPerRow;
    const occupiedCount = Math.floor(totalSeats * CINEMA_CONFIG.occupiedPercentage);
    const occupiedSeats = new Set();
    
    while (occupiedSeats.size < occupiedCount) {
        const row = Math.floor(Math.random() * CINEMA_CONFIG.rows);
        const seatNum = Math.floor(Math.random() * CINEMA_CONFIG.seatsPerRow);
        occupiedSeats.add(`${row}-${seatNum}`);
    }
    
    return occupiedSeats;
}

// Email validation using regex
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation - accepts various formats
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Format seat identifier for display (e.g., "A4", "B7")
function formatSeatLabel(rowIndex, seatNumber) {
    const rowLetter = String.fromCharCode(65 + rowIndex); // 65 is 'A' in ASCII
    return `${rowLetter}${seatNumber + 1}`;
}

// ==================== RENDERING FUNCTIONS ====================

// Render movie cards in the home section
function renderMovies() {
    const movieGrid = document.getElementById('movieGrid');
    movieGrid.innerHTML = '';
    
    moviesDatabase.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <div class="movie-poster">${movie.poster}</div>
            <div class="movie-details">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span>${movie.genre}</span>
                    <span>${movie.duration}</span>
                </div>
                <div class="movie-price">$${movie.price} / ticket</div>
                <select class="showtime-select" data-movie-id="${movie.id}">
                    <option value="">Select Showtime</option>
                    ${movie.showtimes.map(time => 
                        `<option value="${time}">${time}</option>`
                    ).join('')}
                </select>
                <button class="btn-select" data-movie-id="${movie.id}">Select This Movie</button>
            </div>
        `;
        movieGrid.appendChild(movieCard);
    });
    
    // Add event listeners to all select buttons
    document.querySelectorAll('.btn-select').forEach(button => {
        button.addEventListener('click', handleMovieSelection);
    });
}

// Render the cinema seat grid
function renderSeats() {
    const seatsGrid = document.getElementById('seatsGrid');
    seatsGrid.innerHTML = '';
    
    const occupiedSeats = generateOccupiedSeats();
    
    // Create rows from A to H
    for (let rowIndex = 0; rowIndex < CINEMA_CONFIG.rows; rowIndex++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        
        // Add row label (A, B, C, etc.)
        const rowLabel = document.createElement('div');
        rowLabel.className = 'row-label';
        rowLabel.textContent = String.fromCharCode(65 + rowIndex);
        rowDiv.appendChild(rowLabel);
        
        // Create seats for this row
        for (let seatNum = 0; seatNum < CINEMA_CONFIG.seatsPerRow; seatNum++) {
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.dataset.row = rowIndex;
            seat.dataset.seat = seatNum;
            
            // Check if this seat is occupied
            const seatId = `${rowIndex}-${seatNum}`;
            if (occupiedSeats.has(seatId)) {
                seat.classList.add('occupied');
            } else {
                seat.classList.add('available');
                // Add click handler only for available seats
                seat.addEventListener('click', handleSeatClick);
            }
            
            rowDiv.appendChild(seat);
        }
        
        seatsGrid.appendChild(rowDiv);
    }
}

// Update selected movie information display
function renderSelectedMovieInfo() {
    const movieInfo = document.getElementById('selectedMovieInfo');
    const movie = appState.selectedMovie;
    
    movieInfo.innerHTML = `
        <h3>${movie.title}</h3>
        <p><strong>Genre:</strong> ${movie.genre} | <strong>Duration:</strong> ${movie.duration}</p>
        <p><strong>Showtime:</strong> ${appState.selectedShowtime} | <strong>Price:</strong> $${movie.price} per ticket</p>
    `;
}

// Update booking summary (seats count and total price)
function updateBookingSummary() {
    document.getElementById('seatsCount').textContent = appState.totalSeats;
    document.getElementById('totalPrice').textContent = `$${appState.totalPrice}`;
}

// Render confirmation ticket details
function renderConfirmation() {
    const ticketDetails = document.getElementById('ticketDetails');
    const movie = appState.selectedMovie;
    
    // Format selected seats for display
    const seatsList = appState.selectedSeats
        .map(seat => formatSeatLabel(seat.row, seat.number))
        .join(', ');
    
    ticketDetails.innerHTML = `
        <div class="ticket-detail">
            <span class="ticket-detail-label">Name:</span>
            <span class="ticket-detail-value">${appState.customerInfo.name}</span>
        </div>
        <div class="ticket-detail">
            <span class="ticket-detail-label">Movie:</span>
            <span class="ticket-detail-value">${movie.title}</span>
        </div>
        <div class="ticket-detail">
            <span class="ticket-detail-label">Showtime:</span>
            <span class="ticket-detail-value">${appState.selectedShowtime}</span>
        </div>
        <div class="ticket-detail">
            <span class="ticket-detail-label">Seats:</span>
            <span class="ticket-detail-value">${seatsList}</span>
        </div>
        <div class="ticket-detail">
            <span class="ticket-detail-label">Number of Tickets:</span>
            <span class="ticket-detail-value">${appState.totalSeats}</span>
        </div>
        <div class="ticket-detail">
            <span class="ticket-detail-label">Total Amount:</span>
            <span class="ticket-detail-value">$${appState.totalPrice}</span>
        </div>
    `;
}

// ==================== EVENT HANDLERS ====================

// Handle movie selection and navigation to seat selection
function handleMovieSelection(event) {
    const movieId = parseInt(event.target.dataset.movieId);
    const movie = moviesDatabase.find(m => m.id === movieId);
    
    // Get selected showtime from the dropdown
    const showtimeSelect = document.querySelector(
        `.showtime-select[data-movie-id="${movieId}"]`
    );
    const selectedShowtime = showtimeSelect.value;
    
    // Validate showtime selection
    if (!selectedShowtime) {
        alert('Please select a showtime first!');
        return;
    }
    
    // Update application state
    appState.selectedMovie = movie;
    appState.selectedShowtime = selectedShowtime;
    appState.selectedSeats = [];
    appState.totalSeats = 0;
    appState.totalPrice = 0;
    
    // Render seat selection screen
    renderSelectedMovieInfo();
    renderSeats();
    updateBookingSummary();
    
    // Navigate to seat selection section
    showSection('seatSelection');
}

// Handle seat click - toggle seat selection state
function handleSeatClick(event) {
    const seat = event.target;
    
    // Ignore if seat is occupied
    if (seat.classList.contains('occupied')) {
        return;
    }
    
    const rowIndex = parseInt(seat.dataset.row);
    const seatNumber = parseInt(seat.dataset.seat);
    
    // Toggle seat selection
    if (seat.classList.contains('selected')) {
        // Deselect seat
        seat.classList.remove('selected');
        seat.classList.add('available');
        
        // Remove from state
        appState.selectedSeats = appState.selectedSeats.filter(
            s => !(s.row === rowIndex && s.number === seatNumber)
        );
    } else {
        // Select seat
        seat.classList.remove('available');
        seat.classList.add('selected');
        
        // Add to state
        appState.selectedSeats.push({ row: rowIndex, number: seatNumber });
    }
    
    // Update totals
    appState.totalSeats = appState.selectedSeats.length;
    appState.totalPrice = appState.totalSeats * appState.selectedMovie.price;
    
    // Update UI
    updateBookingSummary();
    validateForm();
}

// Real-time form validation
function validateForm() {
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const phoneInput = document.getElementById('userPhone');
    const bookNowBtn = document.getElementById('bookNowBtn');
    
    // Validate name
    const nameValid = nameInput.value.trim().length >= 2;
    
    // Validate email
    const emailValid = isValidEmail(emailInput.value.trim());
    
    // Validate phone
    const phoneValid = isValidPhone(phoneInput.value.trim());
    
    // Check if at least one seat is selected
    const seatsSelected = appState.totalSeats > 0;
    
    // Enable button only if all validations pass
    const allValid = nameValid && emailValid && phoneValid && seatsSelected;
    bookNowBtn.disabled = !allValid;
    
    return allValid;
}

// Handle form input changes for real-time validation
function handleFormInput(event) {
    const input = event.target;
    const errorElement = document.getElementById(`${input.id.replace('user', '').toLowerCase()}Error`);
    
    let isValid = false;
    let errorMessage = '';
    
    switch (input.id) {
        case 'userName':
            isValid = input.value.trim().length >= 2;
            errorMessage = isValid ? '' : 'Name must be at least 2 characters';
            break;
        case 'userEmail':
            isValid = isValidEmail(input.value.trim());
            errorMessage = isValid ? '' : 'Please enter a valid email address';
            break;
        case 'userPhone':
            isValid = isValidPhone(input.value.trim());
            errorMessage = isValid ? '' : 'Please enter a valid phone number';
            break;
    }
    
    // Update UI feedback
    if (input.value.trim() !== '') {
        if (isValid) {
            input.classList.remove('invalid');
        } else {
            input.classList.add('invalid');
        }
        errorElement.textContent = errorMessage;
    } else {
        input.classList.remove('invalid');
        errorElement.textContent = '';
    }
    
    // Revalidate entire form
    validateForm();
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Final validation
    if (!validateForm()) {
        alert('Please fill in all required fields correctly and select at least one seat.');
        return;
    }
    
    // Save customer info to state
    appState.customerInfo.name = document.getElementById('userName').value.trim();
    appState.customerInfo.email = document.getElementById('userEmail').value.trim();
    appState.customerInfo.phone = document.getElementById('userPhone').value.trim();
    
    // Show confirmation
    renderConfirmation();
    showSection('confirmation');
}

// Reset application to initial state
function resetApp() {
    // Clear state
    appState.selectedMovie = null;
    appState.selectedShowtime = null;
    appState.selectedSeats = [];
    appState.totalSeats = 0;
    appState.totalPrice = 0;
    appState.customerInfo = { name: '', email: '', phone: '' };
    
    // Clear form
    document.getElementById('bookingForm').reset();
    
    // Clear error messages
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input').forEach(input => input.classList.remove('invalid'));
    
    // Reset showtime dropdowns
    document.querySelectorAll('.showtime-select').forEach(select => select.value = '');
    
    // Show home section
    showSection('movieSelection');
}

// ==================== INITIALIZATION ====================

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Render initial movie list
    renderMovies();
    
    // Set up navigation event listeners
    document.getElementById('backToMovies').addEventListener('click', resetApp);
    document.getElementById('bookAnotherBtn').addEventListener('click', resetApp);
    
    // Set up form event listeners
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time form validation
    ['userName', 'userEmail', 'userPhone'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('input', handleFormInput);
        field.addEventListener('blur', handleFormInput);
    });
    
    console.log('🎬 CineBook initialized successfully!');
});
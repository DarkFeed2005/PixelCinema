// Hero Slider Images
const heroSlides = [
    {
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=600&fit=crop',
        title: 'Welcome to PIXELCINEMA',
        description: 'Book your favorite movies with just a few clicks'
    },
    {
        image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=600&fit=crop',
        title: 'Experience Cinema Magic',
        description: 'Premium seats, stunning visuals, unforgettable moments'
    },
    {
        image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1920&h=600&fit=crop',
        title: 'Now Showing',
        description: 'Latest blockbusters and timeless classics'
    }
];

// Mock movies database with LKR prices and local poster images
const moviesDatabase = [
    {
        id: 1,
        title: "Avatar: Fire and Ash",
        genre: "Action/Sci-Fi",
        duration: "197 min",
        price: 1200,
        poster: "assets/Avatar_Fire_and_Ash_poster.jpeg", 
        showtimes: ["10:00 AM", "2:00 PM", "6:00 PM", "9:30 PM"]
    },
    {
        id: 2,
        title: "Black Phone 2",
        genre: "Supernatural Horror",
        duration: "114 min",
        price: 1000,
        poster: "assets/Black_Phone_2_poster.jpg", 
        showtimes: ["11:00 AM", "3:00 PM", "7:00 PM", "10:00 PM"]
    },
    {
        id: 3,
        title: "F1: The Movie",
        genre: "sports drama",
        duration: "155 min",
        price: 1300,
        poster: "assets/F1_(2025_film).png", 
        showtimes: ["10:30 AM", "2:30 PM", "6:30 PM", "9:00 PM"]
    },
    {
        id: 4,
        title: "Love Aaj Kal (2020)",
        genre: "Romantic Drama",
        duration: "141 min",
        price: 1200,
        poster: "assets/Love_Aaj_Kal_film_poster.jpg", 
        showtimes: ["11:30 AM", "3:30 PM", "7:30 PM", "10:30 PM"]
    },
    {
        id: 5,
        title: "Neera: The Movie",
        genre: "Drama",
        duration: "130 min",
        price: 1400,
        poster: "assets/Neera_film_poster.jpg", 
        showtimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"]
    },
    {
        id: 6,
        title: "Sisu",
        genre: "Action/Adventure",
        duration: "102 min",
        price: 1100,
        poster: "assets/Sisu_ver2.png", 
        showtimes: ["9:00 AM", "1:00 PM", "5:30 PM", "9:00 PM"]
    },
    {
        id: 7,
        title: "Zootopia 2",
        genre: "Animation/Adventure",
        duration: "104 min",
        price: 1150,
        poster: "assets/Zootopia_2_(2025_film).jpg", 
        showtimes: ["10:30 AM", "2:00 PM", "6:00 PM", "9:30 PM"]
    },
    {
        id: 8,
        title: "The Conjuring – Last Rites",
        genre: "Horror",
        duration: "112 min",
        price: 1250,
        poster: "assets/The_Conjuring_–_Last_Rites.jpg", 
        showtimes: ["11:00 AM", "2:30 PM", "6:30 PM", "10:00 PM"]
    }
    {
        id: 9,
        title: "The Housemaid",
        genre: "Thriller",
        duration: "131 min",
        price: 1300,
        poster: "assets/The_Conjuring_–_Last_Rites.jpg", 
        showtimes: ["10:30 AM", "2:30 PM", "6:00 PM", "10:30 PM"]
    }
];

// ==================== STATE MANAGEMENT ====================

const appState = {
    selectedMovie: null,
    selectedShowtime: null,
    selectedSeats: [],
    customerInfo: { name: '', email: '', phone: '' },
    totalSeats: 0,
    totalPrice: 0
};

const CINEMA_CONFIG = {
    rows: 8,
    seatsPerRow: 12,
    occupiedPercentage: 0.3
};

// Slider state
let currentSlide = 0;
let sliderInterval;

// ==================== NAVIGATION & UI FUNCTIONS ====================

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Toggle mobile menu
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

// Navigation functions
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Close mobile menu if open
    document.getElementById('navMenu').classList.remove('active');
}

function navigateToHome(e) {
    e.preventDefault();
    showSection('homeSection');
}

function showAboutSection(e) {
    e.preventDefault();
    showSection('aboutSection');
}

function showMoviesSection(e) {
    e.preventDefault();
    renderMovies(document.getElementById('movieGridFull'));
    showSection('moviesSection');
}

function showSignup() {
    alert('Sign Up functionality would open a registration modal/page. This is a demo.');
}

// ==================== HERO SLIDER ====================

function initSlider() {
    const container = document.getElementById('sliderContainer');
    const dotsContainer = document.getElementById('sliderDots');
    
    heroSlides.forEach((slide, index) => {
        // Create slide
        const slideDiv = document.createElement('div');
        slideDiv.className = `slide ${index === 0 ? 'active' : ''}`;
        slideDiv.innerHTML = `
            <img src="${slide.image}" alt="${slide.title}" class="slide-image">
            <div class="slide-content">
                <h1 class="slide-title">${slide.title}</h1>
                <p class="slide-description">${slide.description}</p>
                <a href="#" class="btn-hero" onclick="showMoviesSection(event)">Browse Movies</a>
            </div>
        `;
        container.appendChild(slideDiv);
        
        // Create dot
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });
    
    startSlider();
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + direction + heroSlides.length) % heroSlides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function startSlider() {
    sliderInterval = setInterval(() => changeSlide(1), 5000);
}

// Stop slider when user interacts
document.addEventListener('DOMContentLoaded', function() {
    const sliderArrows = document.querySelectorAll('.slider-arrow');
    sliderArrows.forEach(arrow => {
        arrow.addEventListener('click', function() {
            clearInterval(sliderInterval);
            startSlider();
        });
    });
});

// ==================== AJAX SEAT FETCHING ====================

// Simulate AJAX call to fetch seat availability
function fetchSeatAvailability(movieId, showtime) {
    return new Promise((resolve, reject) => {
        // Show loading indicator
        document.getElementById('loadingSeats').style.display = 'block';
        document.getElementById('cinemaContainer').style.display = 'none';
        
        // Simulate API delay (500-1500ms)
        const delay = 500 + Math.random() * 1000;
        
        setTimeout(() => {
            try {
                // Simulate JSON response from server
                const seatData = {
                    success: true,
                    movieId: movieId,
                    showtime: showtime,
                    totalSeats: CINEMA_CONFIG.rows * CINEMA_CONFIG.seatsPerRow,
                    occupiedSeats: generateOccupiedSeats(),
                    timestamp: new Date().toISOString()
                };
                
                console.log('AJAX Response:', JSON.stringify(seatData, null, 2));
                resolve(seatData);
            } catch (error) {
                reject(error);
            }
        }, delay);
    });
}

function generateOccupiedSeats() {
    const totalSeats = CINEMA_CONFIG.rows * CINEMA_CONFIG.seatsPerRow;
    const occupiedCount = Math.floor(totalSeats * CINEMA_CONFIG.occupiedPercentage);
    const occupiedSeats = [];
    const occupiedSet = new Set();
    
    while (occupiedSet.size < occupiedCount) {
        const row = Math.floor(Math.random() * CINEMA_CONFIG.rows);
        const seatNum = Math.floor(Math.random() * CINEMA_CONFIG.seatsPerRow);
        const seatId = `${row}-${seatNum}`;
        if (!occupiedSet.has(seatId)) {
            occupiedSet.add(seatId);
            occupiedSeats.push({ row, seat: seatNum });
        }
    }
    
    return occupiedSeats;
}

// ==================== UTILITY FUNCTIONS ====================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function formatSeatLabel(rowIndex, seatNumber) {
    const rowLetter = String.fromCharCode(65 + rowIndex);
    return `${rowLetter}${seatNumber + 1}`;
}

function formatCurrency(amount) {
    return `LKR ${amount.toLocaleString()}`;
}

// ==================== RENDERING FUNCTIONS ====================

function renderMovies(container = document.getElementById('movieGrid')) {
    container.innerHTML = '';
    
    moviesDatabase.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <div class="movie-poster">
                <img src="${movie.poster}" alt="${movie.title}" 
                     onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22600%22%3E%3Crect width=%22400%22 height=%22600%22 fill=%22%231a1a2e%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2224%22 fill=%22%23e94560%22%3E${movie.title}%3C/text%3E%3C/svg%3E';">
            </div>
            <div class="movie-details">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span>${movie.genre}</span>
                    <span>${movie.duration}</span>
                </div>
                <div class="movie-price">${formatCurrency(movie.price)} / ticket</div>
                <select class="showtime-select" data-movie-id="${movie.id}">
                    <option value="">Select Showtime</option>
                    ${movie.showtimes.map(time => 
                        `<option value="${time}">${time}</option>`
                    ).join('')}
                </select>
                <button class="btn-select" data-movie-id="${movie.id}">Select This Movie</button>
            </div>
        `;
        container.appendChild(movieCard);
    });
    
    document.querySelectorAll('.btn-select').forEach(button => {
        button.addEventListener('click', handleMovieSelection);
    });
}

function renderSeats(occupiedSeatsData) {
    const seatsGrid = document.getElementById('seatsGrid');
    seatsGrid.innerHTML = '';
    
    const occupiedSet = new Set(
        occupiedSeatsData.map(seat => `${seat.row}-${seat.seat}`)
    );
    
    for (let rowIndex = 0; rowIndex < CINEMA_CONFIG.rows; rowIndex++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        
        const rowLabel = document.createElement('div');
        rowLabel.className = 'row-label';
        rowLabel.textContent = String.fromCharCode(65 + rowIndex);
        rowDiv.appendChild(rowLabel);
        
        for (let seatNum = 0; seatNum < CINEMA_CONFIG.seatsPerRow; seatNum++) {
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.dataset.row = rowIndex;
            seat.dataset.seat = seatNum;
            
            const seatId = `${rowIndex}-${seatNum}`;
            if (occupiedSet.has(seatId)) {
                seat.classList.add('occupied');
            } else {
                seat.classList.add('available');
                seat.addEventListener('click', handleSeatClick);
            }
            
            rowDiv.appendChild(seat);
        }
        
        seatsGrid.appendChild(rowDiv);
    }
    
    // Hide loading, show cinema
    document.getElementById('loadingSeats').style.display = 'none';
    document.getElementById('cinemaContainer').style.display = 'block';
}

function renderSelectedMovieInfo() {
    const movieInfo = document.getElementById('selectedMovieInfo');
    const movie = appState.selectedMovie;
    
    movieInfo.innerHTML = `
        <h3>${movie.title}</h3>
        <p><strong>Genre:</strong> ${movie.genre} | <strong>Duration:</strong> ${movie.duration}</p>
        <p><strong>Showtime:</strong> ${appState.selectedShowtime} | <strong>Price:</strong> ${formatCurrency(movie.price)} per ticket</p>
    `;
}

function updateBookingSummary() {
    document.getElementById('seatsCount').textContent = appState.totalSeats;
    document.getElementById('totalPrice').textContent = formatCurrency(appState.totalPrice);
}

function renderConfirmation() {
    const ticketDetails = document.getElementById('ticketDetails');
    const movie = appState.selectedMovie;
    
    const seatsList = appState.selectedSeats
        .map(seat => formatSeatLabel(seat.row, seat.number))
        .join(', ');
    
    const bookingId = 'CB' + Date.now().toString().slice(-8);
    
    ticketDetails.innerHTML = `
        <div class="ticket-detail">
            <span class="ticket-detail-label">Booking ID:</span>
            <span class="ticket-detail-value">${bookingId}</span>
        </div>
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
            <span class="ticket-detail-value">${formatCurrency(appState.totalPrice)}</span>
        </div>
    `;
    
    // Generate QR Code
    generateQRCode(bookingId, movie.title, seatsList);
}

function generateQRCode(bookingId, movieTitle, seats) {
    const qrContainer = document.getElementById('ticketQR');
    qrContainer.innerHTML = '';
    
    const qrData = JSON.stringify({
        bookingId: bookingId,
        movie: movieTitle,
        seats: seats,
        customer: appState.customerInfo.name,
        timestamp: new Date().toISOString()
    });
    
    new QRCode(qrContainer, {
        text: qrData,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

// ==================== EVENT HANDLERS ====================

async function handleMovieSelection(event) {
    const movieId = parseInt(event.target.dataset.movieId);
    const movie = moviesDatabase.find(m => m.id === movieId);
    
    const showtimeSelect = document.querySelector(
        `.showtime-select[data-movie-id="${movieId}"]`
    );
    const selectedShowtime = showtimeSelect.value;
    
    if (!selectedShowtime) {
        alert('Please select a showtime first!');
        return;
    }
    
    appState.selectedMovie = movie;
    appState.selectedShowtime = selectedShowtime;
    appState.selectedSeats = [];
    appState.totalSeats = 0;
    appState.totalPrice = 0;
    
    renderSelectedMovieInfo();
    updateBookingSummary();
    showSection('seatSelection');
    
    // Fetch seats via AJAX
    try {
        const seatData = await fetchSeatAvailability(movieId, selectedShowtime);
        console.log('✅ Seat data loaded successfully');
        renderSeats(seatData.occupiedSeats);
    } catch (error) {
        console.error('❌ Error loading seats:', error);
        alert('Failed to load seat availability. Please try again.');
        showSection('homeSection');
    }
}

function handleSeatClick(event) {
    const seat = event.target;
    
    if (seat.classList.contains('occupied')) {
        return;
    }
    
    const rowIndex = parseInt(seat.dataset.row);
    const seatNumber = parseInt(seat.dataset.seat);
    
    if (seat.classList.contains('selected')) {
        seat.classList.remove('selected');
        seat.classList.add('available');
        
        appState.selectedSeats = appState.selectedSeats.filter(
            s => !(s.row === rowIndex && s.number === seatNumber)
        );
    } else {
        seat.classList.remove('available');
        seat.classList.add('selected');
        
        appState.selectedSeats.push({ row: rowIndex, number: seatNumber });
    }
    
    appState.totalSeats = appState.selectedSeats.length;
    appState.totalPrice = appState.totalSeats * appState.selectedMovie.price;
    
    updateBookingSummary();
    validateForm();
}

function validateForm() {
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const phoneInput = document.getElementById('userPhone');
    const bookNowBtn = document.getElementById('bookNowBtn');
    
    const nameValid = nameInput.value.trim().length >= 2;
    const emailValid = isValidEmail(emailInput.value.trim());
    const phoneValid = isValidPhone(phoneInput.value.trim());
    const seatsSelected = appState.totalSeats > 0;
    
    const allValid = nameValid && emailValid && phoneValid && seatsSelected;
    bookNowBtn.disabled = !allValid;
    
    return allValid;
}

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
    
    validateForm();
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        alert('Please fill in all required fields correctly and select at least one seat.');
        return;
    }
    
    appState.customerInfo.name = document.getElementById('userName').value.trim();
    appState.customerInfo.email = document.getElementById('userEmail').value.trim();
    appState.customerInfo.phone = document.getElementById('userPhone').value.trim();
    
    renderConfirmation();
    showSection('confirmation');
}

// Download ticket as image
function downloadTicket() {
    const ticketCard = document.getElementById('ticketCard');
    
    // Use html2canvas library would be ideal, but for this demo:
    alert('Ticket download feature activated! In a production app, this would generate a PDF or image of your ticket.');
    
    // Log ticket data as JSON
    const ticketData = {
        bookingId: 'CB' + Date.now().toString().slice(-8),
        movie: appState.selectedMovie.title,
        showtime: appState.selectedShowtime,
        seats: appState.selectedSeats.map(s => formatSeatLabel(s.row, s.number)),
        customer: appState.customerInfo,
        totalAmount: appState.totalPrice,
        currency: 'LKR'
    };
    
    console.log('Ticket Data (JSON):', JSON.stringify(ticketData, null, 2));
}

function resetApp() {
    appState.selectedMovie = null;
    appState.selectedShowtime = null;
    appState.selectedSeats = [];
    appState.totalSeats = 0;
    appState.totalPrice = 0;
    appState.customerInfo = { name: '', email: '', phone: '' };
    
    document.getElementById('bookingForm').reset();
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input').forEach(input => input.classList.remove('invalid'));
    document.querySelectorAll('.showtime-select').forEach(select => select.value = '');
    
    showSection('homeSection');
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach(card => {
        const title = card.querySelector('.movie-title').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero slider
    initSlider();
    
    // Render initial movie list
    renderMovies();
    
    // Set up navigation event listeners
    document.getElementById('backToMovies').addEventListener('click', resetApp);
    document.getElementById('bookAnotherBtn').addEventListener('click', resetApp);
    document.getElementById('downloadTicketBtn').addEventListener('click', downloadTicket);
    
    // Set up form event listeners
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time form validation
    ['userName', 'userEmail', 'userPhone'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('input', handleFormInput);
        field.addEventListener('blur', handleFormInput);
    });
    
    console.log('🎬 PIXELCINEMA Enhanced System Initialized!');
    console.log('✅ Features: Glass Navigation, Hero Slider, AJAX Seat Loading, QR Codes, LKR Currency');
});

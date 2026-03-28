// ========================================
// API CONFIGURATION
// ========================================
// IMPORTANT: Get your free API key from https://www.weatherapi.com/signup.aspx
const apiKey = "6d75e299b94946c8881145135251111"; // Your WeatherAPI key
const weatherApiUrl = "https://api.weatherapi.com/v1/current.json";

// Global variable to track time update interval
let timeUpdateInterval = null;

// ========================================
// DOM ELEMENTS
// ========================================
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const errorToast = document.getElementById('errorToast');
const errorMessage = document.getElementById('errorMessage');
const loadingSkeleton = document.getElementById('loadingSkeleton');
const weatherContainer = document.getElementById('weatherContainer');
const particles = document.getElementById('particles');

// Weather Data Elements
const cityName = document.getElementById('cityName');
const localTime = document.getElementById('localTime');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weatherDescription');
const weatherIcon = document.getElementById('weatherIcon');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const windDirection = document.getElementById('windDirection');
const windDeg = document.getElementById('windDeg');
const aqiValue = document.getElementById('aqiValue');
const aqiLabel = document.getElementById('aqiLabel');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const uvIndex = document.getElementById('uvIndex');
const uvLabel = document.getElementById('uvLabel');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const lastUpdated = document.getElementById('lastUpdated');

// Progress Elements
const feelsLikeBar = document.getElementById('feelsLikeBar');
const humidityCircle = document.getElementById('humidityCircle');
const pressureBar = document.getElementById('pressureBar');
const visibilityBar = document.getElementById('visibilityBar');
const aqiIndicator = document.getElementById('aqiIndicator');
const uvNeedle = document.getElementById('uvNeedle');

// ========================================
// EVENT LISTENERS
// ========================================
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});
locationBtn.addEventListener('click', handleGeolocation);

// Add ripple effect to search button
searchBtn.addEventListener('click', createRipple);

// ========================================
// MAIN FUNCTIONS
// ========================================

/**
 * Handle search button click
 */
function handleSearch() {
    const city = cityInput.value.trim();
    if (city === '') {
        showError('Please enter a city name');
        return;
    }
    fetchWeatherData(city);
}

/**
 * Handle geolocation button click
 */
function handleGeolocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    showLoading();
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
            hideLoading();
            showError('Unable to retrieve your location');
        }
    );
}

/**
 * Fetch weather data by city name
 */
async function fetchWeatherData(city) {
    // Check if API key is set
    if (apiKey === "YOUR_API_KEY_HERE" || !apiKey) {
        showError('Please set your WeatherAPI key in script.js');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(
            `${weatherApiUrl}?key=${apiKey}&q=${city}&aqi=yes`
        );
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        displayWeatherData(data);
        hideLoading();
    } catch (error) {
        hideLoading();
        console.error('Weather fetch error:', error);
        if (error.message === 'City not found') {
            showError('City not found. Please check the spelling and try again.');
        } else if (error.message.includes('401') || error.message.includes('403')) {
            showError('Invalid API key. Please check your WeatherAPI key.');
        } else {
            showError(error.message || 'Failed to fetch weather data. Please try again.');
        }
    }
}

/**
 * Fetch weather data by coordinates
 */
async function fetchWeatherByCoords(lat, lon) {
    // Check if API key is set
    if (apiKey === "YOUR_API_KEY_HERE" || !apiKey) {
        hideLoading();
        showError('Please set your WeatherAPI key in script.js');
        return;
    }
    
    try {
        const response = await fetch(
            `${weatherApiUrl}?key=${apiKey}&q=${lat},${lon}&aqi=yes`
        );
        
        if (!response.ok) {
            throw new Error('Unable to fetch weather data');
        }
        
        const data = await response.json();
        displayWeatherData(data);
        hideLoading();
    } catch (error) {
        hideLoading();
        console.error('Weather fetch error:', error);
        showError(error.message || 'Failed to fetch weather data. Please try again.');
    }
}

/**
 * Display weather data on the page
 */
function displayWeatherData(data) {
    // Extract data from WeatherAPI response
    const { location, current } = data;
    
    // Update location and time
    cityName.textContent = `${location.name}, ${location.country}`;
    
    // Clear previous time update interval if exists
    if (timeUpdateInterval) {
        clearInterval(timeUpdateInterval);
    }
    
    // Update time using location's timezone
    updateLocalTime(location.tz_id, location.localtime);
    timeUpdateInterval = setInterval(() => updateLocalTime(location.tz_id, location.localtime), 1000);
    
    // Update temperature with animation
    animateNumber(temperature, Math.round(current.temp_c), '°');
    animateNumber(feelsLike, Math.round(current.feelslike_c), '°');
    
    // Update weather description and icon
    weatherDescription.textContent = current.condition.text;
    updateWeatherIcon(current.condition.code, current.is_day);
    
    // Update background based on weather
    updateBackground(current.condition.text, current.is_day);
    
    // Update humidity
    animateNumber(humidity, current.humidity, '%');
    animateCircularProgress(humidityCircle, current.humidity);
    
    // Update wind
    windSpeed.textContent = `${current.wind_kph.toFixed(1)} km/h`;
    windDirection.style.transform = `rotate(${current.wind_degree}deg)`;
    windDeg.textContent = `${current.wind_degree}° ${current.wind_dir}`;
    
    // Update AQI (using US EPA index)
    const aqiValue = current.air_quality ? current.air_quality['us-epa-index'] : 1;
    updateAQI(aqiValue);
    
    // Update pressure
    pressure.textContent = `${current.pressure_mb} hPa`;
    animateProgressBar(pressureBar, (current.pressure_mb - 900) / 200 * 100);
    
    // Update visibility
    visibility.textContent = `${current.vis_km} km`;
    animateProgressBar(visibilityBar, Math.min((current.vis_km / 10) * 100, 100));
    
    // Update UV Index (now from actual API data)
    updateUVIndex(current.uv);
    
    // Update sunrise/sunset (note: WeatherAPI free tier requires astronomy endpoint)
    // For now, we'll show placeholder or you can upgrade to get this data
    sunrise.textContent = '--:--';
    sunset.textContent = '--:--';
    
    // Update feels like bar
    animateProgressBar(feelsLikeBar, Math.min((current.feelslike_c + 10) / 50 * 100, 100));
    
    // Update last updated time
    lastUpdated.textContent = `Last updated: ${current.last_updated}`;
    
    // Create weather particles based on condition
    createWeatherParticles(current.condition.text, current.is_day);
}

/**
 * Update local time display
 */
function updateLocalTime(timezoneId, localtimeString) {
    try {
        // Create a date object from the current time
        const now = new Date();
        
        // Format the time using the timezone ID
        const options = { 
            weekday: 'long', 
            hour: 'numeric', 
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: timezoneId
        };
        
        localTime.textContent = now.toLocaleString('en-US', options);
    } catch (error) {
        // Fallback if timezone is invalid
        const now = new Date();
        const options = { 
            weekday: 'long', 
            hour: 'numeric', 
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        localTime.textContent = now.toLocaleString('en-US', options);
    }
}

/**
 * Update weather icon based on WeatherAPI condition code
 */
function updateWeatherIcon(conditionCode, isDay) {
    // WeatherAPI condition codes mapping
    const iconMap = {
        1000: isDay ? 'fa-sun' : 'fa-moon', // Sunny/Clear
        1003: isDay ? 'fa-cloud-sun' : 'fa-cloud-moon', // Partly cloudy
        1006: 'fa-cloud', // Cloudy
        1009: 'fa-cloud', // Overcast
        1030: 'fa-smog', // Mist
        1063: isDay ? 'fa-cloud-sun-rain' : 'fa-cloud-moon-rain', // Patchy rain possible
        1066: 'fa-snowflake', // Patchy snow possible
        1069: 'fa-cloud-meatball', // Patchy sleet possible
        1072: 'fa-icicles', // Patchy freezing drizzle
        1087: 'fa-cloud-bolt', // Thundery outbreaks possible
        1114: 'fa-wind', // Blowing snow
        1117: 'fa-wind', // Blizzard
        1135: 'fa-smog', // Fog
        1147: 'fa-smog', // Freezing fog
        1150: 'fa-cloud-rain', // Patchy light drizzle
        1153: 'fa-cloud-rain', // Light drizzle
        1168: 'fa-icicles', // Freezing drizzle
        1171: 'fa-icicles', // Heavy freezing drizzle
        1180: 'fa-cloud-rain', // Patchy light rain
        1183: 'fa-cloud-rain', // Light rain
        1186: 'fa-cloud-showers-heavy', // Moderate rain at times
        1189: 'fa-cloud-showers-heavy', // Moderate rain
        1192: 'fa-cloud-showers-heavy', // Heavy rain at times
        1195: 'fa-cloud-showers-heavy', // Heavy rain
        1198: 'fa-icicles', // Light freezing rain
        1201: 'fa-icicles', // Moderate or heavy freezing rain
        1204: 'fa-cloud-meatball', // Light sleet
        1207: 'fa-cloud-meatball', // Moderate or heavy sleet
        1210: 'fa-snowflake', // Patchy light snow
        1213: 'fa-snowflake', // Light snow
        1216: 'fa-snowflake', // Patchy moderate snow
        1219: 'fa-snowflake', // Moderate snow
        1222: 'fa-snowflake', // Patchy heavy snow
        1225: 'fa-snowflake', // Heavy snow
        1237: 'fa-icicles', // Ice pellets
        1240: 'fa-cloud-rain', // Light rain shower
        1243: 'fa-cloud-showers-heavy', // Moderate or heavy rain shower
        1246: 'fa-cloud-showers-heavy', // Torrential rain shower
        1249: 'fa-cloud-meatball', // Light sleet showers
        1252: 'fa-cloud-meatball', // Moderate or heavy sleet showers
        1255: 'fa-snowflake', // Light snow showers
        1258: 'fa-snowflake', // Moderate or heavy snow showers
        1261: 'fa-icicles', // Light showers of ice pellets
        1264: 'fa-icicles', // Moderate or heavy showers of ice pellets
        1273: 'fa-cloud-bolt', // Patchy light rain with thunder
        1276: 'fa-cloud-bolt', // Moderate or heavy rain with thunder
        1279: 'fa-cloud-bolt', // Patchy light snow with thunder
        1282: 'fa-cloud-bolt' // Moderate or heavy snow with thunder
    };
    
    weatherIcon.className = `weather-icon fas ${iconMap[conditionCode] || (isDay ? 'fa-sun' : 'fa-moon')}`;
}

/**
 * Update background based on weather condition
 */
function updateBackground(conditionText, isDay) {
    const body = document.body;
    body.classList.remove('sunny', 'rainy', 'cloudy', 'night');
    
    const lowerCondition = conditionText.toLowerCase();
    
    console.log('Weather Condition:', conditionText, 'Is Day:', isDay);
    
    if (!isDay) {
        body.classList.add('night');
        console.log('Applied: night background');
    } else if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
        body.classList.add('sunny');
        console.log('Applied: sunny background');
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle') || 
               lowerCondition.includes('thunder') || lowerCondition.includes('storm')) {
        body.classList.add('rainy');
        console.log('Applied: rainy background');
    } else {
        body.classList.add('cloudy');
        console.log('Applied: cloudy background');
    }
}

/**
 * Update AQI display
 */
function updateAQI(aqi) {
    const aqiLabels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    const aqiColors = ['#00e400', '#ffff00', '#ff7e00', '#ff0000', '#8f3f97'];
    
    aqiValue.textContent = aqi;
    aqiLabel.textContent = aqiLabels[aqi - 1] || 'Unknown';
    aqiLabel.style.backgroundColor = aqiColors[aqi - 1] || '#888';
    
    // Position indicator
    const position = ((aqi - 1) / 4) * 100;
    aqiIndicator.style.left = `calc(${position}% - 8px)`;
}

/**
 * Update UV Index display
 */
function updateUVIndex(uv) {
    uvIndex.textContent = uv;
    
    let label = 'Low';
    if (uv >= 11) label = 'Extreme';
    else if (uv >= 8) label = 'Very High';
    else if (uv >= 6) label = 'High';
    else if (uv >= 3) label = 'Moderate';
    
    uvLabel.textContent = label;
    
    // Position needle
    const position = Math.min((uv / 11) * 100, 100);
    uvNeedle.style.left = `calc(${position}% - 8px)`;
}

/**
 * Animate number counter
 */
function animateNumber(element, target, suffix = '') {
    const duration = 1000;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (target - start) * easeOutCubic(progress));
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * Animate circular progress
 */
function animateCircularProgress(element, percentage) {
    const circumference = 2 * Math.PI * 34;
    const offset = circumference - (percentage / 100) * circumference;
    element.style.strokeDashoffset = offset;
}

/**
 * Animate progress bar
 */
function animateProgressBar(element, percentage) {
    element.style.width = `${Math.min(percentage, 100)}%`;
}

/**
 * Format time string to readable format
 */
function formatTime(timeString) {
    try {
        const date = new Date(timeString);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        
        return `${displayHours}:${minutes} ${ampm}`;
    } catch (error) {
        return '--:--';
    }
}

/**
 * Create weather particles based on condition
 */
function createWeatherParticles(conditionText, isDay) {
    particles.innerHTML = '';
    
    const lowerCondition = conditionText.toLowerCase();
    
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
        createRainParticles();
    } else if (lowerCondition.includes('snow')) {
        createSnowParticles();
    } else if ((lowerCondition.includes('clear') || lowerCondition.includes('sunny')) && !isDay) {
        createStarParticles();
    }
}

/**
 * Create rain particles
 */
function createRainParticles() {
    for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.style.position = 'absolute';
        drop.style.width = '2px';
        drop.style.height = '20px';
        drop.style.background = 'rgba(255, 255, 255, 0.5)';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.top = '-20px';
        drop.style.animation = `fall ${Math.random() * 2 + 1}s linear infinite`;
        drop.style.animationDelay = Math.random() * 2 + 's';
        particles.appendChild(drop);
    }
    
    // Add fall animation
    if (!document.getElementById('fallAnimation')) {
        const style = document.createElement('style');
        style.id = 'fallAnimation';
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(100vh);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Create snow particles
 */
function createSnowParticles() {
    for (let i = 0; i < 50; i++) {
        const flake = document.createElement('div');
        flake.textContent = '❅';
        flake.style.position = 'absolute';
        flake.style.color = 'white';
        flake.style.fontSize = Math.random() * 20 + 10 + 'px';
        flake.style.left = Math.random() * 100 + '%';
        flake.style.top = '-20px';
        flake.style.animation = `snowfall ${Math.random() * 5 + 5}s linear infinite`;
        flake.style.animationDelay = Math.random() * 5 + 's';
        particles.appendChild(flake);
    }
    
    // Add snowfall animation
    if (!document.getElementById('snowfallAnimation')) {
        const style = document.createElement('style');
        style.id = 'snowfallAnimation';
        style.textContent = `
            @keyframes snowfall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Create star particles for clear night
 */
function createStarParticles() {
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.textContent = '✦';
        star.style.position = 'absolute';
        star.style.color = 'white';
        star.style.fontSize = Math.random() * 10 + 5 + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`;
        star.style.animationDelay = Math.random() * 3 + 's';
        particles.appendChild(star);
    }
    
    // Add twinkle animation
    if (!document.getElementById('twinkleAnimation')) {
        const style = document.createElement('style');
        style.id = 'twinkleAnimation';
        style.textContent = `
            @keyframes twinkle {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Show error toast
 */
function showError(message) {
    errorMessage.textContent = message;
    errorToast.classList.add('show');
    
    setTimeout(() => {
        errorToast.classList.remove('show');
    }, 3000);
}

/**
 * Show loading skeleton
 */
function showLoading() {
    loadingSkeleton.classList.add('show');
    weatherContainer.classList.add('hidden');
}

/**
 * Hide loading skeleton
 */
function hideLoading() {
    loadingSkeleton.classList.remove('show');
    weatherContainer.classList.remove('hidden');
}

/**
 * Create ripple effect on button click
 */
function createRipple(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

/**
 * Easing function for smooth animations
 */
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// ========================================
// INITIALIZATION
// ========================================

// Load default city on page load
window.addEventListener('load', () => {
    // Check if API key is set before attempting to load weather
    if (apiKey === "YOUR_API_KEY_HERE" || !apiKey) {
        hideLoading();
        showError('Please set your WeatherAPI key in script.js. Get one free at weatherapi.com');
        return;
    }
    
    // Try to get user's location automatically
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            () => {
                // If geolocation fails, load default city
                fetchWeatherData('London');
            }
        );
    } else {
        fetchWeatherData('London');
    }
});

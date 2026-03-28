# WeatherView - Modern Weather Application

A fully responsive, beautifully animated weather application built with HTML, CSS, and JavaScript featuring glassmorphism design, smooth animations, and comprehensive weather data display.

## ✨ Features

### 🌤️ Weather Data Display
- **Real-time Weather Information**: Current temperature, humidity, wind speed, and more
- **Air Quality Index (AQI)**: Color-coded air quality monitoring
- **Feels Like Temperature**: Perceived temperature display
- **Wind Direction**: Animated wind direction indicator
- **Pressure & Visibility**: Atmospheric pressure and visibility metrics
- **UV Index**: Simulated UV index with gauge display
- **Sunrise/Sunset Times**: Local sunrise and sunset information
- **Local Time Display**: Real-time clock showing the searched city's local time

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Frosted glass effect on all cards
- **Smooth Animations**: Over-the-top animations for every interaction
- **Dynamic Backgrounds**: Background changes based on weather conditions:
  - ☀️ Sunny: Yellow/Orange gradient
  - 🌧️ Rainy: Blue/Grey gradient
  - ☁️ Cloudy: Soft White/Grey gradient
  - 🌙 Night: Dark Blue/Purple gradient
- **Weather Particles**: Animated rain, snow, or stars based on conditions
- **Micro-interactions**: Hover effects, ripple animations, and smooth transitions
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop

### 🔧 Functionality
- **City Search**: Search weather by city name
- **Geolocation**: Automatic weather detection using your current location
- **Error Handling**: User-friendly error messages with toast notifications
- **Loading States**: Skeleton screens while fetching data
- **Number Animations**: Smooth counter animations for temperature updates
- **Progress Indicators**: Circular and linear progress bars with smooth fills

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- WeatherAPI key (free tier: 1 million calls/month)

### Installation

1. **Clone or download the project files**
   - `index.html`
   - `style.css`
   - `script.js`

2. **Get your API key**
   - Visit [WeatherAPI.com](https://www.weatherapi.com/signup.aspx)
   - Sign up for a free account
   - Copy your API key from the dashboard

3. **Configure the API key**
   - Open `script.js`
   - Replace `YOUR_API_KEY_HERE` with your actual WeatherAPI key:
   ```javascript
   const apiKey = "your_weatherapi_key_here";
   ```

4. **Launch the application**
   - Open `index.html` in your web browser
   - The app will automatically detect your location and show weather data
   - Alternatively, search for any city using the search bar

## 📱 Usage

### Search for Weather
1. Type a city name in the search bar
2. Click the "Search" button or press Enter
3. View comprehensive weather information

### Use Your Location
1. Click the "Use My Location" button
2. Allow location access when prompted
3. Automatic weather display for your current location

### View Weather Details
- **Main Card**: Current temperature, weather icon, and description
- **Grid Cards**: Detailed metrics including:
  - Feels Like temperature with progress bar
  - Humidity with circular progress indicator
  - Wind Speed with animated direction arrow
  - Air Quality Index with color-coded scale
  - Atmospheric Pressure with metric bar
  - Visibility distance
  - UV Index with gauge
  - Sunrise/Sunset times

## 🎨 Animations & Effects

### Entrance Animations
- Staggered fade-in and slide-up for cards
- Sequential delays for cascading effect
- Smooth opacity and transform transitions

### Micro-interactions
- Button hover effects with scale transformations
- Ripple effect on button clicks
- Card hover with 3D perspective
- Smooth color transitions

### Dynamic Effects
- Weather icon floating animation
- Rotating logo icon
- Temperature counter animation
- Circular progress fill animations
- Wind direction indicator rotation
- Particle effects (rain, snow, stars)
- Background shimmer effects

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Opera (latest)

## 📦 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Advanced animations, transitions, and glassmorphism
- **JavaScript (ES6+)**: API integration, DOM manipulation, animations
- **WeatherAPI**: Comprehensive weather and air quality data
- **Font Awesome**: Weather and UI icons
- **Google Fonts**: Poppins font family

## 🔑 API Information

**WeatherAPI Endpoint**:
```
https://api.weatherapi.com/v1/current.json
```

**Data Includes**:
- Real-time weather conditions
- Air quality index (US EPA and UK DEFRA)
- Location information with timezone
- Temperature (Celsius & Fahrenheit)
- Wind speed, direction, and gusts
- Humidity, pressure, visibility
- UV index
- Cloud cover and precipitation
- Feels-like temperature

## 📐 Project Structure

```
weather_humidity/
│
├── index.html          # Main HTML structure
├── style.css           # All styles and animations
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## ⚙️ Customization

### Change Color Scheme
Edit CSS variables in `style.css`:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --sunny-gradient: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
    /* Add your custom gradients */
}
```

### Adjust Animation Speed
Modify transition variables:
```css
:root {
    --transition-fast: 0.2s ease-in-out;
    --transition-medium: 0.4s ease-in-out;
    --transition-slow: 0.8s ease-in-out;
}
```

### Change Default City
In `script.js`, modify the initialization:
```javascript
window.addEventListener('load', () => {
    fetchWeatherData('YourCityName');
});
```

## 🐛 Troubleshooting

### Weather data not loading?
- ✅ Verify your API key is correctly inserted
- ✅ Check your internet connection
- ✅ Ensure the city name is spelled correctly
- ✅ Check browser console for error messages

### Location not working?
- ✅ Enable location services in your browser
- ✅ Allow location permission when prompted
- ✅ Use HTTPS if hosting online

### Animations not smooth?
- ✅ Close other browser tabs
- ✅ Update your browser to the latest version
- ✅ Check if hardware acceleration is enabled

## 📄 License

This project is open source and available for personal and educational use.

## 🙏 Credits

- Weather data provided by [WeatherAPI.com](https://www.weatherapi.com/)
- Icons from [Font Awesome](https://fontawesome.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

## 📧 Support

For issues, questions, or suggestions, please create an issue in the project repository.

---

**Enjoy using WeatherView! ☀️🌧️❄️**

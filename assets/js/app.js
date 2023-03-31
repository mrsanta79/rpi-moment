// Vue
let app = new Vue({
    el: '#app',
    data: {
        loadingData: false,
        network: {
            isConnected: true,
            notifierVisible: false,
        },
        current: {
            time: '-- : -- : --',
            date: '-',
            temp: '-',
            tempIcon: null,
            tempType: '-',
            sunrise: '-- : -- : --',
            sunset: '-- : -- : --',
        },
        upcoming: [
            { day: '-', tempMax: '-', tempMin: '-', tempIcon: null, tempType: '-' },
            { day: '-', tempMax: '-', tempMin: '-', tempIcon: null, tempType: '-' },
            { day: '-', tempMax: '-', tempMin: '-', tempIcon: null, tempType: '-' },
        ]
    },
    created() {
        this.getTodayInfo();
        this.getCurrentWeather();
        this.getUpcomingWeather();

        // Fetch weather data every 60 minutes
        setInterval(() => {
            this.getCurrentWeather();
            this.getUpcomingWeather();
        }, 1000 * 60 * 60);

        // Fetch time every second
        setInterval(() => {
            this.getTodayInfo();
        }, 1000);

        // Check Internet connection availability
        window.addEventListener('offline', (event) => {
            this.network.isConnected = false;
            this.network.notifierVisible = true;
            setTimeout(() => {
                this.network.notifierVisible = false;
            }, 3000);
        });
        window.addEventListener('online', (event) => {
            this.network.isConnected = true;
            this.network.notifierVisible = true;

            // Refresh data as soon as network connected
            this.refreshData();

            setTimeout(() => {
                this.network.notifierVisible = false;
            }, 3000);
        })
    },
    methods: {
        getTodayInfo: function() {
            const today = new Date();
            const day = moment(today).format('ddd');
            const date = moment(today).format('MMM Do, YYYY');
            const time = moment(today).format('hh : mm A');

            this.current.date = `${day}, ${date}`;
            this.current.time = time;

            // Get upcoming days
            this.upcoming.forEach((upDay, index) => {
                const upcomingDay = new Date(today);
                upcomingDay.setDate(upcomingDay.getDate() + (index + 1));

                this.upcoming[index].day = moment(upcomingDay).format('ddd');
            });
        },
        getCurrentWeather: function() {
            const API_KEY = document.querySelector('meta[name=weather-api-key]').getAttribute('content');
            const CITY = document.querySelector('meta[name=location-city]').getAttribute('content');
            const STATE = document.querySelector('meta[name=location-state]').getAttribute('content');
            const COUNTRY = document.querySelector('meta[name=location-country]').getAttribute('content');

            const unitKelvin = 273.15;

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${STATE},${COUNTRY}&appid=${API_KEY}`;
            const weatherIconUrl = `https://openweathermap.org/img/wn/`;

            fetch(weatherUrl)
                .then(data => data.json())
                .then(response => {
                    this.current.temp = Math.round(response.main.temp - unitKelvin);
                    this.current.tempIcon = weatherIconUrl + response.weather[0].icon + '@2x.png';
                    this.current.tempType = response.weather[0].main;
                    this.current.sunrise = moment(new Date(response.sys.sunrise * 1000)).format('hh:mm A');
                    this.current.sunset = moment(new Date(response.sys.sunset * 1000)).format('hh:mm A');
                }).catch(err => {
                    console.log(err);
                })
        },
        getUpcomingWeather: function() {
            const API_KEY = document.querySelector('meta[name=weather-api-key]').getAttribute('content');
            const CITY = document.querySelector('meta[name=location-city]').getAttribute('content');

            const unitKelvin = 273.15;
            const dayCount = 3;

            const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&cnt=${dayCount}&appid=${API_KEY}`;
            const weatherIconUrl = `https://openweathermap.org/img/wn/`;

            fetch(weatherUrl)
                .then(data => data.json())
                .then(response => {
                    if (response.list.length) {
                        response.list.forEach((day, index) => {
                            this.upcoming[index].tempMax = Math.round(day.main.temp_max - unitKelvin);
                            this.upcoming[index].tempMin = Math.round(day.main.temp_min - unitKelvin);
                            this.upcoming[index].tempIcon = weatherIconUrl + day.weather[0].icon + '@2x.png';
                            this.upcoming[index].tempType = day.weather[0].main;
                        });
                    }
                }).catch(err => {
                    console.log(err);
                })
        },
        poweroff: function(type) {
            const url = `${window.location.origin}/poweroff/${type}`;

            setTimeout(() => {
                fetch(url)
                    .then(data => data.json())
                    .then(response => {
                        console.log(response);
                    });
            }, 2000);
        },
        refreshData: function() {
            this.loadingData = true;
            this.getTodayInfo();
            this.getCurrentWeather();

            setTimeout(() => {
                this.loadingData = false;
            }, 1100)
        }
    }
});

// Variables
const $brightnessSliderWrapper = document.getElementById('brightness-slider-wrapper');
const brightnessSlider = document.getElementById('brightness-slider');

// JS Functions
window.addEventListener('DOMContentLoaded', function() {
    // Resize brightness slider
    initializeBrightnessSlider();
    brightnessControl();

    // Brightness control
    brightnessSlider.addEventListener('input', brightnessControl);
});

const initializeBrightnessSlider = function() {
    const brightness = window.localStorage.getItem('brightness');
    brightnessSlider.value = brightness;
    brightnessSlider.style.width = `${$brightnessSliderWrapper.offsetHeight}px`;
}

const brightnessControl = function() {
    document.getElementById('app').style.filter = `brightness(${brightnessSlider.value}%)`;
    window.localStorage.setItem('brightness', brightnessSlider.value);
}
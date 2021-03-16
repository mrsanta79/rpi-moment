let app = new Vue({
    el: '#app',
    data: {
        currentTime: '-- : -- : --',
        currentDate: '-',
        currentTemperature: '-',
        currentTemperatureIcon: '',
        currentTemperatureType: '-',
    },
    created() {
        this.getTodayInfo();
        this.getCurrentTemperature();
    },
    methods: {
        getTodayInfo: function() {
            setInterval(() => {
                const today = new Date();
                const day = moment(today).format('ddd');
                const date = moment(today).format('MMM Do YYYY');
                const time = moment(today).format('hh : mm A');

                this.currentDate = day + ', ' + date;
                this.currentTime = time;
            }, 1000);
        },
        getCurrentTemperature: function() {
            const API_KEY = document.querySelector('meta[name=weather-api-key]').getAttribute('content');
            const CITY = document.querySelector('meta[name=location-city]').getAttribute('content');
            const STATE = document.querySelector('meta[name=location-state]').getAttribute('content');
            const COUNTRY = document.querySelector('meta[name=location-country]').getAttribute('content');

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${STATE},${COUNTRY}&appid=${API_KEY}`;
            const weatherIconUrl = `https://openweathermap.org/img/wn/`;

            // setInterval(() => {
            fetch(weatherUrl).then(data => data.json())
                .then(response => {
                    console.log(response);
                    this.currentTemperature = response.main.temp - 273.15;
                    this.currentTemperatureIcon = weatherIconUrl + response.weather[0].icon + '@2x.png';
                    this.currentTemperatureType = response.weather[0].main;
                })
                // }, 60000);
        }
    }
});
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
        crypto: {
            rate: '0',
            refreshedAt: '-- : -- : --'
        }
    },
    created() {
        this.getTodayInfo();
        this.getCurrentTemperature();
        this.getCryptoRates();

        // Fetch weather data every 10 mins
        setInterval(() => {
            this.getCurrentTemperature();
        }, 1000 * 60 * 10);

        // Fetch crypto rates every hour
        setInterval(() => {
            this.getCryptoRates();
        }, 1000 * 60 * 60);

        // Check Internet connection availablity
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
            setTimeout(() => {
                this.network.notifierVisible = false;
            }, 3000);
        })
    },
    methods: {
        getTodayInfo: function() {
            setInterval(() => {
                const today = new Date();
                const day = moment(today).format('ddd');
                const date = moment(today).format('MMM Do YYYY');
                const time = moment(today).format('hh : mm A');

                this.current.date = day + ', ' + date;
                this.current.time = time;
            }, 1000);
        },
        getCurrentTemperature: function() {
            const API_KEY = document.querySelector('meta[name=weather-api-key]').getAttribute('content');
            const CITY = document.querySelector('meta[name=location-city]').getAttribute('content');
            const STATE = document.querySelector('meta[name=location-state]').getAttribute('content');
            const COUNTRY = document.querySelector('meta[name=location-country]').getAttribute('content');

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${STATE},${COUNTRY}&appid=${API_KEY}`;
            const weatherIconUrl = `https://openweathermap.org/img/wn/`;

            fetch(weatherUrl)
                .then(data => data.json())
                .then(response => {
                    console.log(moment().format('hh : mm A'));

                    this.current.temp = response.main.temp - 273.15;
                    this.current.tempIcon = weatherIconUrl + response.weather[0].icon + '@2x.png';
                    this.current.tempType = response.weather[0].main;
                    this.current.sunrise = moment(new Date(response.sys.sunrise * 1000)).format('hh:mm A');
                    this.current.sunset = moment(new Date(response.sys.sunset * 1000)).format('hh:mm A');
                }).catch(err => {
                    console.log(err);
                })
        },
        getCryptoRates: function() {
            const CRYPTO_CURRENCY_CODE = document.querySelector('meta[name=crypto-currency-code]').getAttribute('content');
            const CURRENCY_CODE = document.querySelector('meta[name=currency-code]').getAttribute('content');

            const url = `https://api.exchangerate.host/latest?base=${CRYPTO_CURRENCY_CODE}&symbols=${CURRENCY_CODE}`;

            fetch(url)
                .then(data => data.json())
                .then(response => {
                    if (response.success) {
                        let rate = Math.round(response.rates[CURRENCY_CODE]);
                        rate = rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                        this.crypto.rate = rate;
                        this.crypto.refreshedAt = moment().format('hh : mm A');
                    } else {
                        console.log(response);
                    }
                }).catch(err => {
                    console.log(err);
                })
        },
        refreshData: function() {
            this.loadingData = true;
            this.getTodayInfo();
            this.getCurrentTemperature();
            this.getCryptoRates();

            setTimeout(() => {
                this.loadingData = false;
            }, 1100)
        }
    }
});
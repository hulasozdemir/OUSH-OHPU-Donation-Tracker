const provincesDropdown = document.getElementById('provinces');
const citiesDropdown = document.getElementById('cities');
const spoDropdown = document.getElementById('spos');


// document.querySelectorAll('input[name="donationType"]').forEach(radio => {
//     radio.addEventListener('change', updateViaRailOptionsVisibility);
// });


// function updateGiftCardOptionsVisibility() {
//     giftCardOptions.style.display = giftCardRadio.checked ? 'block' : 'none';
// }

// document.querySelectorAll('input[name="donationType"]').forEach(radio => {
//     radio.addEventListener('change', updateGiftCardOptionsVisibility);
// });

let citiesByProvince = {};
let sposByCity = {};

function updateCitiesDropdown() {
    const selectedProvince = provincesDropdown.value;
    const cities = citiesByProvince[selectedProvince] || [];
    cities.sort();
    citiesDropdown.innerHTML = ['<option value="">Select a city</option>', ...cities.map(city => `<option value="${city}">${city}</option>`)].join('');
}

function updateSPODropdown() {
    const selectedCity = citiesDropdown.value;
    const spos = sposByCity[selectedCity] || [];
    spoDropdown.innerHTML = ['<option value="">Select a SPO</option>', ...spos.map(spo => `<option value="${spo}">${spo}</option>`)].join('');
}

provincesDropdown.addEventListener('change', updateCitiesDropdown);
citiesDropdown.addEventListener('change', updateSPODropdown);

async function fetchCsvData(url) {
    const response = await fetch(url);
    const csvData = await response.text();
    return csvData;
}

async function parseCsvData(csvData) {
    const lines = csvData.split('\n');
    const citiesByProvince = {};
    const provinces = [];
    const sposByCity = {};

    lines.forEach(line => {
        const [spo, streetAddress, province, city] = line.split(',');
        if (province && city) {
            if (!provinces.includes(province)) {
                provinces.push(province);
            }
            if (!citiesByProvince[province]) {
                citiesByProvince[province] = [];
            }
            if (!citiesByProvince[province].includes(city)) {
                citiesByProvince[province].push(city);
            }

            if (!sposByCity[city]) {
                sposByCity[city] = [];
            }
            if (!sposByCity[city].includes(spo)) {
                sposByCity[city].push(spo);
            }
        }
    });

    return { provinces, citiesByProvince, sposByCity };
}

function updateProvincesDropdown(provinces) {
  console.log(provinces)  
  provinces.sort();
    provincesDropdown.innerHTML = ['<option value="">Select a province</option>', ...provinces.map(province => `<option value="${province}">${province}</option>`)].join('');
}

async function loadProvincesAndCities() {
    const csvUrl = 'data/SPOs_processed.csv';
    const csvData = await fetchCsvData(csvUrl);
    const parsedData = await parseCsvData(csvData);
    return parsedData;
}

loadProvincesAndCities().then(({ provinces, citiesByProvince: cities, sposByCity: spos }) => {
    citiesByProvince = cities;
    sposByCity = spos;
    updateProvincesDropdown(provinces);
    updateCitiesDropdown();
    updateSPODropdown();
}).catch(error => {
    console.error('Failed to load provinces, cities, and SPOs from CSV:', error);
});


let cityList = [];

function fetchAirportDataFromCsv() {
  fetch('data/flair_airports.csv')
    .then(resp => resp.text())
    .then(data => {
      const lines = data.split('\n');
      lines.forEach(line => {
        const [province, cityName, airportName] = line.split(',');
        cityList.push({ province, cityName, airportName });
      });
      cityList.sort((a, b) => a.cityName.localeCompare(b.cityName));
      fillDropdowns();
    });
}

function fillDropdowns() {
  const startPointSelect = document.getElementById('origin');
  const endPointSelect = document.getElementById('destination');

  cityList.forEach(city => {
    const option = document.createElement('option');
    option.value = city.cityName;
    option.text = city.cityName;
    startPointSelect.add(option.cloneNode(true));
    endPointSelect.add(option);
  });
}

function refreshDestinationOptions() {
  const startPointSelect = document.getElementById('origin');
  const endPointSelect = document.getElementById('destination');
  const selectedStartPoint = startPointSelect.value;

  // Clear and repopulate destination dropdown
  endPointSelect.innerHTML = '<option value="" disabled selected>Please choose a destination</option>';
  cityList.forEach(city => {
    if (city.cityName !== selectedStartPoint) {
      const option = document.createElement('option');
      option.value = city.cityName;
      option.text = city.cityName;
      endPointSelect.add(option);
    }
  });
}

function displayAirport(selectId, textBoxId) {
  const cityName = document.getElementById(selectId).value;
  const airportName = cityList.find(c => c.cityName === cityName).airportName;
  document.getElementById(textBoxId).value = airportName;
}

fetchAirportDataFromCsv();


const formElement = document.getElementById('flair-form');
const submitButton = document.getElementById('submitBtn');

formElement.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  const province = document.getElementById('provinces').value;
  const spo = document.getElementById('spos').value;
  const email = document.getElementById('email').value;
  const dateTravel = document.getElementById('trip-date').value;
  const origin = document.getElementById('origin').value;
  const destination = document.getElementById('destination').value;
  const passengers = document.getElementById('passengers').value;
  const ticketCost = document.getElementById('ticket-cost').value;

  const formData = {
    province,
    spo,
    email,
    dateTravel,
    origin,
    destination,
    passengers,
    ticketCost
  };

  const proxyUrl = '';
  const targetEndpoint = 'https://script.google.com/macros/s/AKfycbyV8Z4YH4puhUxMzz1IthUrd8jx-tg9xe4kXAb2KYikh1gzRjF5gTqEZCnKA4_88wspTQ/exec';

  try {
    const resp = await fetch(proxyUrl + targetEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    // console.log(resp.json())
    if (resp.ok) {
      const result = await resp.json();
      if (result.result === 'success') {
        window.location.href = 'success.html';
      } else {
        window.location.href = 'success.html';//`error.html?errorCode=${resp.status}`;
      }
    } else {
      window.location.href = 'success.html';//`error.html?errorCode=${resp.status}`;
    }
  } catch (error) {
    window.location.href = 'success.html';//'error.html?errorCode=unknown';
  }
});




  

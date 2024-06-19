function populateOrganizationData(province) {
  fetch('flair_SPOs.csv')
      .then(response => response.text())
      .then(data => {
          const organizations = parseCSVData(data);
          const organizationData = organizations.find(org => org.PT === province);
          if (organizationData) {
              document.getElementById('spo').value = organizationData.SPO;
              document.getElementById('address1').value = organizationData['Address-1'];
              document.getElementById('address2').value = organizationData['Address-2'];
          } else {
              // If no organization data is found for the selected province
              document.getElementById('spo').value = '';
              document.getElementById('address1').value = '';
              document.getElementById('address2').value = '';
          }
      })
      .catch(error => {
          console.error('Error:', error);
          // Handle any error that occurs during data fetching
      });
}

// Parses the CSV data into an array of objects
function parseCSVData(csvData) {
  const rows = csvData.split('\n');
  const headers = rows[0].split(',');

  const organizations = [];
  for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(',');
      if (row.length === headers.length) {
          const organization = {};
          for (let j = 0; j < headers.length; j++) {
              organization[headers[j]] = row[j];
          }
          organizations.push(organization);
      }
  }

  return organizations;
}


document.getElementById('province').addEventListener('change', function () {
  const selectedProvince = this.value;
  // const selectedPaymentPeriod = document.getElementById('payment-period').value;
  populateOrganizationData(selectedProvince);
});



// const provincesDropdown = document.getElementById('provinces');
// const citiesDropdown = document.getElementById('cities');
// const spoDropdown = document.getElementById('spos');

// let citiesByProvince = {};
// let sposByCity = {};






// function updateCitiesDropdown() {
//     const selectedProvince = provincesDropdown.value;
//     const cities = citiesByProvince[selectedProvince] || [];
//     cities.sort();
//     citiesDropdown.innerHTML = ['<option value="" disabled selected>Select a city</option>', ...cities.map(city => `<option value="${city}">${city}</option>`)].join('');
// }

// function updateSPODropdown() {
//     const selectedCity = citiesDropdown.value;
//     const spos = sposByCity[selectedCity] || [];
//     spos.sort()
//     spoDropdown.innerHTML = ['<option value="" disabled selected>Select a SPO</option>', ...spos.map(spo => `<option value="${spo}">${spo}</option>`)].join('');
// }

// provincesDropdown.addEventListener('change', updateCitiesDropdown);
// citiesDropdown.addEventListener('change', updateSPODropdown);

// async function fetchCsvData(url) {
//     const response = await fetch(url);
//     const csvData = await response.text();
//     return csvData;
// }

// async function parseCsvData(csvData) {
//     const lines = csvData.split('\n');
//     const citiesByProvince = {};
//     const provinces = [];
//     const sposByCity = {};

//     lines.forEach(line => {
//         const [spo, streetAddress, province, city] = line.split(',');
//         if (province && city) {
//             if (!provinces.includes(province)) {
//                 provinces.push(province);
//             }
//             if (!citiesByProvince[province]) {
//                 citiesByProvince[province] = [];
//             }
//             if (!citiesByProvince[province].includes(city)) {
//                 citiesByProvince[province].push(city);
//             }

//             if (!sposByCity[city]) {
//                 sposByCity[city] = [];
//             }
//             if (!sposByCity[city].includes(spo)) {
//                 sposByCity[city].push(spo);
//             }
//             if (!sposByCity[city].includes("Other")) {
//               sposByCity[city].push("Other");
//           }
//         }
//     });
//     return { provinces, citiesByProvince, sposByCity };
// }

// function updateProvincesDropdown(provinces) {
//   provinces.sort();
//     provincesDropdown.innerHTML = ['<option value="" disabled selected>Select a province</option>', ...provinces.map(province => `<option value="${province}">${province}</option>`)].join('');
// }

// async function loadProvincesAndCities() {
//     const csvUrl = 'data/SPOs_processed.csv';
//     const csvData = await fetchCsvData(csvUrl);
//     const parsedData = await parseCsvData(csvData);
//     return parsedData;
// }

// loadProvincesAndCities().then(({ provinces, citiesByProvince: cities, sposByCity: spos }) => {
//     citiesByProvince = cities;
    
//     sposByCity = spos;
//     updateProvincesDropdown(provinces);
//     updateCitiesDropdown();
//     updateSPODropdown();
// }).catch(error => {
//     console.error('Failed to load provinces, cities, and SPOs from CSV:', error);
// });


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

  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing...';


  const province = document.getElementById('province').value;
  const spo = document.getElementById('spo').value;
  const email = document.getElementById('email').value;
  const dateTravel = document.getElementById('trip-date').value;
  const origin = document.getElementById('origin').value;
  const destination = document.getElementById('destination').value;
  const passengers = document.getElementById('passengers').value;
  const ticketCost = document.getElementById('ticket-cost').value;
  const other = document.getElementById('other').value;

  if (!province || !spo || !email || !dateTravel || !origin || !destination || !passengers || !ticketCost) {
    alert('Please fill in all required fields.');
    return;
}

  const formData = {
    province,
    spo,
    email,
    dateTravel,
    origin,
    destination,
    passengers,
    ticketCost,
    other
  };

  const proxyUrl = '';

  const targetEndpoint = 'your_end_point';

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
  
  submitBtn.disabled = false;
  submitBtn.textContent = 'Submit';
  
});




  

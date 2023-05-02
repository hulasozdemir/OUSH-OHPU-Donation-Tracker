const giftCardRadio = document.querySelector('input[name="donationType"][value="Gift card"]');
const giftCardOptions = document.getElementById('giftCardOptions');
const provincesDropdown = document.getElementById('provinces');
const citiesDropdown = document.getElementById('cities');
const spoDropdown = document.getElementById('spos');



const options = [
    { value: 'toronto', label: 'Toronto' },
    { value: 'ottawa', label: 'Ottawa' },
    { value: 'montreal', label: 'Montreal' },
    // Add more options as needed
];


const fromDropdown = document.getElementById('from');
const toDropdown = document.getElementById('to');

options.forEach(option => {
    const fromOption = document.createElement('option');
    fromOption.value = option.value;
    fromOption.textContent = option.label;
    fromDropdown.appendChild(fromOption);

    const toOption = document.createElement('option');
    toOption.value = option.value;
    toOption.textContent = option.label;
    toDropdown.appendChild(toOption);
});


const viaRailRadio = document.querySelector('input[name="donationType"][value="ViaRail"]');
const viaRailSection = document.getElementById('viaRailSection');

function updateViaRailOptionsVisibility() {
    viaRailSection.style.display = viaRailRadio.checked ? 'block' : 'none';
}

document.querySelectorAll('input[name="donationType"]').forEach(radio => {
    radio.addEventListener('change', updateViaRailOptionsVisibility);
});

updateViaRailOptionsVisibility();


function updateGiftCardOptionsVisibility() {
    giftCardOptions.style.display = giftCardRadio.checked ? 'block' : 'none';
}

document.querySelectorAll('input[name="donationType"]').forEach(radio => {
    radio.addEventListener('change', updateGiftCardOptionsVisibility);
});

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
    spoDropdown.innerHTML = ['<option value="">Select an SPO</option>', ...spos.map(spo => `<option value="${spo}">${spo}</option>`)].join('');
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


async function parseCsvData_VIARAIL(csvData) {
    const lines = csvData.split('\n');
    const data = {};

    // Loop through each line of the CSV file
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const parts = line.split(',');

        // Extract the Origin and Destination values from the line
        const origin = parts[1];
        const destination = parts[2];

        // Add the Destination to the mapping for the Origin
        if (!data[origin]) {
            data[origin] = [];
        }
        data[origin].push(destination);
    }

    return data;
}





function updateProvincesDropdown(provinces) {
    provinces.sort();
    provincesDropdown.innerHTML = ['<option value="">Select a province</option>', ...provinces.map(province => `<option value="${province}">${province}</option>`)].join('');
}

async function loadProvincesAndCities() {
    const csvUrl = 'SPOs_processed.csv';
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



async function loadOriginsAndDestinatios() {
    const csvUrl = 'VIA_rail_fares.csv';

    // Load the CSV data and parse it into an object mapping Origins to Destinations
    const csvData = await fetchCsvData(csvUrl);
    const data = parseCsvData_VIARAIL(csvData);

    // Get references to the "from" and "to" drop-down menus
    const fromDropdown = document.getElementById('from');
    const toDropdown = document.getElementById('to');

    // Build an array of unique Origins and sort them
    const origins = Object.keys(data).sort();

    // Add the unique Origins to the "from" drop-down menu
    for (let i = 0; i < origins.length; i++) {
        const option = document.createElement('option');
        option.value = origins[i];
        option.textContent = origins[i];
        fromDropdown.appendChild(option);
    }

    // Update the "to" drop-down menu when the selected "from" option changes
    function updateToDropdown() {
        const selectedOrigin = fromDropdown.value;
        const destinations = data[selectedOrigin] || [];

        // Remove all existing options from the "to" drop-down menu
        toDropdown.innerHTML = '';

        // Add a default option to the "to" drop-down menu
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a destination';
        toDropdown.appendChild(defaultOption);

        // Add each available Destination to the "to" drop-down menu
        for (let i = 0; i < destinations.length; i++) {
            const option = document.createElement('option');
            option.value = destinations[i];
            option.textContent = destinations[i];
            toDropdown.appendChild(option);
        }
    }

    // Call the updateToDropdown() function when the selected "from" option changes
    fromDropdown.addEventListener('change', updateToDropdown);
}





updateGiftCardOptionsVisibility();
loadOriginsAndDestinatios()

const form = document.getElementById('inventoryForm');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const giftCardType = document.getElementById('giftCardType').value;
    const province = document.getElementById('provinces').value;
    const city = document.getElementById('cities').value;
    const spo = document.getElementById('spos').value;
    const numGiftCards = document.getElementById('numGiftCards').value;

    const data = {
        giftCardType,
        province,
        city,
        spo,
        numGiftCards
    };

    const proxyUrl = '';
    const targetUrl = 'https://script.google.com/macros/s/AKfycbz6mg0wzPqf6wj70v0Yl3KNARdnNkNyrjxev-88AITjUhfdTxUwexKNKkotDlXFrcVlLg/exec';


    try {
        const response = await fetch(proxyUrl + targetUrl, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const result = await response.json();
            if (result.result === 'success') {
                window.location.href = 'success.html';
            } else {
                window.location.href = 'success.html';//`error.html?errorCode=${response.status}`;
            }
        } else {
            window.location.href = 'success.html';//`error.html?errorCode=${response.status}`;
        }
    } catch (error) {
        window.location.href = 'success.html';//'error.html?errorCode=unknown';
    }
});



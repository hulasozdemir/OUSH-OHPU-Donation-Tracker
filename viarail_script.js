let routes = {};

async function fetchCSVData(fileUrl) {
    const response = await fetch(fileUrl);
    const csvData = await response.text();
    return csvData;
}

function parseCSV(csvData) {
    const rows = csvData.split('\n');
    const [, ...dataRows] = rows;

    dataRows.forEach(row => {
        const values = row.split(',');
        const origin = values[0].trim();
        const destination = values[1].trim();
        const baseFare = parseFloat(values[3].trim());
        const totalFare = parseFloat(values[4].trim());
        if (!routes[origin]) routes[origin] = {};
        if (!routes[origin][destination]) {
            routes[origin][destination] = { baseFare, totalFare };
        }
    });
}

async function initialize() {
    try {
        const csvData = await fetchCSVData('data/VIA_rail_fares.csv'); // Replace 'routes.csv' with the URL to your CSV file
        parseCSV(csvData);
        populateOrigins();
    } catch (error) {
        console.error('Error initializing form:', error);
    }
}

function populateOrigins() {
    const originSelect = document.getElementById('origin');
    originSelect.disabled = false;
    let options = '<option value="">--Please choose an origin--</option>';
    for (const origin in routes) {
        options += `<option value="${origin}">${origin}</option>`;
    }
    originSelect.innerHTML = options;
}

function updateDestinationOptions() {
    const origin = document.getElementById('origin').value;
    const destinationSelect = document.getElementById('destination');

    if (origin === "") {
        destinationSelect.innerHTML = '<option value="">--Please choose a destination--</option>';
        destinationSelect.disabled = true;
    } else {
        destinationSelect.disabled = false;
        let options = '<option value="">--Please choose a destination--</option>';
        for (const destination in routes[origin]) {
            options += `<option value="${destination}">${destination}</option>`;
        }
        destinationSelect.innerHTML = options;
    }
}

function updateFareDetails() {
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const baseFareInput = document.getElementById('base-fare');
    const totalFareInput = document.getElementById('total-fare');

    if (origin !== "" && destination !== "") {
        const fareDetails = routes[origin][destination];
        baseFareInput.value = fareDetails.baseFare.toFixed(2);
        totalFareInput.value = fareDetails.totalFare.toFixed(2);
    } else {
        baseFareInput.value = '';
        totalFareInput.value = '';
    }
}

// document.getElementById('travel-voucher-form').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent form submission

//     const origin = document.getElementById('origin').value;
//     const destination = document.getElementById('destination').value;

//     if (origin === '' || destination === '') {
//         alert('Please choose both an origin and a destination.');
//     } else {
//         alert(`Origin: ${origin}\nDestination: ${destination}`);
//         // Process the form data (e.g., save to a database or send via email)
//     }
// });

// Initialize the form
initialize();

const form = document.getElementById('travel-voucher-form');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const PTHub = document.getElementById('pt-hubs').value;
    const dateTravel = document.getElementById('travel-date').value;
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const baseFare = document.getElementById('base-fare').value;
    const totalFare = document.getElementById('total-fare').value;

    if (!PTHub || !dateTravel || !origin  || !destination || !baseFare || !totalFare) {
        alert('Please fill all fields before submitting.');
        return;
      }

    const data = {
        PTHub,
        dateTravel,
        origin,
        destination,
        baseFare,
        totalFare
    };

    const proxyUrl = '';
    const targetUrl  = "https://script.google.com/macros/s/AKfycbwHg796wuOH0b92Ld8bGFP0w6SEDx-cGchKUrx_mcwAKm-CCd9pZ-vuCqn_OaTcXxUN_g/exec" // oush
    // const targetUrl = 'https://script.google.com/macros/s/AKfycbwxl3qfgPy-_yewyA6-czUyOw02VeAK_CgSTD_Tee7oLQjtfGs96Dr8c7GLxjVFt5NC/exec'; ulas


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

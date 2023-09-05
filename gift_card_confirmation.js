const provinceDropdown = document.getElementById('province');
const providerDropdown = document.getElementById('provider');
const addressInput = document.getElementById('address');
const contactInput = document.getElementById('contact');
const emailInput = document.getElementById('email');
const visaInput = document.getElementById('visa');
const loblawsInput = document.getElementById('loblaws');

provinceDropdown.addEventListener('change', function () {
    const selectedProvince = this.value;
    populateProviderDropdown(selectedProvince);
    console.log('Selected Province:', selectedProvince);
    console.log('CSV Data:', csvData); // Make sure this array is populated
});

function getCsvRow(province, provider) {
    return csvData.find(row => row.Province === province && row['SPO Name'] === provider);
}

function populateProvinceDropdown(data) {
    const uniqueProvinces = [...new Set(data.map(org => org.Province))];
    provinceDropdown.innerHTML = '<option value="">Select Province</option>';

    for (const province of uniqueProvinces) {
        const option = document.createElement('option');
        option.value = province;
        option.text = province;
        provinceDropdown.appendChild(option);
    }
}

function populateProviderDropdown(selectedProvince) {
    fetch('data/Scotiabank_allocations.csv')
        .then(response => response.text())
        .then(csvText => {
            const csvData = parseCSVData(csvText);
            const filteredData = csvData.filter(org => org.Province === selectedProvince);
            populateDropdown(providerDropdown, filteredData);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle any error that occurs during data fetching
        });
}

function populateDropdown(dropdown, data) {
    dropdown.innerHTML = '<option value="">Select Provider</option>';

    for (const org of data) {
        const option = document.createElement('option');
        option.value = org['SPO Name'];
        option.text = org['SPO Name'];
        dropdown.appendChild(option);
    }
}

providerDropdown.addEventListener('change', function () {
    const selectedProvider = this.value;
    const selectedProvince = provinceDropdown.value;
    const orgData = getCsvRow(selectedProvince, selectedProvider);

    if (orgData) {
        addressInput.value = orgData['SPO Address'];
        contactInput.value = orgData['SPO Contact Person'];
        emailInput.value = orgData['SPO Contact Person Email'];
        visaInput.value = orgData['SPO Visa'];
        loblawsInput.value = orgData['SPO Loblaws'];
    } else {
        // Clear fields if no data found
        addressInput.value = '';
        contactInput.value = '';
        emailInput.value = '';
        visaInput.value = '';
        loblawsInput.value = '';
    }
});

let csvData;  // Declare csvData variable to hold parsed CSV data

// Parses the CSV data into an array of objects
function parseCSVData(csvText) {
    const rows = csvText.split('\n');
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

fetch('data/Scotiabank_allocations.csv')
    .then(response => response.text())
    .then(csvText => {
        csvData = parseCSVData(csvText);  // Store parsed CSV data
        populateProvinceDropdown(csvData);
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle any error that occurs during data fetching
    });

const confirmationCheckbox = document.getElementById('confirmationCheckbox');
const submitButton = document.getElementById('submitBtn');

confirmationCheckbox.addEventListener('change', function () {
    submitButton.disabled = !this.checked;
});

const formElement = document.getElementById('verification-form');

formElement.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
  
    const province = document.getElementById('province').value;
    const organization = document.getElementById('provider').value;
    const email = document.getElementById('email').value;
  
    if (!province || !organization || !email) {
      alert('Please fill in all required fields.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
      return;
    }
  
    const formData = {
      province,
      organization,
      email
    };
  
    const googleSheetApiUrl = 'https://script.google.com/macros/s/AKfycbzeQDaLwo5x9TGioRrcjVeoic6nmTAOXYv13X5Qx4SBk-8EFp-Z_D6DJQoyeKcac-kd/exec';
  
    try {
        const resp = await fetch(googleSheetApiUrl, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
  
      if (resp.ok) {
        const result = await resp.json();
        if (result.result === 'success') {
          window.location.href = 'success.html'; // Redirect on success
        } else {
          window.location.href = 'success.html'; // Redirect on error
        }
      } else {
        window.location.href = 'success.html'; // Redirect on response failure
      }
    } catch (error) {
      window.location.href = 'success.html'; // Redirect on fetch error
    }
  
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
  });
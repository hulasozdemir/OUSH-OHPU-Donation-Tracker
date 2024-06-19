// Fetches the CSV data and populates the organization and address fields
// Fetches the CSV data and populates the organization and address fields
function populateOrganizationData(province) {
    fetch('cash_donation_receiving_SPO.csv')
        .then(response => response.text())
        .then(data => {
            const organizations = parseCSVData(data);
            const organizationData = organizations.find(org => org.PT === province);
            if (organizationData) {
                document.getElementById('organization').value = organizationData.SPO;
                document.getElementById('address1').value = organizationData['Address-1'];
                document.getElementById('address2').value = organizationData['Address-2'];
            } else {
                // If no organization data is found for the selected province
                document.getElementById('organization').value = '';
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


const formElement = document.getElementById('verification-form');
const submitButton = document.getElementById('submitBtn');

formElement.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const province = document.getElementById('province').value;
    const paymentPeriod = document.getElementById('payment-period').value;
    const organization = document.getElementById('organization').value;
    const address1 = document.getElementById('address1').value;
    const address2 = document.getElementById('address2').value;
    const chequeNumber = document.getElementById('cheque-number').value;
    const dateReceived = document.getElementById('date-received').value;
    const families = document.getElementById('families').value;

    const formData = {
        province,
        organization,
        address1,
        address2,
        paymentPeriod,
        dateReceived,
        chequeNumber,
        families
    };

    const proxyUrl = '';
    
    const targetEndpoint = "your_end_point";
  
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

// Add event listeners to the province and payment period dropdowns
document.getElementById('province').addEventListener('change', function () {
    const selectedProvince = this.value;
    const selectedPaymentPeriod = document.getElementById('payment-period').value;
    populateOrganizationData(selectedProvince, selectedPaymentPeriod);
});

// Add event listener to the form submission
// document.getElementById('verification-form').addEventListener('submit', submitFormData);

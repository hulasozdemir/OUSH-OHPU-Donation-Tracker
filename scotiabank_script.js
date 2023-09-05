// Define the allocations
var allocations = {
  "Ontario": 39480,
  "Alberta": 20780,
  "Quebec": 9940,
  "British Columbia": 10080,
  "Manitoba": 10910,
  "Saskatchewan": 2950,
  "Nova Scotia": 2400,
  "New Brunswick": 1810,
  "Newfoundland and Labrador": 1470,
  "Prince Edward Island": 140,
  "Nunavut, Yukon, and Northwest Territories": 40
  // ... add other provinces
};
// Define the allocations

//   var totalSpendings = 0;
//   var remainingAmount = 0;
var visaCost = 51.5;
var groceryCost = 50;

// When the user selects a province, display the total allocation
document.getElementById('province').addEventListener('change', function (event) {
  // Get the selected province
  var province = event.target.value;

  // Fetch the allocation for this province
  var allocation = allocations[province];
  var formattedAllocation = allocation.toLocaleString();

  // Display the allocation
  document.getElementById('allocationDisplay').innerText = "$" + formattedAllocation;
});

// Update the total spent for each SPO when the number of gift cards changes
document.querySelectorAll('.spoSection').forEach(function (section) {
  var visaInput = section.querySelector('input[type="number"]');
  var groceryInput = section.querySelectorAll('input[type="number"]')[1];

  var spoInput = section.querySelector('input[type="text"]');
  // Event listener for Visa gift cards
  visaInput.addEventListener('input', updateTotal);

  // Event listener for Grocery gift cards
  groceryInput.addEventListener('input', updateTotal);

  spoInput.addEventListener('input', updateTotal);

  function updateTotal() {
    var spoName = spoInput.value || "SPO";
    var visaCards = visaInput.value || 0;
    var visaTotal = visaCards * visaCost;

    var groceryCards = groceryInput.value || 0;
    var groceryTotal = groceryCards * groceryCost;

    const total = visaTotal + groceryTotal;
    var totalFormatted = total.toLocaleString();

    section.querySelector('p').innerText = "Allocated amount to " + spoName + ": $" + totalFormatted;
    console.log(totalFormatted, total)
    updateGrandTotal();
  }
});

function updateGrandTotal() {
  var totalSpendings = 0;
  // Get the spending for each SPO and add it to the total
  document.querySelectorAll('.spoSection p').forEach(function (totalElement) {
    var totalText = totalElement.innerText;
    if (totalText.includes(':')) {
      var totalValue = totalText.split(':')[1].trim().split('$')[1].replace(/,/g, '');
      if (totalValue) {
        var total = parseFloat(totalValue);
        totalSpendings += total;
      }
    }
  });

  document.getElementById('totalSpendings').innerText = totalSpendings;

  var allocation = parseFloat(document.getElementById('allocationDisplay').innerText.split('$')[1].replace(/,/g, ''));
  var remainingAmount = allocation - totalSpendings;

  var formattedAllocation = allocation.toLocaleString();
  var formattedTotalSpendings = totalSpendings.toLocaleString();
  var formattedRemainingAmount = remainingAmount.toLocaleString();
  console.log(formattedAllocation, formattedTotalSpendings, formattedRemainingAmount)
  document.getElementById('allocationDisplay').innerText = "$" + formattedAllocation;
  document.getElementById('totalSpendings').innerText = "$" + formattedTotalSpendings;
  var remainingElement = document.getElementById('remainingAmount');
  remainingElement.innerText = "$" + formattedRemainingAmount;

  // Apply red color if remaining amount is negative
  if (remainingAmount < 0) {
    remainingElement.style.color = "red";
  } else {
    remainingElement.style.color = "";
  }
}

// Function to validate the form before submission
// function validateForm() {
//     var allocation = parseFloat(document.getElementById('allocationDisplay').innerText.split('$')[1].replace(/,/g, ''));
//     var totalSpendings = parseFloat(document.getElementById('totalSpendings').innerText.split('$')[1].replace(/,/g, ''));
//     var remainingAmount = allocation - totalSpendings;

//     var SPOname1 = document.getElementById('spo1name').innerText
//     var provinceName = document.getElementById('province').innerText
//     console.log(provinceName)
//     if (false) {
//       alert("Remaining amount cannot be negative or SPO name cannot be empty. Please adjust your allocations.");
//       return false; // Reject form submission
//     }

//     return true; // Allow form submission
//   }

const formData = document.getElementById('allocationForm');
const submitBtn = document.getElementById('submitBtn');

formData.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  // Function to submit form data to Google Sheets

  submitBtn.textContent = 'Processing...';


  const province = document.getElementById('province').value;
  const spo1name = document.getElementById('spo1name').value;
  const spo1address = document.getElementById('spo1address').value;
  const spo1contact = document.getElementById('spo1contact').value;
  const spo1contactemail = document.getElementById('spo1contactemail').value;
  const spo1visa = document.getElementById('spo1visa').value;
  const spo1grocery = document.getElementById('spo1grocery').value;

  const spo2name = document.getElementById('spo2name').value;
  const spo2address = document.getElementById('spo2address').value;
  const spo2contact = document.getElementById('spo2contact').value;
  const spo2contactemail = document.getElementById('spo2contactemail').value;
  const spo2visa = document.getElementById('spo2visa').value;
  const spo2grocery = document.getElementById('spo2grocery').value;

  const spo3name = document.getElementById('spo3name').value;
  const spo3address = document.getElementById('spo3address').value;
  const spo3contact = document.getElementById('spo3contact').value;
  const spo3contactemail = document.getElementById('spo3contactemail').value;
  const spo3visa = document.getElementById('spo3visa').value;
  const spo3grocery = document.getElementById('spo3grocery').value;

  const spo4name = document.getElementById('spo4name').value;
  const spo4address = document.getElementById('spo4address').value;
  const spo4contact = document.getElementById('spo4contact').value;
  const spo4contactemail = document.getElementById('spo4contactemail').value;
  const spo4visa = document.getElementById('spo4visa').value;
  const spo4grocery = document.getElementById('spo4grocery').value;

  const spo5name = document.getElementById('spo5name').value;
  const spo5address = document.getElementById('spo5address').value;
  const spo5contact = document.getElementById('spo5contact').value;
  const spo5contactemail = document.getElementById('spo5contactemail').value;
  const spo5visa = document.getElementById('spo5visa').value;
  const spo5grocery = document.getElementById('spo5grocery').value;

  const spo6name = document.getElementById('spo6name').value;
  const spo6address = document.getElementById('spo6address').value;
  const spo6contact = document.getElementById('spo6contact').value;
  const spo6contactemail = document.getElementById('spo6contactemail').value;
  const spo6visa = document.getElementById('spo6visa').value;
  const spo6grocery = document.getElementById('spo6grocery').value;

  // Prepare the data to be submitted (customize as per your needs)
  const data = {
    province,
    spo1name,
    spo1address,
    spo1contact,
    spo1contactemail,
    spo1visa,
    spo1grocery,
    spo2name,
    spo2address,
    spo2contact,
    spo2contactemail,
    spo2visa,
    spo2grocery,
    spo3name,
    spo3address,
    spo3contact,
    spo3contactemail,
    spo3visa,
    spo3grocery,
    spo4name,
    spo4address,
    spo4contact,
    spo4contactemail,
    spo4visa,
    spo4grocery,
    spo5name,
    spo5address,
    spo5contact,
    spo5contactemail,
    spo5visa,
    spo5grocery,
    spo6name,
    spo6address,
    spo6contact,
    spo6contactemail,
    spo6visa,
    spo6grocery
  };

  const proxyUrl = '';
  // const targetUrl = "https://script.google.com/macros/s/AKfycbyWTEgYLButnm5unIDIgB4vXIgV7gaAZr2q8YKLWYxFosGjtBf0m7Nvg2-blbURReja/exec"; //oush
  const targetUrl = '';

  var allocation = parseFloat(document.getElementById('allocationDisplay').innerText.split('$')[1].replace(/,/g, ''));
  var totalSpendings = parseFloat(document.getElementById('totalSpendings').innerText.split('$')[1].replace(/,/g, ''));
  var remainingAmount = allocation - totalSpendings;

  var SPOname1 = document.getElementById('spo1name').innerText
  var provinceName = document.getElementById('province').innerText
  console.log(provinceName)
  if (remainingAmount < 0 || SPOname1 == undefined) {
    alert("Remaining amount cannot be negative or SPO name cannot be empty. Please adjust your allocations.");
    return; // Reject form submission
  }

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
  


    // After the form submission is complete, restore the original text of the submit button
    



    // Rest of your form submission code...

    // Example delay to simulate server processing
    await new Promise(resolve => setTimeout(resolve, 200000));

    submitBtn.textContent = 'Submit';
});

const provinceDropdown = document.getElementById('province');
const formContent = document.getElementById('form-content');

// Add an event listener to the province dropdown
provinceDropdown.addEventListener('change', function () {
  const selectedProvince = provinceDropdown.value;

  // Display the form content if a province is selected, otherwise hide it
  if (selectedProvince) {
    formContent.style.display = 'block';
  } else {
    formContent.style.display = 'none';
  }
});


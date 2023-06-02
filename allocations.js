
function updateTotal(columnId) {
    var total = 0;

    total += parseInt(document.getElementById('housing_' + columnId).value) || 0;
    total += parseInt(document.getElementById('food_' + columnId).value) || 0;
    total += parseInt(document.getElementById('homesupplies_' + columnId).value) || 0;
    // total += parseInt(document.getElementById('transportation_' + columnId).value) || 0;
    total += parseInt(document.getElementById('clothing_' + columnId).value) || 0;
    total += parseInt(document.getElementById('employment_' + columnId).value) || 0;

    if(total > 100){
        document.getElementById('errorMsg').innerText = "Total cannot exceed 100%";
        document.activeElement.value = currentFieldValue - (total - 100);
        total = 100;
    } else {
        document.getElementById('errorMsg').innerText = "";
    }
    // document.getElementById('errorMsg').innerText = total !== 100 ? "Total must be 100%" : "";
    document.getElementById('total_' + columnId).textContent = total + ' %';
}

function validateForm(formId) {
    var total = parseInt(document.getElementById('total_' + formId).textContent) || 0;
  
    if (total !== 100) {
      document.getElementById('error' + formId).textContent = 'Percentages for ' + formId + ' must add up to 100%.';
      return false;
    }
  
    document.getElementById('error' + formId).textContent = '';
    return true;
  }


const formElement = document.getElementById('allocations-form');
const submitButton = document.getElementById('submitBtn');



formElement.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // var isFormValid = true;
    // isFormValid &= validateForm('1');
    // isFormValid &= validateForm('2');
  
    // if (!isFormValid) {
    //   alert("Please make sure allocations are correct.")
    //   return;
    // }

    const province = document.getElementById('province').value;
    const housing_1 = document.getElementById('housing_1').value;
    const housing_2 = document.getElementById('housing_2').value;

    const food_1 = document.getElementById('food_1').value;
    const food_2 = document.getElementById('food_2').value;

    const homesupplies_1 = document.getElementById('homesupplies_1').value;
    const homesupplies_2 = document.getElementById('homesupplies_2').value;

    // const transportation_1 = document.getElementById('transportation_1').value;
    // const transportation_2 = document.getElementById('transportation_2').value;

    const clothing_1 = document.getElementById('clothing_1').value;
    const clothing_2 = document.getElementById('clothing_2').value;

    const employment_1 = document.getElementById('employment_1').value;
    const employment_2 = document.getElementById('employment_2').value;


    // const formData = {
    //     province,
    //     housing_1,
    //     food_1,
    //     homesupplies_1,
    //     transportation_1,
    //     clothing_1,
    //     employment_1,
    //     housing_2,
    //     food_2,
    //     homesupplies_2,
    //     transportation_2,
    //     clothing_2,
    //     employment_2
    // };

    const formData = {
        province,
        housing_1,
        food_1,
        homesupplies_1,
        clothing_1,
        employment_1,
        housing_2,
        food_2,
        homesupplies_2,
        clothing_2,
        employment_2
    };

    const proxyUrl = '';
    // const targetEndpoint = 'https://script.google.com/macros/s/AKfycbyV8Z4YH4puhUxMzz1IthUrd8jx-tg9xe4kXAb2KYikh1gzRjF5gTqEZCnKA4_88wspTQ/exec'; # ulas
    const targetEndpoint = "https://script.google.com/macros/s/AKfycbwHctAfTR3C5jKPr1GQbjAD_FYcp2JzLmkkIImDQGuPgusWwb4kto_VPbMs4ExlhOMGLA/exec";
  
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
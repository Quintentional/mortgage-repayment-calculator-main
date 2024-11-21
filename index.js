// // --------------------------Create focus states for inputs--------------------------------
const input = document.querySelectorAll('input');

input.forEach( (field) => {

    field.addEventListener('focus', () => {
        const inputDiv = field.parentNode;
        const indicator = inputDiv.querySelector('.indicator');
        inputDiv.classList.add('focused');
        indicator.style.backgroundColor='hsl(61, 70%, 52%)';
    })
    
    field.addEventListener('blur', () => {
        const inputDiv = field.parentNode;
        const indicator = inputDiv.querySelector('.indicator');
        inputDiv.classList.remove('focused');
        indicator.style.backgroundColor='hsl(202, 86%, 94%)';
    });
  });

// ------------------------------Create focus state for custom radio buttons------------------------------


const radioDivs = document.querySelectorAll('.radio-div');

radioDivs.forEach((div) => {
    div.addEventListener('click', () => {
        // Clear styles from all radio-divs
        radioDivs.forEach((otherDiv) => {
            const otherRadioButton = otherDiv.querySelector('.radio-button');
            const otherRadioButtonSelected = otherDiv.querySelector('.radio-button-selected');

            otherDiv.classList.remove('focused');           
            otherRadioButton.classList.remove('focused');           
            otherRadioButtonSelected.style.display = "none";
            
        });

        // Apply styles to the clicked radio-div
        const radioButton = div.querySelector('.radio-button');
        const radioButtonSelected = div.querySelector('.radio-button-selected');

        div.classList.add('focused');
        if (radioButton) {
            radioButton.classList.add('radio-focused');
        }
        if (radioButtonSelected) {
            radioButtonSelected.style.display = "block";
        }
    });
});

//---------------------------------------------Clear fields when "Clear All" button is pressed-------------------------------

const clear = document.querySelector('.clear');
clear.addEventListener('click', () => {
    location.reload();
})


//---------------------------------Show error if field is empty---------------------------------------------------

calculate.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent form from submitting

    // Track if the form is valid
    let isFormValid = true;

    // Check inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        const parent = input.closest('.form-area');
        const error = parent.querySelector('.error');

        if (input.value.trim() === '') {
            if (error) {
                error.style.display = 'block'; // Show error

            }
            isFormValid = false; // Mark form as invalid
        } else {
            if (error) {
                error.style.display = 'none'; // Hide error if input is valid
            }
        }
    });

    // Check radio buttons
    const radioDivs = document.querySelectorAll('.radio-div');
    const anyRadioSelected = Array.from(radioDivs).some((div) =>
        div.classList.contains('focused')
    );
    const radioError = document.querySelector('.radio-error'); // Adjust selector if needed

    if (!anyRadioSelected) {
        if (radioError) {
            radioError.style.display = 'block'; // Show radio error

        }
        isFormValid = false; // Mark form as invalid
    } else {
        if (radioError) {
            radioError.style.display = 'none'; // Hide radio error if valid
            //Show Results Page
        }
    }

    // Final action if form is valid
    if (isFormValid) {
        console.log('Form is valid! Proceed to calculate...');
        //Show Results Page
        const results = document.querySelector('#results-used');
        const noResults = document.querySelector('#results-empty');
        results.style.display="flex";
        noResults.style.display="none";
        // Perform calculation or next steps here
        calculateMortgage();
    } else {
        console.log('Form has errors. Please fix them.');
    }
});



//-----------------------------------------------Calculate Mortgage--------------------------------------------------

const calculateMortgage = function() {
    const mortgageAmount = parseFloat(document.querySelector('#amount').value);
    let interestRate = parseFloat(document.querySelector('#rate').value);
    let mortgageTerm = parseFloat(document.querySelector('#term').value);
    const focusedRadioButton = document.querySelector('.radio-focused');
    const monthlyPaymentElement = document.querySelector('.monthly-amount');
    const totalPaymentElement = document.querySelector('.term-total');

    // Validate inputs to ensure they're numbers
    if (isNaN(mortgageAmount) || isNaN(interestRate) || isNaN(mortgageTerm)) {
        alert('Please enter valid numbers for all fields and select a repayment type.');
        return;
    }

    // Get mortgage term in months and monthly interest rate
    const totalPayments = mortgageTerm * 12;
    const monthlyRate = interestRate / 100 / 12;

    let monthlyPayment;
    let totalPayment;

    if (focusedRadioButton.classList.contains('repayment-button')) {
        // Repayment mortgage calculation
        monthlyPayment = (mortgageAmount * monthlyRate * (1 + monthlyRate) ** totalPayments) / 
                         ((1 + monthlyRate) ** totalPayments - 1);
        totalPayment = monthlyPayment * totalPayments;
    } else if (focusedRadioButton.classList.contains('interest-button')) {
        // Interest-only mortgage calculation
        monthlyPayment = mortgageAmount * monthlyRate;
        totalPayment = monthlyPayment * totalPayments;
    }

    // Check for divide-by-zero or invalid inputs
    if (!isFinite(monthlyPayment)) {
        alert('Calculation error. Please check your input values.');
        return;
    }

    // Format numbers with commas and pound sign
    const formatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2,
    });

    // Update UI
    monthlyPaymentElement.innerText = formatter.format(monthlyPayment);
    totalPaymentElement.innerText = formatter.format(totalPayment);
};



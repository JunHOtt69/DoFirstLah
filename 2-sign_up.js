const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const emailSignupInput = document.getElementById('emailSignUp');
const passwordSignupInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm_password');
const singupBtn = document.getElementById('singupBtn');
const signupProceed = document.getElementById('signupProceed');
const errorMSignup1 = document.getElementById('errorMS1');
const errorMSignup2 = document.getElementById('errorMS2');
const returnBtn = document.getElementById('returnForm1');
errorMSignup1.classList.add('hide');
errorMSignup2.classList.add('hide');

function getInputValue(type){
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const emailSignupInput = document.getElementById('emailSignUp');
    const passwordSignupInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const securityQuestionInput = document.getElementById('securityQuestion');
    const securityAnswerInput = document.getElementById('securityAnswer');

    const fName = firstNameInput.value.trim();
    const lName = lastNameInput.value.trim();
    const email = emailSignupInput.value.trim();
    const password = passwordSignupInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const securityQuestion = securityQuestionInput.value.trim();
    const securityAnswer = securityAnswerInput.value.trim();

    if(type === '1'){
        return [fName, lName, email, password, confirmPassword];
    }

    if(type === '2'){
        return [fName, lName, email, password, confirmPassword, securityQuestion, securityAnswer];
    }
}

signupProceed.addEventListener('click', async(e) => {
    e.preventDefault();
    const [fName, lName, email, password, confirmPassword] = getInputValue('1');

    if(!fName || !lName || !email || !password || !confirmPassword){
        errorMSignup1.textContent = '*Fields cannot be empty*';
        errorMSignup1.classList.remove('hide');
        return;
    }
    else if(password !== confirmPassword){
        errorMSignup1.textContent = '*Confirm Password not matched with Password*';
        errorMSignup1.classList.remove('hide');
        return;
    }
    try {
        const res = await fetch('check_email_exists.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();

        if (data.exists) {
            errorMSignup1.textContent = '*Email already registered. Please log in instead.*';
            errorMSignup1.classList.remove('hide');
            return;
        }
    } catch (err) {
        console.error('Error checking email:', err);
        errorMSignup1.textContent = '*Server error, please try again later.*';
        errorMSignup1.classList.remove('hide');
        return;
    }

    errorMSignup1.textContent = '';
    errorMSignup1.classList.add('hide');
    const wrapper1 = document.getElementById('signupForm1');
    const wrapper2 = document.getElementById('signupForm2');

    wrapper1.classList.add('hide');
    wrapper2.classList.remove('hide');

});

singupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const [fName, lName, email, password, confirmPassword, securityQuestion, securityAnswer] = getInputValue('2');

    if(!fName || !lName || !email || !password || !confirmPassword || !securityAnswer){
        errorMSignup2.textContent = '*Fields cannot be empty*';
        errorMSignup2.classList.remove('hide');
        return;
    }
    else if(securityQuestion === 'default'){
        errorMSignup2.textContent = '*Please select a security question*';
        errorMSignup2.classList.remove('hide');
        return;
    }
    else if(password !== confirmPassword){
        errorMSignup2.textContent = '*Confirm Password not matched with Password*';
        errorMSignup2.classList.remove('hide');
        return;
    }
    else{
        errorMSignup2.textContent = '';
        errorMSignup2.classList.add('hide');
        
        document.querySelector('form').submit();
    }
});

returnBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const wrapper1 = document.getElementById('signupForm1');
    const wrapper2 = document.getElementById('signupForm2');
    wrapper1.classList.remove('hide');
    wrapper2.classList.add('hide');
});
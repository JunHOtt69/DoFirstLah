// document.addEventListener("DOMContentLoaded", () => {
//     const eyeicons = document.querySelectorAll(".eyeicon");

//     eyeicons.forEach((icon)=> {
//         icon.addEventListener('click', ()=>{
//             const input = icon.previousElementSibling;
//             if (input.type === "password"){
//                 input.type = "text";
//                 icon.src = './images/password_active.svg';
//             } else{
//                 input.type = "password";
//                 icon.src = './images/password_inactive.svg';
//             }
//         })
//     })

//     const form1 = document.getElementById('forgetPasswordForm1');
//     const form2 = document.getElementById('forgetPasswordForm2');
//     const form3 = document.getElementById('forgetPasswordForm3');

//     const error1 = document.getElementById('errorMFP1');
//     const error2 = document.getElementById('errorMFP2');
//     const error3 = document.getElementById('errorMFP3');

//     const verifyBtn = document.getElementById('verifyBtn');
//     const proceedBtn = document.getElementById('proceedBtn');
//     const returnBtn = document.getElementById('returnForm1');
//     const signupProceed = document.getElementById('signupProceed');

//     verifyBtn.addEventListener('click', async (e) => {
//         e.preventDefault();
//         const email = document.getElementById('email').value.trim();

//         if (!email) {
//             error1.textContent = '*Email cannot be empty*';
//             error1.classList.remove('hide');
//             return;
//         }

//         const response = await fetch('verify_email.php', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//             body: `email=${encodeURIComponent(email)}`
//         });

//         const data = await response.json();

//         if (data.status === 'error') {
//             error1.textContent = 'Email not found.';
//             error1.classList.remove('hide');
//         } else {
//             error1.classList.add('hide');
//             form1.classList.add('hide');
//             form2.classList.remove('hide');
//             form3.classList.add('hide');
//         }
//     });

//     proceedBtn.addEventListener('click', async (e) => {
//         e.preventDefault();
//         const question = document.getElementById('securityQuestion').value;
//         const answer = document.getElementById('securityAnswer').value.trim();
//         const email = document.getElementById('email').value.trim();

//         if (question === 'default' || !answer) {
//             error2.textContent = '*Please complete all fields*';
//             error2.classList.remove('hide');
//             return;
//         }

//         const response = await fetch('verify_security.php', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//             body: `email=${encodeURIComponent(email)}&question=${encodeURIComponent(question)}&answer=${encodeURIComponent(answer)}`
//         });

//         const data = await response.json();

//         if (data.status === 'error') {
//             error2.textContent = 'Invalid security question or answer.';
//             error2.classList.remove('hide');
//         } else {
//             error2.classList.add('hide');
//             form2.classList.add('hide');
//             form3.classList.remove('hide');
//         }
//     });

//     returnBtn.addEventListener('click', (e) => {
//         e.preventDefault();
//         document.getElementById('securityAnswer').value = '';
//         document.getElementById('securityQuestion').value = 'default';
//         error2.classList.add('hide');

//         form3.classList.add('hide');
//         form2.classList.add('hide');
//         form1.classList.remove('hide');
//     });

//     signupProceed.addEventListener('click', async (e) => {
//         e.preventDefault();
//         const password = document.getElementById('password').value;
//         const confirmPassword = document.getElementById('confirm_password').value;
//         const email = document.getElementById('email').value.trim();

//         if (!password || !confirmPassword) {
//             error3.textContent = '*Fields cannot be empty*';
//             error3.classList.remove('hide');
//             return;
//         }
//         if (password !== confirmPassword) {
//             error3.textContent = 'New password and confirm password not matched.';
//             error3.classList.remove('hide');
//             return;
//         }

//         const response = await fetch('reset_password.php', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//             body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
//         });

//         const data = await response.json();

//         if (data.status === 'success') {
//             window.location.href = '2-log_in.php?success=reset';
//         }
//     });
// });

const form = document.querySelector('.forgetPasswordForm');
const stepInput = document.getElementById('step');
const form1 = document.getElementById('forgetPasswordForm1');
const form2 = document.getElementById('forgetPasswordForm2');
const form3 = document.getElementById('forgetPasswordForm3');

form.addEventListener('submit', e => {
    form.setAttribute('novalidate', true);
    e.preventDefault();
    const step = stepInput.value;

    const formData = new FormData(form);

    fetch('submit_forgetPassword.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            if(step === '1'){
                stepInput.value = '2';
                form1.classList.add('hide');
                form2.classList.remove('hide');
            }
            else if(step === '2'){
                stepInput.value = '3';
                form2.classList.add('hide');
                form3.classList.remove('hide');
                const eyeicons = document.querySelectorAll(".eyeicon");

                eyeicons.forEach((icon)=> {
                    icon.addEventListener('click', ()=>{
                        const input = icon.previousElementSibling;
                        if (input.type === "password"){
                            input.type = "text";
                            icon.src = './images/password_active.svg';
                        } else{
                            input.type = "password";
                            icon.src = './images/password_inactive.svg';
                        }
                    })
                });
            }
            else if(step === '3'){
                alert("Password reset successful!");
                window.location.href = "2-log_in.php";
            }
        } else {
            document.getElementById(`errorMFP${step}`).textContent = data.message;
            document.getElementById(`errorMFP${step}`).classList.remove('hide');
        }
    });
});

document.getElementById('returnForm1').addEventListener('click', e => {
    e.preventDefault();
    stepInput.value = '1';
    document.getElementById('securityAnswer').value = '';
    document.getElementById('securityQuestion').value = 'default';
    document.getElementById(`errorMFP2`).textContent = '';
            document.getElementById(`errorMFP2`).classList.add('hide');
    form2.classList.add('hide');
    form1.classList.remove('hide');
});


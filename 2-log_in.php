<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0">
    <link rel="stylesheet" href="1-landing_background.css">
    <link rel="stylesheet" href="2-auth.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
    <title>DoFirstLah</title>
</head>
<body>
    <div class="wrapper">
            <div class="rectangle1 top-left"></div>
            <div class="rectangle2 top-right"></div>
            <div class="rectangle3 bottom-left"></div>
            <div class="rectangle4 bottom-right"></div>
    </div>
    <div class="wrapper2">
            <img src="./images/mark1.png" alt="" class="mark1"/>
            <img src="./images/mark1.png" alt="" class="mark2"/>
            <img src="./images/mark1.png" alt="" class="mark3"/> 
    </div>

    <header class="lan-navbar">
        <img src="./images/DoFirstLah logo.svg" alt="DoFirstLah Logo" class="logo"/>
        <div class="shortcut-wrapper">
            <p class="helper-text">Do not have an account?</p>
            <div class="redirect">
                <a href="2-sign_up.php" class = "lan-nav-link">Sign Up.</a>
                <a href="2-sign_up.php"><img src="./images/arrow_right.svg" alt="arrow_right" class="arrow-right"></a>
            </div>
        </div>
    </header>
    <div class="messageDialog"></div>
    <main class="form-content">
        <form action="submit_login.php" method="post">
            <div class="form-group">
                <h2 class="subtitle">Welcome Back to the Hustle.</h2>
                <h1 class="title">Log In Now.</h1>
            </div>

            <div class="wrapper3">
                <div class="input-box">
                    <input type="email" id="email" name="email" placeholder= "Email Address. e.g. abc@email.com" required>
                </div>

                <div class="input-box">
                    <input type="password" id="password" name="password" placeholder= "Password" required>
                    <img src="./images/password_inactive.svg" class="eyeicon">
                </div>
                
                <div class="remember-forgot">
                    <div class="remember-me">
                        <input type="checkbox" name="rememberMe" id="rememberMe">
                        <label class="cbx" for="rememberMe"></label>
                        <label class="remember-text" for="rememberMe">Remember Me</label>
                    </div>
                    <a href="2-forget_password.php">Forget Password?</a>
                </div>
                <div class="errorMessage hide" id="errorMLI">ERROR</div>
                <button type="submit" class="button">Log In</button>
            </div>
        </form>
    </main>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
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
            })
            
            const params = new URLSearchParams(window.location.search);
            const error = params.get('error');
            const success = params.get('success');
            const messageContainer = document.querySelector('.messageDialog');
            const errorBox = document.getElementById('errorMLI');

            if (error === 'email') {
                errorBox.textContent = 'Email not found.';
                errorBox.classList.remove('hide');
            } else if (error === 'password') {
                errorBox.textContent = 'Incorrect password.';
                errorBox.classList.remove('hide');
            }

            if (success === 'signup') {
                const successfulMessage = document.createElement('div');
                successfulMessage.classList.add('successfulMessage');
                successfulMessage.innerHTML = `Successfully signed up. Proceed to Log In.`;
                messageContainer.appendChild(successfulMessage);
                successfulMessage.classList.add('active');

                setTimeout(() => {
                    successfulMessage.remove();
                }, 5000);
            }

            if (success === 'reset') {
                const successfulMessage = document.createElement('div');
                successfulMessage.classList.add('successfulMessage');
                successfulMessage.innerHTML = `Password reset successful. Please log in.`;
                messageContainer.appendChild(successfulMessage);
                successfulMessage.classList.add('active');
                setTimeout(() => successfulMessage.remove(), 5000);
            }
        });
    </script>
</body>
</html>
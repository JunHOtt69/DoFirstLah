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
            <p class="helper-text">Remembered your account?</p>
            <div class="redirect">
                <a href="2-log_in.php" class = "lan-nav-link">Log In Now.</a>
                <a href="2-log_in.php"><img src="./images/arrow_right.svg" alt="arrow_right" class="arrow-right"></a>
            </div>
        </div>
    </header>

    <main class="form-content">
        <form action="submit_forgetPassword.php" method="post" class="forgetPasswordForm" novalidate>
            <div class="form-group">
                <h2 class="subtitle">Get Back to the Grind in Seconds.</h2>
                <h1 class="title">Reset Your Password.</h1>
            </div>
            <div class="wrapper3" id="forgetPasswordForm1">
                <input type="hidden" name="step" id="step" value="1">
                <div class="input-box">
                    <input type="email" id="email" name="email" placeholder= "Email Address. e.g. abc@email.com" required>
                </div>
                <div class="errorMessage hide" id="errorMFP1">ERROR</div>
                <button id="verifyBtn" class="button">Verify</button>
            </div>
            <div class="wrapper5 hide" id="forgetPasswordForm2">
                <select name="securityQuestion" id="securityQuestion">
                    <option value="default" selected>Select a security question</option>
                    <option value="pet">What is your first pet's name?</option>
                    <option value="school">What is name of your primary school?</option>
                    <option value="food">What is your favorite food?</option>
                    <option value="color">What is your favorite color?</option>
                </select>
                
                <div class="input-box">
                    <input type="text" id="securityAnswer" name="securityAnswer" placeholder="Enter your answer" required>
                </div>
                <div class="errorMessage hide" id="errorMFP2">ERROR</div>
                <div class="buttonWrapperSignup">
                    <button id="returnForm1" class="button return">Return</button>
                    <button type="submit" id="proceedBtn" class="button">Proceed</button>
                </div>
            </div>

            <div class="wrapper3 hide" id="forgetPasswordForm3">
                <div class="input-box">
                    <input type="password" id="password" name="password" placeholder= "New Password" required>
                    <img src="./images/password_inactive.svg" class="eyeicon">
                </div>

                <div class="input-box">
                    <input type="password" id="confirm_password" name="confirm_password" placeholder= "Confirm New Password"  required>
                    <img src="./images/password_inactive.svg" class="eyeicon">
                </div>
                <div class="errorMessage hide" id="errorMFP3">ERROR</div>
                <button class="button" id="signupProceed">Proceed</button>
            </div>
        </form>
    </main>

    <script src="2-forget_password.js"></script>

</body>
</html>
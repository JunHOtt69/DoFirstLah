<?php
require 'config.php';
session_start();

if (!isset($_SESSION['userID']) && isset($_COOKIE['rememberMe'])) {
    $token = $_COOKIE['rememberMe'];

    $stmt = $conn->prepare("SELECT * FROM user_tokens WHERE Token = ? AND Expiry > NOW()");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $_SESSION['userID'] = $row['UserID'];
    } else {
        setcookie('rememberMe', '', time() - 3600, '/');
    }
}

if (!isset($_SESSION['userID'])) {
    header("Location: 2-log_in.php");
    exit;
}
$userID = $_SESSION['userID'];


$stmt = $conn->prepare("SELECT FullName, Email, AvatarColor FROM users WHERE UserID = ?");
$stmt->bind_param("s", $userID);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    die("User not found.");
}

$fullName = htmlspecialchars($user['FullName']);
$email = htmlspecialchars($user['Email']);
$avatarColor = htmlspecialchars($user['AvatarColor']);


$project = $_SESSION['currentProject'] ?? null;

if (!$project) {
    die('Project data not found in session.');
}

$projectID = htmlspecialchars($project['ProjectID']);
$projectName = htmlspecialchars($project['name']);
$projectDesc = htmlspecialchars($project['Description'] ?? '');
$projectStart = htmlspecialchars($project['StartDate'] ?? '');
$projectEnd = htmlspecialchars($project['EndDate'] ?? '');
$decryptedCode = openssl_decrypt(
    base64_decode($project['InviteCode']),
    'AES-128-ECB',
    ENCRYPTION_KEY,
    OPENSSL_RAW_DATA
);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="3-default_settings.css">
    <link rel="stylesheet" href="3-nav_profile_setting.css">
    <link rel="stylesheet" href="5-leftNavBar.css">
    <link rel="stylesheet" href="6-projectMember.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
    <style>
        :root {
            --logged-in-user-avatar: var(<?php echo $avatarColor; ?>);
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <img src="./images/purple-shape.svg" alt="" class="shape1">
        <img src="./images/blue-shape.svg" alt="" class="shape2">
        <img src="./images/green-shape.svg" alt="" class="shape3">
        <img src="./images/red-shape.svg" alt="" class="shape4">
        <img src="./images/orange-shape.svg" alt="" class="shape5">
    </div>
    
    <header class="navbar">
        <img src="./images/DoFirstLah logo.svg" alt="DoFirstLah Logo" class="logo"/>
        <ul class="nav-menu" id="navItems">
            <li><a href="3-user_dashboard.php" class="myDashboard">My Dashboard</a></li>
            <li><a href="4-myHustle.php"class="myHustle">My Hustle</a></li>
            <li>
                <div class="avatar" id="toggleBtn" onclick="toggleProfile()" >
                    <?php echo strtoupper(substr($fullName, 0, 1)); ?>
                </div>
            </li>
        </ul>
    </header> 
    
    <div class="suggestionPopUps">
    </div>

    <div class="rolePopups">
        <div class="option" id="managerOpt">Project Manager</div>
        <div class="option" id="memberOpt">Team Member</div>
    </div>
    
    <div class="navMenuProfile" id="navMenuProfile">
        <div>
            <div class="navbarShape"></div>
            <div class="contentHolder">
                <section class="content" id="content">
                    <div class="leftNavPanel panel">
                        <div class="leftNavPanelItem">
                            <div class="projectAvatar"></div>
                            <h3 class="projectName"><?php echo $projectName; ?></h3>
                        </div>
                        <a class="leftNavPanelItem" href="5-projectSummary.php">
                            <svg viewBox="0 0 178 148" xmlns="http://www.w3.org/2000/svg">
                                <path d="M47.486 89L8.85463 122.029C3.74219 125.945 2.56422 133.165 6.16702 138.502C10.0341 144.231 17.89 145.594 23.4609 141.503L62.7529 105.48M61.7529 69L105.753 32L122.253 60.5L169.5 17M144 4.5L173.253 14V44.5M148.753 61C148.753 91.0995 124.352 115.5 94.253 115.5C64.1535 115.5 39.753 91.0995 39.753 61C39.753 30.9005 64.1535 6.5 94.253 6.5C124.352 6.5 148.753 30.9005 148.753 61Z" />
                            </svg>
                            <h3>Summary</h3>
                        </a>
                        <a class="leftNavPanelItem active" href="6-projectMember.php">
                            <svg viewBox="0 0 169 178" xmlns="http://www.w3.org/2000/svg">
                                <path d="M59.4997 80.624C62.2668 84.6261 65.7565 88.087 69.7792 90.8165M59.4997 80.624C67.9464 72.5247 73.2051 61.1264 73.2051 48.5C73.2051 40.772 71.2352 33.5041 67.7701 27.1711M59.4997 80.624C57.6742 82.3744 55.6997 83.9707 53.5973 85.3921M69.7792 90.8165C69.0889 91.0587 68.4073 91.3066 67.7343 91.5603M69.7792 90.8165C76.0251 95.0546 83.556 97.5294 91.6628 97.5294C99.7697 97.5294 107.301 95.0546 113.546 90.8165M67.7343 91.5603C103.495 110.685 112.273 145.828 111.124 169M67.7343 91.5603C63.4239 89.2551 58.7216 87.1827 53.5973 85.3921M111.124 169H150.436C158.032 169 164.554 163.29 164.01 155.713C162.391 133.206 150.338 103.72 113.546 90.8165M111.124 169V169C110.982 171.86 108.55 174 105.687 174H19.7051C11.4208 174 4.70508 167.284 4.70508 159V85.9798M113.546 90.8165C123.947 83.7595 130.784 71.8135 130.784 58.2647C130.784 36.5794 113.269 19 91.6628 19C82.6662 19 74.3789 22.0479 67.7701 27.1711M67.7701 27.1711C60.2154 13.3637 45.5538 4 28.7051 4C22.7866 4 17.1379 5.15542 11.9724 7.25299C7.23936 9.17496 4.70508 14.1092 4.70508 19.2176V85.9798M53.5973 85.3921C46.4927 90.1952 37.9265 93 28.7051 93C19.8665 93 11.6297 90.4232 4.70508 85.9798"/>
                            </svg>
                            <h3>Member</h3>
                        </a>
                        <a class="leftNavPanelItem" href="6-projectTasks.php">
                            <svg class="taskIcon" viewBox="0 0 59 73" xmlns="http://www.w3.org/2000/svg">
                                <path d="M45.1226 13.385V12.5225C45.1226 10.5218 43.5261 8.9 41.5566 8.9H41.3868C39.5111 8.9 37.9906 7.35538 37.9906 5.45C37.9906 3.54462 36.47 2 34.5943 2H24.5755C22.6998 2 21.1792 3.54462 21.1792 5.45C21.1792 7.35538 19.6587 8.9 17.783 8.9H17.6132C15.6437 8.9 14.0472 10.5218 14.0472 12.5225V13.385M45.1226 13.385C45.1226 15.862 43.1459 17.87 40.7075 17.87H18.4623C16.0239 17.87 14.0472 15.862 14.0472 13.385M45.1226 13.385V13.385C51.4062 13.385 56.5 18.4788 56.5 24.7624V56C56.5 64.2843 49.7843 71 41.5 71H17.5C9.21573 71 2.5 64.2843 2.5 56V24.9322C2.5 18.5548 7.66984 13.385 14.0472 13.385V13.385M14.0472 32.36H45.1226M14.0472 43.055H45.1226M14.0472 53.75H45.1226"/>
                            </svg>
                            <h3>Task</h3>
                        </a>
                        <a class="leftNavPanelItem" href="6-projectGannt.php">
                            <svg viewBox="0 0 171 176" xmlns="http://www.w3.org/2000/svg">
                                <path d="M75.0215 116L144.521 116C156.659 116 166.499 128.337 166.499 143.556V144.444C166.499 159.663 156.659 172 144.521 172H75.0215V116ZM75.0215 116L128.021 116C140.159 116 149.999 103.663 149.999 88.4444V87.5556C149.999 72.337 140.159 60 128.021 60L22.0215 60.0005V116L75.0215 116ZM4 4H55.0448C67.1827 4 77.0224 16.337 77.0224 31.5556V32.4444C77.0224 47.663 67.1827 60 55.0448 60H4V4Z" />
                            </svg>
                            <h3>Gannt</h3>
                        </a>
                        <a class="leftNavPanelItem" href="6-projectAttachment.php">
                            <svg viewBox="0 0 168 175" xmlns="http://www.w3.org/2000/svg">
                                <path d="M43.5175 170.512L148.559 69.5704C187 26.5124 141.457 -20.1315 100.922 18.2553L21.2155 88.8194C-15.0699 121.523 15.3656 160.488 55.3533 125.072L124.296 60.1278C140.572 43.6313 121.5 28.0125 105.656 41.8608L39.375 102.646"/>
                            </svg>
                            <h3>Attachment</h3>
                        </a>
                        <div class="resizer"></div>
                    </div>
                    <div class="rightCtnPanel">
                        <div class="panel1 panel">
                            <div class="panel1Header">
                                <h3>Invite People</h3>
                                <div id="inviteCode">
                                    <h4></h4>
                                    <button id="copyICBtn">
                                        <svg id="Livello_1" style="enable-background:new 0 0 100 100;" version="1.1" viewBox="0 0 100 100" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                            <path class="path1" d="M66.4,71.1h-30c-1.7,0-3-1.3-3-3v-34c0-1.7,1.3-3,3-3h30c1.7,0,3,1.3,3,3v34C69.4,69.7,68,71.1,66.4,71.1z M37.4,67.1h28  v-32h-28V67.1z"/>
                                            <path class="path2" d="M73.4,64.1c-1.1,0-2-0.9-2-2v-33h-29c-1.1,0-2-0.9-2-2s0.9-2,2-2h29.6c1.6,0,3.4,1.2,3.4,3v34  C75.4,63.2,74.5,64.1,73.4,64.1z M71.9,29.1L71.9,29.1L71.9,29.1z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="inputWrapper">
                                <input type="email" name="targetEmail" id="targetEmail" placeholder="Enter email to send invite">
                                <button class="sendBtn">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                    </svg>
                                </button>
                            </div>
                            <div class="pending">
                                <h4>Pending Invitation</h4>
                                <div class="pendingWrapper"></div>
                                <label for="" class="errorMessage">*Error Message*</label>
                            </div>
                        </div>
                        
                        <div class="panel2 panel">
                            <div class="panel2Header">
                                <h3>Member</h3>
                                <form action="">
                                    <div class="searchBar">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                        </svg>
                                        <input type="text" placeholder="Search Member" spellcheck="false">
                                        <div class="closeBtn" id="closeBtn"> &times; </div>
                                    </div>
                                </form>
                            </div>                            

                            <div class="table">
                                <div class="tableHeader">
                                    <div class="nameAttribute attribute">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                                        </svg>
                                        Name
                                    </div>
                                    <div class="roleAttribute attribute">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                                        </svg>
                                        Role
                                    </div>
                                    <div class="statusAttribute attribute">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                                        </svg>
                                        Status
                                    </div>
                                    <div class="ctAttribute attribute">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                                        </svg>
                                        Current Task
                                    </div>
                                    <div class="ddAttribute attribute">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                                        </svg>
                                        Due Date
                                    </div>
                                </div>
                                <div class="tableContent"></div>
                            </div>
                        </div>
                    </div>
                    <div class="messageDialog"></div>
                </section>
            </div>
        </div>
        <div class="profileShape">
            <div class="wrapper1">
                <div class="userInfo">
                    <h2><?php echo $fullName; ?></h2>
                    <p><?php echo $email; ?></p>
                </div>

                <div>
                    <svg class="settingIcon" id ="settingIcon" onclick="toggleSetting()" viewBox="0 0 190 198" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M128 98C128 116.225 113.225 131 95 131C76.7746 131 62 116.225 62 98C62 79.7746 76.7746 65 95 65C113.225 65 128 79.7746 128 98Z"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M95 131C113.225 131 128 116.225 128 98C128 79.7746 113.225 65 95 65C76.7746 65 62 79.7746 62 98C62 116.225 76.7746 131 95 131Z"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M95 131C113.225 131 128 116.225 128 98C128 79.7746 113.225 65 95 65C76.7746 65 62 79.7746 62 98C62 116.225 76.7746 131 95 131Z"/>
                        <path d="M63.424 35.5095C66.5194 33.9423 68.845 31.1057 69.4115 27.6827L71.6152 14.3672C72.4141 9.54018 76.5883 6 81.481 6H108.128C112.972 6 117.12 9.47282 117.972 14.2421L120.53 28.5708C121.134 31.9503 123.446 34.746 126.575 36.1593C129.27 37.377 131.85 38.6884 134.327 40.2332C137.302 42.0884 140.947 42.766 144.241 41.5654L157.054 36.896C161.641 35.2242 166.765 37.1093 169.175 41.3554L181.877 63.7364C184.264 67.9419 183.3 73.2528 179.587 76.3507L168.637 85.4872C166.014 87.6754 164.742 91.0489 164.912 94.4603C164.97 95.6328 165 96.813 165 98C165 99.6092 164.946 101.206 164.839 102.788C164.599 106.338 165.924 109.871 168.698 112.1L179.214 120.548C183.104 123.674 184.095 129.189 181.536 133.473L167.39 157.151C164.863 161.381 159.631 163.14 155.062 161.296L142.235 156.118C138.986 154.807 135.316 155.338 132.355 157.211C130.471 158.402 128.526 159.505 126.526 160.516C123.457 162.067 121.142 164.866 120.551 168.254L117.944 183.217C117.109 188.005 112.952 191.5 108.092 191.5H81.5538C76.6292 191.5 72.4376 187.915 71.6746 183.05L69.3736 168.38C68.8313 164.922 66.4955 162.049 63.3746 160.466C61.3606 159.444 59.4028 158.328 57.5068 157.123C54.6248 155.291 51.0647 154.731 47.8673 155.929L33.1308 161.452C28.4667 163.201 23.2272 161.25 20.8421 156.877L8.00609 133.344C5.68755 129.094 6.74734 123.793 10.5219 120.76L21.3017 112.1C24.0759 109.871 25.401 106.338 25.1612 102.788C25.0543 101.206 25 99.6092 25 98C25 96.813 25.0295 95.6328 25.0879 94.4603C25.2578 91.0489 23.9856 87.6754 21.363 85.4872L10.4129 76.3507C6.69998 73.2528 5.7357 67.9419 8.12259 63.7364L20.8253 41.3554C23.2353 37.1093 28.3591 35.2242 32.9463 36.896L45.7589 41.5654C49.0531 42.766 52.7052 42.1077 55.6016 40.1319C58.0979 38.429 60.7102 36.8835 63.424 35.5095ZM128 98C128 116.225 113.225 131 95 131C76.7746 131 62 116.225 62 98C62 79.7746 76.7746 65 95 65C113.225 65 128 79.7746 128 98Z"/>
                    </svg>
                </div>
            </div>

            <div class="wrapper2">
                <div class="container1">
                    <div class="taskOTW">
                        <div class="sectionHeader">
                            <span><h3>Task On The Way</h3></span>
                            <span >
                                <svg class="sectionToggleArrow" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 14L11.5455 3L2 14"/>
                                </svg>
                            </span>
                        </div>
                        <div class="sectionContent-TOTW" id="sectionContent-TOTW"></div>
                    </div>

                    <div class="taskHTY">
                        <div class="sectionHeader">
                            <span><h3>Task Haven't Touch Yet</h3></span>
                            <span >
                                <svg class="sectionToggleArrow" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 14L11.5455 3L2 14"/>
                                </svg>
                            </span>
                        </div>
                        <div class="sectionContent-THTY" id="sectionContent-THTY"></div>
                    </div>

                    <div class="inbox">
                        <div class="sectionHeader">
                            <span><h3>Inbox</h3></span>
                            <span >
                                <svg class="sectionToggleArrow" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 14L11.5455 3L2 14"/>
                                </svg>
                            </span>
                        </div>
                        <div class="sectionContent-IBX" id="sectionContent-IBX"></div>
                    </div>
                </div>
                <div class="container2">
                    <ul>
                        <li onclick="updateFullName()"><h3>Update Full Name</h3></li>
                        <li onclick="updateEmail()"><h3>Update Email Address</h3></li>
                        <li onclick="updateSecurityQuestion()"><h3>Update Security Question</h3></li>
                        <li onclick="updatePassword()"><h3>Update Password</h3></li>
                        <li onclick="logoutUser()"><h3>Log Out</h3></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <dialog class="updateFullName" id="updateFullName">
        <div class="form">
            <div class="title">
                <h3>Let us know how to call you.</h3>
                <div class="closeBtn" id="closeBtn"> &times; </div>
            </div>

            <div class="name">
                <div class="input-box">
                    <input type="text" id="first-name" name="first-name" placeholder= "First Name" required>
                </div>

                <div class="input-box">
                    <input type="text" id="last-name" name="last-name" placeholder= "Last Name" required>
                </div>
            </div>
            <label for="" class="errorMessage">*Error Message*</label>
            <button type="submit" class="saveButton">Confirm</button>
        </div>
    </dialog>

    <dialog class="updateEmail" id="updateEmail">
        <div class="form">
            <div class="title">
                <h3>Update your email.</h3>
                <div class="closeBtn"> &times; </div>
            </div>

            <div class="input-box">
                <input type="email" id="email" name="email" placeholder= "Email Address. e.g. abc@email.com" required>
            </div>
            <label for="" class="errorMessage">*Error Message*</label>
            <button type="submit" class="saveButton">Confirm</button>
        </div>
    </dialog>

    <dialog class="updatePassword" id="updatePassword">
        <div class="form">
            <div class="title">
                <h3>Set a new password.</h3>
                <div class="closeBtn"> &times; </div>
            </div>

            <div class="input-box">
                <input type="password" id="oldPassword" name="oldPassword" placeholder= "Old Password" required>
                <img src="./images/password_inactive.svg" class="eyeicon">
            </div>

            <div class="input-box">
                <input type="password" id="newPassword" name="newPassword" placeholder= "New Password" required>
                <img src="./images/password_inactive.svg" class="eyeicon">
            </div>
            
            <div class="input-box">
                <input type="password" id="confirmNewPassword" name="confirmNewPassword" placeholder= "Confirm New Password" required>
                <img src="./images/password_inactive.svg" class="eyeicon">
            </div>
            <label for="" class="errorMessage">*Error Message*</label>
            <button type="submit" class="saveButton">Confirm</button>
        </div>
    </dialog>
    
    <dialog class="updateSecurityQuestion" id="updateSecurityQuestion">
        <div class="form">
            <div class="title">
                <h3>Choose your security question.</h3>
                <div class="closeBtn"> &times; </div>
            </div>

            <select name="securityQuestion" id="securityQuestion">
                <option value="default" selected>Select a security question</option>
                <option value="pet">What is your first pet's name?</option>
                <option value="school">What is name of your primary school?</option>
                <option value="food">What is your favorite food?</option>
                <option value="color">What is your favorite color?</option>
            </select>
            
            <div class="input-box">
                <input type="text" id="securityAnswer" name="securityAsnwer" placeholder= "Enter your new answer" required>
            </div>
            <label for="" class="errorMessage">*Error Message*</label>
            <button type="submit" class="saveButton">Confirm</button>
        </div>
    </dialog>

    <dialog class="confirmationDialog">
        <div class="dialogHeader">
            <h3>Do you confirm to delete?</h3>
            <div class="closeBtn"> &times; </div>
        </div>
        <div class="buttonWrapper">
            <button class="cancel">Cancel</button>
            <button class="confirm">Confirm</button>
        </div>
    </dialog>

    <script>
        const project = <?php echo json_encode([
            'ProjectID' => $projectID,
            'ProjectName' => $projectName,
            'Description' => $projectDesc,
            'StartDate' => $projectStart,
            'EndDate' => $projectEnd,
            'InviteCode' => $decryptedCode
        ]); ?>;

        const currentUserID = <?php echo json_encode($userID); ?>;

        console.log(<?php echo json_encode
            ([
            'ProjectID' => $projectID,
            'ProjectName' => $projectName,
            'Description' => $projectDesc,
            'StartDate' => $projectStart,
            'EndDate' => $projectEnd,
            'InviteCode' => $decryptedCode
            ]);
        ?>)
    </script>
    <script src="3-nav_profile_setting.js"></script>
    <script src="5-leftNav.js"></script>
    <script src="6-projectMember.js"></script>
</body>
</html>
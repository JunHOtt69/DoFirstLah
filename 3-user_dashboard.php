<?php
require 'config.php';
session_start();

if (!isset($_SESSION['userID']) && isset($_COOKIE['rememberMe'])) {
    include 'config.php';
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
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="3-default_settings.css">
    <link rel="stylesheet" href="3-nav_profile_setting.css">
    <link rel="stylesheet" href="3-user_dashboard.css">
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
    
    <div class="selectMonth">
        <div class="selectMonthHeader">
            <button id="prevBtn" onclick="prevYear()">
                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24">
                    <path  d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>
            <div class="year" id="year"></div>
            <button id="nextBtn" onclick="nextYear()">
                <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24">
                    <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
        <div class="months">
            <button class="monthEl">Jan</button>
            <button class="monthEl">Feb</button>
            <button class="monthEl">Mar</button>
            <button class="monthEl">Apr</button>
            <button class="monthEl">May</button>
            <button class="monthEl">Jun</button>
            <button class="monthEl">Jul</button>
            <button class="monthEl">Aug</button>
            <button class="monthEl">Sep</button>
            <button class="monthEl">Oct</button>
            <button class="monthEl">Nov</button>
            <button class="monthEl">Dec</button>
        </div>
    </div>

    <div class="navMenuProfile" id="navMenuProfile">
        <div>
            <div class="navbarShape"></div>
            <div class="contentHolder">
                <section class="content" id="content">
                    <div class="mySchedule panel">
                        <div class="panelHeader">
                            <div class="panelTitle">
                                <h3>My Schedule</h3>
                            </div>
                            <div class="calenderButtonWrapper">
                                <button class="scrollTodayButton" onclick="viewTodayEvent()">
                                    Today
                                </button>
                                <button  class="addOnIcon" onclick="triggerEventDetail()">
                                    <svg viewBox="0 0 153 165" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M76.5 7V158M7 80.4595H146"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="calender">
                            <div class="monthTime">
                                <div class="month">
                                    <button class="prevMonth" onclick="viewPrevMonth()">
                                        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24">
                                            <path  d="M15.75 19.5 8.25 12l7.5-7.5" />
                                        </svg>
                                    </button>
                                    <h5>August 2025</h5>
                                    <button class="nextMonth" onclick="viewNextMonth()">
                                        <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24">
                                            <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                </div>
                                <div class="timeWrapper">
                                    <div class="time"><h5>12 a.m.</h5></div>
                                    <div class="time"><h5>01 a.m.</h5></div>
                                    <div class="time"><h5>02 a.m.</h5></div>
                                    <div class="time"><h5>03 a.m.</h5></div>
                                    <div class="time"><h5>04 a.m.</h5></div>
                                    <div class="time"><h5>05 a.m.</h5></div>
                                    <div class="time"><h5>06 a.m.</h5></div>
                                    <div class="time"><h5>07 a.m.</h5></div>
                                    <div class="time"><h5>08 a.m.</h5></div>
                                    <div class="time"><h5>09 a.m.</h5></div>
                                    <div class="time"><h5>10 a.m.</h5></div>
                                    <div class="time"><h5>11 a.m.</h5></div>
                                    <div class="time"><h5>12 a.m.</h5></div>
                                    <div class="time"><h5>01 p.m.</h5></div>
                                    <div class="time"><h5>02 p.m.</h5></div>
                                    <div class="time"><h5>03 p.m.</h5></div>
                                    <div class="time"><h5>04 p.m.</h5></div>
                                    <div class="time"><h5>05 p.m.</h5></div>
                                    <div class="time"><h5>06 p.m.</h5></div>
                                    <div class="time"><h5>07 p.m.</h5></div>
                                    <div class="time"><h5>08 p.m.</h5></div>
                                    <div class="time"><h5>09 p.m.</h5></div>
                                    <div class="time"><h5>10 p.m.</h5></div>
                                    <div class="time"><h5>11 p.m.</h5></div>
                                    <div class="time"><h5>12 a.m.</h5></div>
                                    <div class="startTime">10 p.m.</div>
                                    <div class="endTime">11 p.m.</div>
                                </div>
                            </div>
                            <div class="divisionLine"></div>
                            <div class="calenderDays">
                            </div>

                            <div class="guideLines">
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                                <div class="guideLine"></div>
                            </div>
                        </div>
                        <div class="resizer"></div>
                    </div>
                    <div class="rightPanel">
                        <div class="reminders panel">
                            <div class="panelHeader">
                                <div class="panelTitle">
                                    <h3>Reminders</h3>
                                </div>
                                <button  class="addOnIcon" onclick="triggerReminderDetail()">
                                    <svg viewBox="0 0 153 165" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M76.5 7V158M7 80.4595H146"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="panelContent"></div>
                        </div>
                        <div class="todayEvent panel">
                            <div class="panelHeader">
                                <div class="panelTitle">
                                    <h3>Today's Event</h3>
                                </div>
                                <button class="addOnIcon" onclick="triggerEventDetail()">
                                    <svg viewBox="0 0 153 165" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M76.5 7V158M7 80.4595H146"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="panelContent"></div>
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

    <dialog class="eventDetail">
        <div class="dialogHeader">
            <div class="eventDetailTitle">
                <input type="text" placeholder="Event Title" maxlength="50">
                <label for="" class="remainingCount">50</label>
            </div>
            <div class="buttonWrapper">
                <button class="deleteEventBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>
                <div class="closeBtn"> &times; </div>
            </div>
        </div>
        <div class="eventDetailDesc">
            <span class="placeHolder">Type some skibidi...</span>
            <div class="editor" id="editor" contenteditable="true" placeholder="Type some skibidi..."><p><br></p></div>
        </div>
        <div class="datePickerWrapper">
            <div class="startPickerWrapper">
                <div class="pickerHeader">Event Date</div>
                <div class="timePicker">
                    <div class="picker" id="date">
                        <div class="option active">01</div>
                        <div class="option">02</div>
                        <div class="option">03</div>
                        <div class="option">04</div>
                        <div class="option">05</div>
                        <div class="option">06</div>
                        <div class="option">07</div>
                        <div class="option">08</div>
                        <div class="option">09</div>
                        <div class="option">10</div>
                        <div class="option">11</div>
                        <div class="option">12</div>
                        <div class="option">13</div>
                        <div class="option">14</div>
                        <div class="option">15</div>
                        <div class="option">16</div>
                        <div class="option">17</div>
                        <div class="option">18</div>
                        <div class="option">19</div>
                        <div class="option">20</div>
                        <div class="option">21</div>
                        <div class="option">22</div>
                        <div class="option">23</div>
                        <div class="option">24</div>
                        <div class="option">25</div>
                        <div class="option">26</div>
                        <div class="option">27</div>
                        <div class="option">28</div>
                        <div class="option">29</div>
                        <div class="option">30</div>
                        <div class="option">31</div>
                    </div>
                    <label>/</label>
                    <div class="picker" id="month">
                        <div class="option active">Jan</div>
                        <div class="option">Feb</div>
                        <div class="option">Mar</div>
                        <div class="option">Apr</div>
                        <div class="option">May</div>
                        <div class="option">Jun</div>
                        <div class="option">Jul</div>
                        <div class="option">Aug</div>
                        <div class="option">Sep</div>
                        <div class="option">Oct</div>
                        <div class="option">Nov</div>
                        <div class="option">Dec</div>
                    </div>
                    <label>/</label>
                    <div class="picker" id="year"></div>
                </div>
            </div>
        </div>
        <div class="selectTime">
            <div class="startPickerWrapper">
                <div class="pickerHeader">Start Time</div>
                <div class="timePicker">
                    <div class="picker" id="hours">
                        <div class="option active">01</div>
                        <div class="option">02</div>
                        <div class="option">03</div>
                        <div class="option">04</div>
                        <div class="option">05</div>
                        <div class="option">06</div>
                        <div class="option">07</div>
                        <div class="option">08</div>
                        <div class="option">09</div>
                        <div class="option">10</div>
                        <div class="option">11</div>
                        <div class="option">12</div>
                    </div>
                    <label>:</label>
                    <div class="picker" id="minutes">
                        <div class="option active">00</div>
                        <div class="option">15</div>
                        <div class="option">30</div>
                        <div class="option">45</div>
                    </div>
                    <label>:</label>
                    <div class="picker" id="ampm">
                        <div class="option active">a.m.</div>
                        <div class="option">p.m.</div>
                    </div>
                </div>
            </div>

            <div class="endPickerWrapper">
                <div class="pickerHeader">End Time</div>
                <div class="timePicker">
                    <div class="picker" id="hours">
                        <div class="option active">01</div>
                        <div class="option">02</div>
                        <div class="option">03</div>
                        <div class="option">04</div>
                        <div class="option">05</div>
                        <div class="option">06</div>
                        <div class="option">07</div>
                        <div class="option">08</div>
                        <div class="option">09</div>
                        <div class="option">10</div>
                        <div class="option">11</div>
                        <div class="option">12</div>
                    </div>
                    <label>:</label>
                    <div class="picker" id="minutes">
                        <div class="option active">00</div>
                        <div class="option">15</div>
                        <div class="option">30</div>
                        <div class="option">45</div>
                    </div>
                    <label>:</label>
                    <div class="picker" id="ampm">
                        <div class="option active">a.m.</div>
                        <div class="option">p.m.</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="selectStyle">
            Style:
            <div class="style1">Personal</div>
            <div class="style2">Family</div>
            <div class="style3">Work</div>
        </div>
        <label for="" class="errorMessage">*Error Message*</label>
        <div class="ccWrapper">
            <button class="cancelEvent">Cancel</button>
            <button class="confirmEvent">Confirm</button>
        </div>
    </dialog>

    <dialog class="reminderDetail">
        <div class="dialogHeader">
            <div class="reminderDetailTitle">
                <input type="text" placeholder="Reminder Title" maxlength="50">
                <label for="" class="remainingCount">50</label>
            </div>
            <div class="buttonWrapper">
                <button class="deleteEventBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>
                <div class="closeBtn"> &times; </div>
            </div>
        </div>
        <div class="reminderDetailDesc">
            <span class="placeHolder">Type some skibidi...</span>
            <div class="editor" id="editor" contenteditable="true" placeholder="Type some skibidi..."><p><br></p></div>
        </div>
        <div class="datePickerWrapper">
            <div class="startPickerWrapper">
                <div class="pickerHeader">Reminder Date</div>
                <div class="timePicker">
                    <div class="picker" id="date">
                        <div class="option active">01</div>
                        <div class="option">02</div>
                        <div class="option">03</div>
                        <div class="option">04</div>
                        <div class="option">05</div>
                        <div class="option">06</div>
                        <div class="option">07</div>
                        <div class="option">08</div>
                        <div class="option">09</div>
                        <div class="option">10</div>
                        <div class="option">11</div>
                        <div class="option">12</div>
                        <div class="option">13</div>
                        <div class="option">14</div>
                        <div class="option">15</div>
                        <div class="option">16</div>
                        <div class="option">17</div>
                        <div class="option">18</div>
                        <div class="option">19</div>
                        <div class="option">20</div>
                        <div class="option">21</div>
                        <div class="option">22</div>
                        <div class="option">23</div>
                        <div class="option">24</div>
                        <div class="option">25</div>
                        <div class="option">26</div>
                        <div class="option">27</div>
                        <div class="option">28</div>
                        <div class="option">29</div>
                        <div class="option">30</div>
                        <div class="option">31</div>
                    </div>
                    <label>/</label>
                    <div class="picker" id="month">
                        <div class="option active">Jan</div>
                        <div class="option">Feb</div>
                        <div class="option">Mar</div>
                        <div class="option">Apr</div>
                        <div class="option">May</div>
                        <div class="option">Jun</div>
                        <div class="option">Jul</div>
                        <div class="option">Aug</div>
                        <div class="option">Sep</div>
                        <div class="option">Oct</div>
                        <div class="option">Now</div>
                        <div class="option">Dec</div>
                    </div>
                    <label>/</label>
                    <div class="picker" id="year"></div>
                </div>
            </div>
        </div>
        <div class="selectTime">
            <div class="pickerWrapper">
                <div class="pickerHeader">Start Time</div>
                <div class="timePicker">
                    <div class="picker" id="hours">
                        <div class="option active">01</div>
                        <div class="option">02</div>
                        <div class="option">03</div>
                        <div class="option">04</div>
                        <div class="option">05</div>
                        <div class="option">06</div>
                        <div class="option">07</div>
                        <div class="option">08</div>
                        <div class="option">09</div>
                        <div class="option">10</div>
                        <div class="option">11</div>
                        <div class="option">12</div>
                    </div>
                    <label>:</label>
                    <div class="picker" id="minutes">
                        <div class="option active">00</div>
                        <div class="option">15</div>
                        <div class="option">30</div>
                        <div class="option">45</div>
                    </div>
                    <label>:</label>
                    <div class="picker" id="ampm">
                        <div class="option active">a.m.</div>
                        <div class="option">p.m.</div>
                    </div>
                </div>
            </div>
        </div>
        <label for="" class="errorMessage">*Error Message*</label>
        <div class="ccWrapper">
            <button class="cancelEvent">Cancel</button>
            <button class="confirmEvent">Confirm</button>
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
        const currentUserID = <?php echo json_encode($userID); ?>;
    </script>
    <script src="3-nav_profile_setting.js"></script>
    <script src="3-user_dashboard.js"></script>
</body>
</html>
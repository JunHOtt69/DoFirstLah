<?php
include 'config.php';

$email = $_POST['email'];
$password = $_POST['password'];
$rememberMe = isset($_POST['rememberMe']);

$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    header("Location: 2-log_in.php?error=email");
    exit();
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user['Password'])) {
    header("Location: 2-log_in.php?error=password");
    exit();
}

session_start();
$_SESSION['userID'] = $user['UserID'];

if ($rememberMe) {
    $token = bin2hex(random_bytes(32));
    $expiry = date('Y-m-d H:i:s', strtotime('+30 days'));

    $stmt = $conn->prepare("REPLACE INTO rememberme (UserID, Token, Expiry) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $user['UserID'], $token, $expiry);
    $stmt->execute();

    setcookie('rememberMe', $token, [
        'expires' => strtotime($expiry),
        'path' => '/',
        'secure' => true, 
        'httponly' => true, 
        'samesite' => 'Strict'
    ]);
}

header("Location: 3-user_dashboard.php");
exit();
?>

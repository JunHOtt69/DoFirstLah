<?php
require 'config.php';
session_start();

$step = $_POST['step'] ?? '';

header('Content-Type: application/json');

if ($step == '1') {
    $email = trim($_POST['email']);
    $stmt = $conn->prepare("SELECT * FROM users WHERE Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Email not found."]);
    } else {
        $_SESSION['reset_email'] = $email;
        echo json_encode(["success" => true]);
    }
}
elseif ($step == '2') {
    $email = $_SESSION['reset_email'] ?? '';
    $question = $_POST['securityQuestion'] ?? '';
    $answer = trim($_POST['securityAnswer']) ?? '';

    $stmt = $conn->prepare("SELECT SecurityQuestion, SecurityAnswer FROM users WHERE Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    error_log("DB Question: " . $user['SecurityQuestion'] . " | Input: " . $question);
    error_log("User input answer: " . $answer);
    error_log("DB hashed answer: " . $user['SecurityAnswer']);

    if (!$user || $user['SecurityQuestion'] !== $question || password_verify($answer, $user['SecurityAnswer'])) {
        echo json_encode(["success" => false, "message" => "Invalid security question or answer. Please try again."]);
    } else {
        echo json_encode(["success" => true]);
    }
}
elseif ($step == '3') {
    $email = $_SESSION['reset_email'] ?? '';
    $password = $_POST['password'] ?? '';
    $confirm = $_POST['confirm_password'] ?? '';

    if ($password !== $confirm) {
        echo json_encode(["success" => false, "message" => "New password and confirm password not matched."]);
        exit;
    }

    $hashed = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE users SET Password = ? WHERE Email = ?");
    $stmt->bind_param("ss", $hashed, $email);
    $stmt->execute();

    unset($_SESSION['reset_email']);
    echo json_encode(["success" => true]);
}
?>

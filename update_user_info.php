<?php
require 'config.php';
session_start();

if (!isset($_SESSION['userID'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Not logged in"]);
    exit;
}

$userID = $_SESSION['userID'];

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['type'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
    exit;
}

$type = $data['type'];
$response = ["status" => "error", "message" => "Unknown error"];

switch ($type) {
    case 'fullname':
        $fullName = trim($data['fullName'] ?? '');
        if ($fullName !== '') {
            $stmt = $conn->prepare("UPDATE users SET FullName = ? WHERE UserID = ?");
            $stmt->bind_param("ss", $fullName, $userID);
            if ($stmt->execute()) {
                $response = ["status" => "success", "message" => "Full name updated"];
            }
            $stmt->close();
        } else {
            $response = ["status" => "error", "message" => "Empty full name"];
        }
        break;

    case 'email':
        $email = trim($data['email'] ?? '');
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $stmt = $conn->prepare("UPDATE users SET Email = ? WHERE UserID = ?");
            $stmt->bind_param("ss", $email, $userID);
            if ($stmt->execute()) {
                $response = ["status" => "success", "message" => "Email updated"];
            }
            $stmt->close();
        } else {
            $response = ["status" => "error", "message" => "Invalid email"];
        }
        break;

    case 'password':
        $old = $data['oldPassword'] ?? '';
        $new = $data['newPassword'] ?? '';

        $stmt = $conn->prepare("SELECT Password FROM users WHERE UserID = ?");
        $stmt->bind_param("s", $userID);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();

        if ($result && password_verify($old, $result['Password'])) {
            $newHash = password_hash($new, PASSWORD_DEFAULT);
            $update = $conn->prepare("UPDATE users SET Password = ? WHERE UserID = ?");
            $update->bind_param("ss", $newHash, $userID);
            if ($update->execute()) {
                $response = ["status" => "success", "message" => "Password updated"];
            }
            $update->close();
        } else {
            $response = ["status" => "error", "message" => "Old password incorrect"];
        }
        $stmt->close();
        break;

    case 'security':
        $question = trim($data['question'] ?? '');
        $answer = trim($data['answer'] ?? '');
        if ($question !== '' && $answer !== '') {
            $hashed_answer = password_hash($answer, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("UPDATE users SET SecurityQuestion = ?, SecurityAnswer = ? WHERE UserID = ?");
            $stmt->bind_param("sss", $question, $hashed_answer, $userID);
            if ($stmt->execute()) {
                $response = ["status" => "success", "message" => "Security Q&A updated"];
            }
            $stmt->close();
        } else {
            $response = ["status" => "error", "message" => "Incomplete data"];
        }
        break;
}

header('Content-Type: application/json');
echo json_encode($response);

<?php
header('Content-Type: application/json');
include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
$reminderID = $data['ReminderID'] ?? '';

if (!$reminderID) {
    echo json_encode(['status' => 'error', 'message' => 'Missing ReminderID']);
    exit;
}

$stmt = $conn->prepare("DELETE FROM userreminders WHERE ReminderID = ?");
$stmt->bind_param("s", $reminderID);

if ($stmt->execute()) {
    echo json_encode(['status' => 'ok']);
} else {
    echo json_encode(['status' => 'error', 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>

<?php
header('Content-Type: application/json');
include 'config.php'; // contains your $conn

$data = json_decode(file_get_contents("php://input"), true);
$eventID = $data['EventID'] ?? '';

if (!$eventID) {
    echo json_encode(['status' => 'error', 'message' => 'Missing EventID']);
    exit;
}

$stmt = $conn->prepare("DELETE FROM userevents WHERE EventID = ?");
$stmt->bind_param("s", $eventID);

if ($stmt->execute()) {
    echo json_encode(['status' => 'ok']);
} else {
    echo json_encode(['status' => 'error', 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>

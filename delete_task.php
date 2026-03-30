<?php
header('Content-Type: application/json');
include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
$taskID = $data['TaskID'] ?? '';

if (!$taskID) {
    echo json_encode(['status' => 'error', 'message' => 'Missing TaskID']);
    exit;
}

$stmt = $conn->prepare("UPDATE tasks SET Status = 'CANCELLED' WHERE TaskID = ?");
$stmt->bind_param("s", $taskID);

if ($stmt->execute()) {
    echo json_encode(['status' => 'ok']);
} else {
    echo json_encode(['status' => 'error', 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>

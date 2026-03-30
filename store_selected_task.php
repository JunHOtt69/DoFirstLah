<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['userID'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$taskID = $data['TaskID'] ?? '';

if (!$taskID) {
    echo json_encode(['status' => 'error', 'message' => 'Missing TaskID']);
    exit;
}

$_SESSION['selectedTask'] = $taskID;

echo json_encode(['status' => 'ok']);
?>


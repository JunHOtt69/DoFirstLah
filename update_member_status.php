<?php
session_start();
require 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['userID'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$targetUserID = $input['userID'] ?? null;
$newStatus = $input['status'] ?? null;
$projectID = $input['projectID'] ?? null;

if (!$targetUserID || !$newStatus || !$projectID) {
    echo json_encode(['status' => 'error', 'message' => 'Missing userID, status, or projectID']);
    exit;
}

$newRole = ($newStatus === 'Rejected') ? null : 'Team Member';

$stmt = $conn->prepare("
    UPDATE projectmembers 
    SET Status = ?, Role = ?
    WHERE ProjectID = ? AND UserID = ?
");
$stmt->bind_param("ssss", $newStatus, $newRole, $projectID, $targetUserID);

if ($stmt->execute()) {
    echo json_encode(['status' => 'ok', 'message' => 'Member status and role updated']);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to update member',
        'error' => $conn->error
    ]);
}

$stmt->close();
$conn->close();
?>



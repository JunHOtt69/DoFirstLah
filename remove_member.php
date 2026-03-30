<?php
session_start();
require 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['userID'])) {
    echo json_encode(['status'=>'error','message'=>'Not logged in']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$projectID = $input['ProjectID'] ?? '';
$userID = $input['UserID'] ?? '';

if (!$projectID || !$userID) {
    echo json_encode(['status'=>'error','message'=>'Missing parameters']);
    exit;
}

$stmt = $conn->prepare("UPDATE projectmembers SET Status='Removed' WHERE ProjectID=? AND UserID=?");
$stmt->bind_param("ss", $projectID, $userID);
if ($stmt->execute()) {
    echo json_encode(['status'=>'ok']);
} else {
    echo json_encode(['status'=>'error','message'=>$conn->error]);
}
$conn->close();
?>

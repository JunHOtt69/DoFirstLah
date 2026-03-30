<?php
session_start();
require 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['userID'])) {
    echo json_encode(['status'=>'error','message'=>'Not logged in']);
    exit;
}

$project = $_SESSION['currentProject'] ?? null;
if (!$project) {
    echo json_encode(['status'=>'error','message'=>'Project not found']);
    exit;
}

$projectID = $project['ProjectID'];

$input = json_decode(file_get_contents('php://input'), true);
$targetUserID = $input['userID'] ?? null;
$newRole = $input['role'] ?? null;

if (!$targetUserID || !$newRole) {
    echo json_encode(['status'=>'error','message'=>'Missing userID or role']);
    exit;
}

$stmt = $conn->prepare("UPDATE projectmembers SET Role = ? WHERE ProjectID = ? AND UserID = ?");
$stmt->bind_param("sss", $newRole, $projectID, $targetUserID);

if ($stmt->execute()) {
    echo json_encode(['status'=>'ok','message'=>'Role updated']);
} else {
    echo json_encode(['status'=>'error','message'=>'Failed to update role','error'=>$conn->error]);
}

$conn->close();
?>

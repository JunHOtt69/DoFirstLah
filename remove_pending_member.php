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
$removeUserID = $input['userID'] ?? null;

if (!$removeUserID) {
    echo json_encode(['status'=>'error','message'=>'UserID missing']);
    exit;
}

$stmt = $conn->prepare("DELETE FROM projectmembers WHERE ProjectID = ? AND UserID = ? AND Status = 'pending'");
$stmt->bind_param("ss", $projectID, $removeUserID);

if($stmt->execute()){
    echo json_encode(['status'=>'ok','message'=>'Pending member removed']);
} else {
    echo json_encode(['status'=>'error','message'=>'Failed to remove pending member','error'=>$conn->error]);
}

$conn->close();
?>

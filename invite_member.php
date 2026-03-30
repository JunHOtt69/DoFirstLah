<?php
session_start();
require 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['userID'])) {
    echo json_encode(['status'=>'error','message'=>'Not logged in']);
    exit;
}

$userID = $_SESSION['userID'];
$project = $_SESSION['currentProject'] ?? null;

if (!$project) {
    echo json_encode(['status'=>'error','message'=>'Project not found in session']);
    exit;
}

$projectID = $project['ProjectID'];

$input = json_decode(file_get_contents('php://input'), true);
$inviteUserID = $input['userID'] ?? null;

if (!$inviteUserID) {
    echo json_encode(['status'=>'error','message'=>'UserID missing']);
    exit;
}

$stmtCheck = $conn->prepare("SELECT Status FROM projectmembers WHERE ProjectID = ? AND UserID = ?");
$stmtCheck->bind_param("ss", $projectID, $inviteUserID);
$stmtCheck->execute();
$resCheck = $stmtCheck->get_result();

if ($row = $resCheck->fetch_assoc()) {
    $currentStatus = strtolower($row['Status']);

    if ($currentStatus === 'active') {
        echo json_encode(['status' => 'error', 'message' => 'User is already an active member']);
        exit;
    }

    $updateStmt = $conn->prepare("
        UPDATE projectmembers 
        SET Status = 'Pending', Role = NULL
        WHERE ProjectID = ? AND UserID = ?
    ");
    $updateStmt->bind_param("ss", $projectID, $inviteUserID);

    if ($updateStmt->execute()) {
        echo json_encode(['status' => 'ok', 'message' => 'User re-invited (status updated to Pending)']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update existing member status', 'error' => $conn->error]);
    }

    $updateStmt->close();
    $conn->close();
    exit;
}

$role = '';
$status = 'Pending';

$stmt = $conn->prepare("INSERT INTO projectmembers (ProjectID, UserID, Role, Status) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $projectID, $inviteUserID, $role, $status);

if ($stmt->execute()) {
    echo json_encode(['status' => 'ok', 'message' => 'Invitation sent']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to send invitation', 'error' => $conn->error]);
}

$stmt->close();
$conn->close();
?>

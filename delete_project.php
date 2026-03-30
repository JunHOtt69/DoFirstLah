<?php
header('Content-Type: application/json');
include 'config.php';
session_start();

$data = json_decode(file_get_contents("php://input"), true);
$projectID = $data['ProjectID'] ?? '';

if (!$projectID) {
    echo json_encode(['status' => 'error', 'message' => 'Missing ProjectID']);
    exit;
}

$userID = $_SESSION['userID'] ?? '';
if (!$userID) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

$stmt = $conn->prepare("SELECT ProjectName FROM projects WHERE ProjectID = ?");
$stmt->bind_param("s", $projectID);
$stmt->execute();
$result = $stmt->get_result();
$project = $result->fetch_assoc();

if (!$project) {
    echo json_encode(['status' => 'error', 'message' => 'Project not found']);
    exit;
}

$projectName = $project['ProjectName'];

$stmt = $conn->prepare("DELETE FROM projects WHERE ProjectID = ?");
$stmt->bind_param("s", $projectID);

if ($stmt->execute()) {
    echo json_encode(['status' => 'ok', 'projectName' => $projectName]);
} else {
    echo json_encode(['status' => 'error', 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>

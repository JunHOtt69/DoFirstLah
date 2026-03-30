<?php
require 'config.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['userID'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

$userID = $_SESSION['userID'];

$data = json_decode(file_get_contents('php://input'), true);

$parentTaskID   = $data['ParentTaskID'] ?? null;
$projectID      = $data['ProjectID'] ?? null;
$assignedUserID = $data['AssignedUserID'] ?? null;
$taskTitle      = $data['TaskTitle'] ?? null;
$description    = $data['Description'] ?? '';
$priority       = $data['Priority'] ?? 0;
$status         = $data['Status'] ?? 'HTY';
$startDate      = $data['StartDate'] ?? null;
$dueDate        = $data['DueDate'] ?? null;

if (!$projectID || !$taskTitle || !$dueDate) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

$startDate = date('Y-m-d H:i:s', strtotime($startDate));
$dueDate   = date('Y-m-d H:i:s', strtotime($dueDate));


$result = $conn->query("SELECT TaskID FROM tasks ORDER BY CAST(SUBSTRING(TaskID, 2) AS UNSIGNED) DESC LIMIT 1");

if ($result && $row = $result->fetch_assoc()) {
    $lastTaskID = $row['TaskID'];
    $lastNum = intval(substr($lastTaskID, 1));
    $nextNum = $lastNum + 1;
    $taskID = 'T' . str_pad($nextNum, 3, '0', STR_PAD_LEFT);
} else {
    $taskID = 'T001'; 
}

$stmt = $conn->prepare("
    INSERT INTO tasks (
        TaskID, ParentTaskID, ProjectID, AssignedUserID, TaskTitle,
        Description, Priority, Status, StartDate, DueDate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "ssssssisss",
    $taskID,
    $parentTaskID,
    $projectID,
    $assignedUserID,
    $taskTitle,
    $description,
    $priority,
    $status,
    $startDate,
    $dueDate
);

if ($stmt->execute()) {
    echo json_encode(['status' => 'ok', 'message' => 'Task added successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>

<?php
session_start();
include 'config.php';

// ensure user is logged in
if (!isset($_SESSION['userID'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthenticated']);
    exit;
}

$userID = $_SESSION['userID'];

$sql = "
    SELECT 
        t.TaskID,
        t.ParentTaskID,
        t.ProjectID,
        t.AssignedUserID,
        t.TaskTitle,
        t.Description,
        t.Priority,
        t.Status,
        t.StartDate,
        t.DueDate,
        p.ProjectName
    FROM tasks t
    LEFT JOIN projects p ON t.ProjectID = p.ProjectID
    WHERE t.AssignedUserID = ?
    ORDER BY t.DueDate ASC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $userID);
$stmt->execute();
$result = $stmt->get_result();

$tasks = [];
while ($row = $result->fetch_assoc()) {
    $row['StartDate'] = $row['StartDate'] ? date('c', strtotime($row['StartDate'])) : null;
    $row['DueDate']   = $row['DueDate']   ? date('c', strtotime($row['DueDate'])) : null;
    $tasks[] = $row;
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode(['status' => 'ok', 'tasks' => $tasks]);
exit;
?>
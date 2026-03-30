<?php
require 'config.php';
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

if (empty($_POST['CommentID']) || empty($_POST['TaskID']) || empty($_POST['UserID'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

if (!isset($_POST['Description'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing description field']);
    exit;
}

$commentID = $_POST['CommentID'];
$taskID = $_POST['TaskID'];
$userID = $_POST['UserID'];
$description = $_POST['Description'];
$createdAt = $_POST['CreatedAt'];

$stmt = $conn->prepare("
    INSERT INTO comments (CommentID, TaskID, UserID, Description, CreatedAt)
    VALUES (?, ?, ?, ?, ?)
");
$stmt->bind_param('sssss', $commentID, $taskID, $userID, $description, $createdAt);

if ($stmt->execute()) {
    echo json_encode([
        'status' => 'ok',
        'message' => 'Comment added successfully',
        'CommentID' => $commentID,
        'TaskID' => $taskID,
        'UserID' => $userID,
        'CreatedAt' => $createdAt
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to insert comment',
        'error' => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>

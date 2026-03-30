<?php
require 'config.php';
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

$commentID = $_POST['CommentID'] ?? '';
$description = $_POST['Description'] ?? '';

if (empty($commentID)) {
    echo json_encode(['status' => 'error', 'message' => 'Missing CommentID']);
    exit;
}

$stmt = $conn->prepare("UPDATE comments SET Description = ? WHERE CommentID = ?");
$stmt->bind_param('ss', $description, $commentID);

if ($stmt->execute()) {
    echo json_encode(['status' => 'ok', 'message' => 'Comment updated']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update comment', 'error' => $stmt->error]);
}
?>

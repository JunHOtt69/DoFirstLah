<?php
require 'config.php';
session_start();

$data = json_decode(file_get_contents('php://input'), true);
$removedFilesIDs = $data['removedFilesIDs'] ?? [];

if (empty($removedFilesIDs)) {
    echo json_encode(['status' => 'ok', 'message' => 'No files to delete']);
    exit;
}

foreach ($removedFilesIDs as $id) {
    $stmt = $conn->prepare("SELECT FilePath FROM attachment WHERE AttachmentID = ?");
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $filePath = __DIR__ . '/' . $row['FilePath'];
        if (file_exists($filePath)) unlink($filePath);
    }

    $deleteStmt = $conn->prepare("DELETE FROM attachment WHERE AttachmentID = ?");
    $deleteStmt->bind_param("s", $id);
    $deleteStmt->execute();
}

echo json_encode(['status' => 'ok', 'message' => 'Files deleted']);
?>

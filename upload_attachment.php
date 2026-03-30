<?php
require 'config.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['status' => 'error', 'message' => 'Invalid method']));
}

$uploadedBy = $_POST['UploadedBy'] ?? '';
$fileName = $_POST['FileName'] ?? '';
$fileType = $_POST['FileType'] ?? '';
$fileSize = $_POST['FileSize'] ?? 0;
$taskID = $_POST['TaskID'] ?? '';

if (empty($_FILES['file']['name'])) {
    exit(json_encode(['status' => 'error', 'message' => 'Missing file']));
}

$uploadDir = __DIR__ . '/Attachments/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$uniqueName = uniqid('ATT_') . '_' . basename($_FILES['file']['name']);
$targetPath = $uploadDir . $uniqueName;

if (move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
    $filePath = 'Attachments/' . $uniqueName;


    $result = $conn->query("SELECT AttachmentID FROM attachment ORDER BY AttachmentID DESC LIMIT 1");
    $row = $result->fetch_assoc();
    $newID = $row ? 'A' . str_pad((int)substr($row['AttachmentID'], 1) + 1, 3, '0', STR_PAD_LEFT) : 'A001';

    $stmt = $conn->prepare("INSERT INTO attachment
        (AttachmentID, UploadedBy, FileName, FileType, FileSize, FilePath, UploadTime)
        VALUES (?, ?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("ssssss", $newID, $uploadedBy, $fileName, $fileType, $fileSize, $filePath);
    $stmt->execute();

    if (!empty($taskID)) {
        $stmtLink = $conn->prepare("INSERT INTO finalworkattachment (TaskID, AttachmentID) VALUES (?, ?)");
        $stmtLink->bind_param("ss", $taskID, $newID);
        $stmtLink->execute();
        $stmtLink->close();
    }

    echo json_encode([
        'status' => 'ok',
        'message' => 'File uploaded and linked to task',
        'AttachmentID' => $newID
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to upload file']);
}
?>

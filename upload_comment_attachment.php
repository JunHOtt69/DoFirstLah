<?php
require 'config.php';
session_start();
header('Content-Type: application/json');


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

if (!isset($_FILES['file']) || !isset($_POST['CommentID']) || !isset($_POST['UploadedBy'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

$file = $_FILES['file'];
$commentID = $_POST['CommentID'];
$uploadedBy = $_POST['UploadedBy'];

$result = $conn->query("SELECT AttachmentID FROM attachment ORDER BY AttachmentID DESC LIMIT 1");
$newID = "A001";
if ($result && $result->num_rows > 0) {
    $last = $result->fetch_assoc()['AttachmentID'];
    $num = intval(substr($last, 1)) + 1;
    $newID = 'A' . str_pad($num, 3, '0', STR_PAD_LEFT);
}

$fileName = basename($file['name']);
$fileType = $file['type'];
$fileSize = $file['size'];
$uploadTime = $_POST['UploadTime'];

$uploadDir = __DIR__ . '/Attachments/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}


$uniqueName = $newID . '_' . preg_replace('/[^A-Za-z0-9_\.-]/', '_', $fileName);
$targetPath = $uploadDir . $uniqueName;
$filePathDB = 'Attachments/' . $uniqueName;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to move uploaded file']);
    exit;
}

$stmt = $conn->prepare("
    INSERT INTO attachment (AttachmentID, UploadedBy, FileName, FileType, FileSize, FilePath, UploadTime)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");
$stmt->bind_param('sssssss', $newID, $uploadedBy, $fileName, $fileType, $fileSize, $filePathDB, $uploadTime);

if (!$stmt->execute()) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to insert attachment', 'error' => $stmt->error]);
    exit;
}
$stmt->close();

$stmtLink = $conn->prepare("
    INSERT INTO commentattachments (CommentID, AttachmentID)
    VALUES (?, ?)
");
$stmtLink->bind_param('ss', $commentID, $newID);

if (!$stmtLink->execute()) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to link attachment to comment', 'error' => $stmtLink->error]);
    exit;
}
$stmtLink->close();

echo json_encode([
    'status' => 'ok',
    'message' => 'Comment attachment uploaded successfully',
    'AttachmentID' => $newID,
    'FileName' => $fileName,
    'FilePath' => $filePathDB,
    'FileType' => $fileType,
    'FileSize' => $fileSize,
    'CommentID' => $commentID
]);
?>

<?php
require 'config.php';
session_start();

if (!isset($_SESSION['userID'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['ProjectID'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing ProjectID or invalid request"]);
    exit();
}

$projectID = $input['ProjectID'];


$allowedFields = [
    'ProjectName',
    'Description',
    'EndDate'
];

$updates = [];
$params = [];
$types = '';

foreach ($allowedFields as $field) {
    if (isset($input[$field])) {
        $updates[] = "$field = ?";
        $params[] = trim($input[$field]);
        $types .= 's';
    }
}

if (empty($updates)) {
    echo json_encode(["message" => "No changes detected"]);
    exit();
}

$sql = "UPDATE projects SET " . implode(", ", $updates) . " WHERE ProjectID = ?";
$params[] = $projectID;
$types .= 's';

$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to prepare statement"]);
    exit();
}

$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Project updated successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update project"]);
}

$stmt->close();
$conn->close();
?>

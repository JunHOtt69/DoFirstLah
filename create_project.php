<?php
session_start();
include 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['userID'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

$userID = $_SESSION['userID'];

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['ProjectName'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    exit;
}

$projectName = trim($input['ProjectName']);
$description = isset($input['Description']) ? trim($input['Description']) : 'Description. Say Somethin';
$startDate = date('Y-m-d H:i:s');
$endDate = null;

$query = "SELECT ProjectID FROM projects ORDER BY ProjectID DESC LIMIT 1";
$result = $conn->query($query);
if ($result && $row = $result->fetch_assoc()) {
    $lastID = intval(substr($row['ProjectID'], 1));
    $newID = 'P' . str_pad($lastID + 1, 3, '0', STR_PAD_LEFT);
} else {
    $newID = 'P001';
}

function generateInviteCode($length = 6) {
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    $inviteCode = '';
    for ($i = 0; $i < $length; $i++) {
        $inviteCode .= $characters[random_int(0, strlen($characters) - 1)];
    }
    return $inviteCode;
}

$rawCode = generateInviteCode(); 

$encryptedCode = base64_encode(
    openssl_encrypt(
        $rawCode,
        'AES-128-ECB',
        ENCRYPTION_KEY,
        OPENSSL_RAW_DATA
    )
);

$stmt = $conn->prepare("
    INSERT INTO projects (ProjectID, ProjectName, InviteCode, Description, StartDate, EndDate)
    VALUES (?, ?, ?, ?, ?, ?)
");
$stmt->bind_param("ssssss", $newID, $projectName, $encryptedCode, $description, $startDate, $endDate);
$success = $stmt->execute();

if (!$success) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to create project', 'error' => $conn->error]);
    exit;
}

$role = 'Team Leader';
$status = 'Active';
$stmt2 = $conn->prepare("
    INSERT INTO projectmembers (ProjectID, UserID, Role, Status)
    VALUES (?, ?, ?, ?)
");
$stmt2->bind_param("ssss", $newID, $userID, $role, $status);
$stmt2->execute();

echo json_encode([
    'status' => 'ok',
    'message' => 'Project created successfully',
    'ProjectID' => $newID,
    'InviteCode' => $rawCode
]);

$conn->close();
?>

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
if (!$input || !isset($input['InviteCode'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    exit;
}

$plainCode = trim($input['InviteCode']);
if ($plainCode === '') {
    echo json_encode(['status' => 'error', 'message' => 'Invite code is empty']);
    exit;
}


$stmt = $conn->prepare("SELECT ProjectID, InviteCode FROM projects");
$stmt->execute();
$result = $stmt->get_result();

$projectID = null;

while ($row = $result->fetch_assoc()) {
    $decryptedCode = openssl_decrypt(
        base64_decode($row['InviteCode']),
        'AES-128-ECB',
        ENCRYPTION_KEY,
        OPENSSL_RAW_DATA
    );

    if ($decryptedCode === $plainCode) {
        $projectID = $row['ProjectID'];
        break;
    }
}

if (!$projectID) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid invite code']);
    exit;
}

$stmt2 = $conn->prepare("
    SELECT p.ProjectName, pm.UserID, pm.Status
    FROM projectmembers pm
    JOIN projects p ON pm.ProjectID = p.ProjectID
    WHERE pm.ProjectID = ? AND pm.UserID = ?
");
$stmt2->bind_param("ss", $projectID, $userID);
$stmt2->execute();
$res2 = $stmt2->get_result();

if ($row = $res2->fetch_assoc()) {
    $existingProjectName = $row['ProjectName'];
    $existingStatus = $row['Status'];

    if (strtolower($existingStatus) === 'active') {
        echo json_encode([
            'status' => 'error',
            'message' => "You are already an active member of project '{$existingProjectName}'"
        ]);
        exit;
    } elseif (strtolower($existingStatus) === 'pending' || strtolower($existingStatus) === 'rejected' || strtolower($existingStatus) === 'removed') {
        $updateStmt = $conn->prepare("
            UPDATE projectmembers
            SET Status = 'Active', Role = 'Team Member'
            WHERE ProjectID = ? AND UserID = ?
        ");
        $updateStmt->bind_param("ss", $projectID, $userID);
        $updateStmt->execute();
        $updateStmt->close();

        echo json_encode([
            'status' => 'ok',
            'message' => "Your pending invitation for project '{$existingProjectName}' has been activated",
            'ProjectID' => $projectID,
            'ProjectName' => $existingProjectName
        ]);
        exit;
    }
}


$stmtProject = $conn->prepare("SELECT ProjectName FROM projects WHERE ProjectID = ?");
$stmtProject->bind_param("s", $projectID);
$stmtProject->execute();
$resultProject = $stmtProject->get_result();
$projectRow = $resultProject->fetch_assoc();
$projectName = $projectRow['ProjectName'] ?? '';

$role = 'Team Member';
$status = 'Active';

$stmt3 = $conn->prepare("INSERT INTO projectmembers (ProjectID, UserID, Role, Status) VALUES (?, ?, ?, ?)");
$stmt3->bind_param("ssss", $projectID, $userID, $role, $status);
$success = $stmt3->execute();

if (!$success) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to join project',
        'error' => $conn->error
    ]);
    exit;
}

echo json_encode([
    'status' => 'ok',
    'message' => 'Successfully joined the project',
    'ProjectID' => $projectID,
    'ProjectName' => $projectName
]);

$conn->close();
?>


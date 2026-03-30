<?php
session_start();
require 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['userID'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

$userID = $_SESSION['userID'];

// Retrieve pending projects and their team leader info
$stmt = $conn->prepare("
    SELECT 
        p.ProjectID, 
        p.ProjectName,
        tl.UserID AS TeamLeaderID,
        u.FullName AS TeamLeaderName,
        u.AvatarColor AS TeamLeaderAvatarColor
    FROM projectmembers pm
    JOIN projects p ON pm.ProjectID = p.ProjectID
    LEFT JOIN projectmembers tl ON tl.ProjectID = p.ProjectID AND tl.Role = 'Team Leader'
    LEFT JOIN users u ON tl.UserID = u.UserID
    WHERE pm.UserID = ? AND pm.Status = 'Pending'
");

$stmt->bind_param("s", $userID);
$stmt->execute();
$result = $stmt->get_result();

$pendingProjects = [];
while ($row = $result->fetch_assoc()) {
    $pendingProjects[] = [
        'ProjectID' => $row['ProjectID'],
        'ProjectName' => $row['ProjectName'],
        'TeamLeader' => [
            'UserID' => $row['TeamLeaderID'],
            'FullName' => $row['TeamLeaderName'],
            'AvatarColor' => $row['TeamLeaderAvatarColor']
        ]
    ];
}

echo json_encode([
    'status' => 'ok',
    'pendingProjects' => $pendingProjects
]);

$stmt->close();
$conn->close();
?>


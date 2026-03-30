<?php
session_start();
require 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['userID'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

$userID = $_SESSION['userID'];

$sessionProject = $_SESSION['currentProject'] ?? null;
if (!$sessionProject || !isset($sessionProject['ProjectID'])) {
    echo json_encode(['status' => 'error', 'message' => 'Project not found in session']);
    exit;
}

$projectID = $sessionProject['ProjectID'];

$stmtProject = $conn->prepare("
    SELECT ProjectID, ProjectName, InviteCode, Description, StartDate, EndDate
    FROM projects
    WHERE ProjectID = ?
    LIMIT 1
");
$stmtProject->bind_param("s", $projectID);
$stmtProject->execute();
$resultProject = $stmtProject->get_result();

if ($resultProject->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Project not found in database']);
    exit;
}

$project = $resultProject->fetch_assoc();
$stmtProject->close();

$stmt = $conn->prepare("
    SELECT TaskID, ParentTaskID, ProjectID, AssignedUserID, TaskTitle, Description, Priority, Status, StartDate, DueDate
    FROM tasks
    WHERE ProjectID = ?
");
$stmt->bind_param("s", $projectID);
$stmt->execute();
$result = $stmt->get_result();

$tasks = [];
while ($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}

$stmtMembers = $conn->prepare("
    SELECT pm.UserID, u.FullName, u.AvatarColor, pm.Role, pm.Status
    FROM projectmembers pm
    JOIN users u ON pm.UserID = u.UserID
    WHERE pm.ProjectID = ?
    ORDER BY 
        CASE Role
            WHEN 'Team Leader' THEN 1
            WHEN 'Project Manager' THEN 2
            WHEN 'Team Member' THEN 3
            ELSE 4
        END
");
$stmtMembers->bind_param("s", $projectID);
$stmtMembers->execute();
$resMembers = $stmtMembers->get_result();

$members = [];
while ($row = $resMembers->fetch_assoc()) {
    $members[] = $row;
}

$resultUsers = $conn->query("SELECT UserID, FullName, Email, AvatarColor FROM users");
$allUsers = [];
while ($row = $resultUsers->fetch_assoc()) {
    $allUsers[] = $row;
}

$stmtComments = $conn->prepare("
    SELECT c.CommentID, c.TaskID, c.UserID, u.FullName, u.AvatarColor, c.CreatedAt, c.Description
    FROM comments c
    JOIN tasks t ON c.TaskID = t.TaskID
    JOIN users u ON c.UserID = u.UserID
    WHERE t.ProjectID = ?
    ORDER BY c.CreatedAt DESC
");
$stmtComments->bind_param("s", $projectID);
$stmtComments->execute();
$resComments = $stmtComments->get_result();

$comments = [];
while ($row = $resComments->fetch_assoc()) {
    $comments[] = $row;
}


$stmtTaskAttach = $conn->prepare("
    SELECT f.TaskID, a.AttachmentID, a.FileName, a.FileType, a.FileSize, a.FilePath, a.UploadTime, a.UploadedBy
    FROM finalworkattachment f
    JOIN attachment a ON f.AttachmentID = a.AttachmentID
    JOIN tasks t ON f.TaskID = t.TaskID
    WHERE t.ProjectID = ?
");
$stmtTaskAttach->bind_param("s", $projectID);
$stmtTaskAttach->execute();
$resTaskAttach = $stmtTaskAttach->get_result();

$taskAttachments = [];
while ($row = $resTaskAttach->fetch_assoc()) {
    $taskAttachments[] = $row;
}

$stmtCommentAttach = $conn->prepare("
    SELECT c.CommentID, a.AttachmentID, a.FileName, a.FileType, a.FileSize, a.FilePath, a.UploadTime, a.UploadedBy
    FROM commentattachments ca
    JOIN comments c ON ca.CommentID = c.CommentID
    JOIN attachment a ON ca.AttachmentID = a.AttachmentID
    JOIN tasks t ON c.TaskID = t.TaskID
    WHERE t.ProjectID = ?
");
$stmtCommentAttach->bind_param("s", $projectID);
$stmtCommentAttach->execute();
$resCommentAttach = $stmtCommentAttach->get_result();

$commentAttachments = [];
while ($row = $resCommentAttach->fetch_assoc()) {
    $commentAttachments[] = $row;
}

echo json_encode([
    'status' => 'ok',
    'project' => [
        'ProjectID' => $project['ProjectID'],
        'ProjectName' => $project['ProjectName'],
        'Description' => $project['Description'],
        'StartDate' => $project['StartDate'],
        'EndDate' => $project['EndDate']
    ],
    'tasks' => $tasks,
    'members' => $members,
    'allUsers' => $allUsers,
    'comments' => $comments,
    'taskAttachments' => $taskAttachments,
    'commentAttachments' => $commentAttachments,
]);

$conn->close();
?>

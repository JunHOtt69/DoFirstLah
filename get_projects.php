<?php
session_start();
include 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['userID'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

$userID = $_SESSION['userID'];

$project_sql = "SELECT p.ProjectID, p.ProjectName, p.InviteCode, p.Description, p.StartDate, p.EndDate
                FROM projects p
                JOIN projectmembers pm ON p.ProjectID = pm.ProjectID
                WHERE pm.UserID = ? AND pm.Status = 'Active'
                ";
$stmt = $conn->prepare($project_sql);
$stmt->bind_param("s", $userID);
$stmt->execute();
$result = $stmt->get_result();

$projects = [];

while ($project = $result->fetch_assoc()) {
    $projectID = $project['ProjectID'];

    $member_sql = "SELECT UserID FROM projectmembers 
                    WHERE ProjectID = ? AND Status = 'Active'
                    ORDER BY 
                        CASE Role
                            WHEN 'Team Leader' THEN 1
                            WHEN 'Project Manager' THEN 2
                            WHEN 'Team Member' THEN 3
                            ELSE 4
                        END
                    LIMIT 3";
    $stmt_m = $conn->prepare($member_sql);
    $stmt_m->bind_param("s", $projectID);
    $stmt_m->execute();
    $result_m = $stmt_m->get_result();

    $members = [];
    while ($member = $result_m->fetch_assoc()) {
        $memberID = $member['UserID'];


        $user_sql = "SELECT FullName, AvatarColor FROM users WHERE UserID = ?";
        $stmt_u = $conn->prepare($user_sql);
        $stmt_u->bind_param("s", $memberID);
        $stmt_u->execute();
        $res_u = $stmt_u->get_result();

        if ($userRow = $res_u->fetch_assoc()) {
            $initial = strtoupper(substr($userRow['FullName'], 0, 1));
            $avatarColor = $userRow['AvatarColor'];
            $members[] = [
                'initial' => $initial,
                'AvatarColor' => $avatarColor
            ];
        }
    }

    $projects[] = [
        'ProjectID' => $projectID,
        'name' => $project['ProjectName'],
        'member1' => $members[0]['initial'] ?? null,
        'member1Style' => isset($members[0]) ? $members[0]['AvatarColor'] : null,
        'member2' => $members[1]['initial'] ?? null,
        'member2Style' => isset($members[1]) ? $members[1]['AvatarColor'] : null,
        'member3' => $members[2]['initial'] ?? null,
        'member3Style' => isset($members[2]) ? $members[2]['AvatarColor'] : null,
        'link' => "5-projectSummary.php?code=" . urlencode($project['InviteCode'])
    ];
}

echo json_encode([
    'status' => 'ok',
    'projects' => $projects
]);
?>

<?php
session_start();
include 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['userID'])) {
    echo json_encode(['status'=>'error','message'=>'Not logged in']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['ProjectID'])) {
    echo json_encode(['status'=>'error','message'=>'No ProjectID']);
    exit;
}

$projectID = $input['ProjectID'];

$stmt = $conn->prepare("SELECT * FROM projects WHERE ProjectID = ?");
$stmt->bind_param("s", $projectID);
$stmt->execute();
$res = $stmt->get_result();
$project = $res->fetch_assoc();

if (!$project) {
    echo json_encode(['status'=>'error','message'=>'Project not found']);
    exit;
}

$stmt_m = $conn->prepare("SELECT u.FullName, u.AvatarColor FROM projectmembers pm JOIN users u ON pm.UserID = u.UserID WHERE pm.ProjectID = ? LIMIT 3");
$stmt_m->bind_param("s", $projectID);
$stmt_m->execute();
$res_m = $stmt_m->get_result();
$members = [];
while($m = $res_m->fetch_assoc()){
    $members[] = [
        'initial' => strtoupper(substr($m['FullName'],0,1)),
        'AvatarColor' => $m['AvatarColor']
    ];
}

$_SESSION['currentProject'] = [
    'ProjectID' => $projectID,
    'name' => $project['ProjectName'],
    'members' => $members,
    'Description' => $project['Description'] ?? '',
    'StartDate' => $project['StartDate'],
    'EndDate' => $project['EndDate'] ?? '',
    'InviteCode' => $project['InviteCode']
];

echo json_encode(['status'=>'ok']);
?>

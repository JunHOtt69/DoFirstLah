<?php
session_start();
include 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['userID'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

$userID = $_SESSION['userID'];

$events_sql = "SELECT EventID, UserID, EventTitle, EventDescription, Style, StartDate, EndDate 
               FROM userevents WHERE UserID = ?";
$stmt1 = $conn->prepare($events_sql);
$stmt1->bind_param("s", $userID);
$stmt1->execute();
$result1 = $stmt1->get_result();

$events = [];
while ($row = $result1->fetch_assoc()) {
    $events[] = [
        'EventID' => $row['EventID'],
        'UserID' => $row['UserID'],
        'EventTitle' => $row['EventTitle'],
        'EventDescription' => $row['EventDescription'],
        'Style' => (int)$row['Style'],
        'StartDate' => $row['StartDate'],
        'EndDate' => $row['EndDate']
    ];
}


$reminders_sql = "SELECT ReminderID, UserID, Title, Description, RemindAt, Status
                  FROM userreminders WHERE UserID = ?";
$stmt2 = $conn->prepare($reminders_sql);
$stmt2->bind_param("s", $userID);
$stmt2->execute();
$result2 = $stmt2->get_result();

$reminders = [];
while ($row = $result2->fetch_assoc()) {
    $reminders[] = [
        'ReminderID' => $row['ReminderID'],
        'UserID' => $row['UserID'],
        'Title' => $row['Title'],
        'Description' => $row['Description'],
        'RemindAt' => $row['RemindAt'],
        'Status' => $row['Status']
    ];
}

echo json_encode([
    'status' => 'ok',
    'events' => $events,
    'reminders' => $reminders
]);

$stmt1->close();
$stmt2->close();
$conn->close();
?>


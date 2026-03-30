<?php
include 'config.php';
error_reporting(E_ALL);
ini_set('display_errors', 1);

$data = json_decode(file_get_contents('php://input'), true);

$reminderID = $data['ReminderID'] ?? '';
$title = $data['Title'] ?? null;
$desc = $data['Description'] ?? null;
$remindAt = $data['RemindAt'] ?? null;
$status = $data['Status'] ?? 'pending';

session_start();
$userID = $_SESSION['userID'] ?? null;

if (!$userID) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

if (empty($reminderID)) {
    // Generate new ReminderID (e.g., R001, R002...)
    $result = $conn->query("SELECT ReminderID FROM userreminders ORDER BY ReminderID DESC LIMIT 1");
    if ($row = $result->fetch_assoc()) {
        $lastID = intval(substr($row['ReminderID'], 1)) + 1;
        $reminderID = 'R' . str_pad($lastID, 3, '0', STR_PAD_LEFT);
    } else {
        $reminderID = 'R001';
    }

    $stmt = $conn->prepare("INSERT INTO userreminders (ReminderID, UserID, Title, Description, RemindAt, Status)
                            VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $reminderID, $userID, $title, $desc, $remindAt, $status);
} else {
    // If only updating the status
    if ($title === null && $desc === null && $remindAt === null) {
        $stmt = $conn->prepare("UPDATE userreminders SET Status=? WHERE ReminderID=? AND UserID=?");
        $stmt->bind_param("sss", $status, $reminderID, $userID);
    } else {
        // Updating all details
        $stmt = $conn->prepare("UPDATE userreminders SET Title=?, Description=?, RemindAt=?, Status=? WHERE ReminderID=? AND UserID=?");
        $stmt->bind_param("ssssss", $title, $desc, $remindAt, $status, $reminderID, $userID);
    }
}

// ✅ Make sure we actually execute and respond
if ($stmt && $stmt->execute()) {
    echo json_encode(['status' => 'ok', 'message' => 'Reminder saved successfully']);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to save reminder',
        'error' => $conn->error
    ]);
}
?>


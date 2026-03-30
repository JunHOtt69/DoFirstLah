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
$eventID = isset($input['EventID']) ? trim($input['EventID']) : '';
$title = trim($input['EventTitle'] ?? '');
$desc = trim($input['EventDescription'] ?? '');
$style = isset($input['Style']) ? (int)$input['Style'] : 0;
$startDate = trim($input['StartDate'] ?? '');
$endDate = trim($input['EndDate'] ?? '');

try {
    if ($eventID && $title === '' && $desc === '' && (!isset($input['Style']) || $style === 0)) {
        if (empty($startDate) || empty($endDate)) {
            echo json_encode(['status' => 'error', 'message' => 'Missing date values']);
            exit;
        }

        $sql = "UPDATE userevents SET StartDate=?, EndDate=? WHERE EventID=? AND UserID=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $startDate, $endDate, $eventID, $userID);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'ok', 'message' => 'Event time updated successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No changes made or event not found']);
        }

        $stmt->close();
        $conn->close();
        exit;
    }

    /** 🔹 Case 2: Normal create/update via dialog **/
    if (empty($title) || empty($style) || empty($startDate) || empty($endDate)) {
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
        exit;
    }

    if ($eventID) {
        $sql = "UPDATE userevents 
                SET EventTitle=?, EventDescription=?, Style=?, StartDate=?, EndDate=? 
                WHERE EventID=? AND UserID=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssissss", $title, $desc, $style, $startDate, $endDate, $eventID, $userID);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'ok', 'message' => 'Event updated successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No changes made or event not found']);
        }

        $stmt->close();
    } else {
        $getID = "SELECT EventID FROM userevents ORDER BY EventID DESC LIMIT 1";
        $result = $conn->query($getID);
        if ($result && $row = $result->fetch_assoc()) {
            $lastID = intval(substr($row['EventID'], 1));
            $newID = 'E' . str_pad($lastID + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $newID = 'E001';
        }

        $sql = "INSERT INTO userevents (EventID, UserID, EventTitle, EventDescription, Style, StartDate, EndDate)
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssiss", $newID, $userID, $title, $desc, $style, $startDate, $endDate);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'ok', 'message' => 'Event created successfully', 'EventID' => $newID]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to create event']);
        }

        $stmt->close();
    }

    $conn->close();

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>


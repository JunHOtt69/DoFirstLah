<?php
require 'config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read the raw JSON body
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';

    if ($email === '') {
        echo json_encode(['error' => 'Email not provided']);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM users WHERE Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    echo json_encode(['exists' => $result->num_rows > 0]);
    exit;
}
?>

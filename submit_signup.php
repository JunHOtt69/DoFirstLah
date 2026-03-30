<?php
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $first_name = $_POST['first-name'] ?? '';
    $last_name = $_POST['last-name'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    $security_question = $_POST['securityQuestion'] ?? '';
    $security_answer = $_POST['securityAnswer'] ?? ''; 

    $full_name = trim($first_name . ' ' . $last_name);

    if (empty($first_name) || empty($last_name) || empty($email) || empty($password) ||
        empty($confirm_password) || empty($security_question) || empty($security_answer)) {
        exit();
    }

    if ($password !== $confirm_password) {
        exit();
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $result = $conn->query("SELECT UserID FROM users ORDER BY UserID DESC LIMIT 1");
    if ($result->num_rows > 0) {
        $lastID = $result->fetch_assoc()['UserID'];

        preg_match('/(\d+)$/', $lastID, $matches);
        $num = isset($matches[1]) ? intval($matches[1]) + 1 : 1;

        $prefix = preg_replace('/\d+$/', '', $lastID);
        $newUserID = $prefix . str_pad($num, 3, '0', STR_PAD_LEFT);
    } else {
        $newUserID = 'USR001';
    }

    $colors = [
            '--avatar-color1',
            '--avatar-color2',
            '--avatar-color3',
            '--avatar-color4',
            '--avatar-color5',
            '--avatar-color6',
            '--avatar-color7',
            '--avatar-color8',
            '--avatar-color9',
            '--avatar-color10',
            '--avatar-color11',
            '--avatar-color12',
            '--avatar-color13',
            '--avatar-color14',
            '--avatar-color15',
            '--avatar-color16',
            '--avatar-color17',
            '--avatar-color18',
            '--avatar-color19',
            '--avatar-color20',
            '--avatar-color21',
            '--avatar-color22',
    ];
    $avatar_color = $colors[array_rand($colors)];

    $hashed_security_answer = password_hash($securityAnswer, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (UserID, FullName, Email, Password, SecurityQuestion, SecurityAnswer, AvatarColor)
                            VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $newUserID, $full_name, $email, $hashed_password, $security_question, $hashed_security_answer, $avatar_color);

    if ($stmt->execute()) {
        header("Location: 2-log_in.php?signup=success");
        exit();
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>

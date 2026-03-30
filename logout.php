<?php
session_start();
include 'config.php';

if (isset($_SESSION['userID'])) {
    $stmt = $conn->prepare("DELETE FROM rememberme WHERE UserID = ?");
    $stmt->bind_param("s", $_SESSION['userID']);
    $stmt->execute();
}

setcookie('rememberMe', '', time() - 3600, '/');

$_SESSION = [];
session_unset();
session_destroy();

header("Location: login.php");
exit();
?>

<?php
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "dofirstlah";

$conn = new mysqli($servername, $username, $password, $dbname);

define('ENCRYPTION_KEY', 'myFreakySecretKey0265916!!');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>

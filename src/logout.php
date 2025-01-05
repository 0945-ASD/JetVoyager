<?php
// Start the session
session_start();

// Destroy the session
session_destroy();

// Redirect the user to the login page
header('Location: http://localhost/JetVoyager/src/User_pages/Unregistered/Login.php');
exit();
?>

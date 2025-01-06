<?php
// Database connection
$conn = new mysqli('localhost', 'root', '', 'jetvoyager_db');

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get data from POST request
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
    $id = $conn->real_escape_string($data['id']);

    // Delete destination from database
    $sql = "DELETE FROM destination WHERE Destination_ID = '$id'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Destination deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete destination']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
}

$conn->close();
?>

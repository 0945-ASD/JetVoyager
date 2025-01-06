<?php
// Start session and database connection
session_start();
$conn = new mysqli('localhost', 'root', '', 'jetvoyager_db');

// Check connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}

// Retrieve and validate input
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['destination_id'])) {
    echo json_encode(['success' => false, 'message' => 'Destination ID is required']);
    exit;
}

$destination_id = intval($data['destination_id']);

// Delete query
$query = "DELETE FROM destination WHERE Destination_ID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $destination_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Destination deleted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete destination']);
}

$stmt->close();
$conn->close();
?>

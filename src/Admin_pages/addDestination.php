<?php
// Database connection
$conn = new mysqli('localhost', 'root', '', 'jetvoyager_db');

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get data from POST request
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['destination'], $data['location'], $data['description'])) {
    $destination = $conn->real_escape_string($data['destination']);
    $location = $conn->real_escape_string($data['location']);
    $description = $conn->real_escape_string($data['description']);

    // Insert data into database
    $sql = "INSERT INTO destination (Destination_name, Location, Destination_description) 
            VALUES ('$destination', '$location', '$description')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Destination added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add destination']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
}

$conn->close();
?>

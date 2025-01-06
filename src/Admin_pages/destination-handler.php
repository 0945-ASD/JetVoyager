<?php
require 'db_connection.php'; // Include your database connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $destination_id = isset($_POST['destination_id']) ? intval($_POST['destination_id']) : null;
    $destination_name = $_POST['destination_name'];
    $location = $_POST['location'];
    $description = $_POST['description'];

    if ($destination_id) {
        // Update existing destination
        $sql = "UPDATE destination SET Destination_name = ?, Location = ?, Destination_description = ? WHERE Destination_ID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssi", $destination_name, $location, $description, $destination_id);

        if ($stmt->execute()) {
            echo "Destination updated successfully.";
        } else {
            echo "Error updating destination: " . $conn->error;
        }
    } else {
        // Add a new destination
        $sql = "INSERT INTO destination (Destination_name, Location, Destination_description) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $destination_name, $location, $description);

        if ($stmt->execute()) {
            echo "Destination added successfully.";
        } else {
            echo "Error adding destination: " . $conn->error;
        }
    }

    // Redirect back to the destinations page
    header('Location: homePage.php#destination');
    exit;
}
?>

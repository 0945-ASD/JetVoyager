<?php
// Database connection
$conn = new mysqli('localhost', 'root', '', 'jetvoyager_db');

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch destinations from the database
$sql = "SELECT * FROM destination";
$result = $conn->query($sql);

$destinations = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $destinations[] = $row;  // Push the row to the destinations array
    }
}

// Send the destinations data as a JSON response
echo json_encode($destinations);

$conn->close();
?>

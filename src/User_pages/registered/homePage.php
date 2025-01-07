<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user-email'])) {
    header('Location: http://localhost/JetVoyager/src/User_pages/Unregistered/Login.php');
    exit();
}

// Retrieve session variables
$userEmail = $_SESSION['user-email'];

// Include the config file for database connection
include('../../config.php');

// Fetch destinations from the database
$query = "
    SELECT d.Destination_ID, d.Destination_name, di.Image_path 
    FROM destination d
    LEFT JOIN destination_image di ON d.Destination_ID = di.Destination_ID
    LIMIT 4"; // Adjust limit as needed

$result = $conn->query($query);
$destinations = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $destinations[] = $row;
    }
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JetVoyager - Tour Management</title>
    <link rel="stylesheet" href="http://localhost/JetVoyager/src/User_pages/registered/homePage.css" />
</head>

<body>
    <header>
        <a class="logo" href="http://localhost/JetVoyager/src/User_pages/registered/homePage.php">JetVoyager</a>
        <div class="navbar">
            <ul class="nav-links">
                <li><a href="http://localhost/JetVoyager/src/User_pages/registered/bookTours.php">Book Tours</a></li>
                <li><a href="http://localhost/JetVoyager/src/User_pages/registered/HotelView.php">View Hotels</a></li>
                <li><a href="http://localhost/JetVoyager/src/User_pages/registered/manageTours.php">Manage Tours</a></li>
                <li><a href="http://localhost/JetVoyager/src/User_pages/registered/tourHistory.php">Tour History</a></li>
                <li><a href="http://localhost/JetVoyager/src/User_pages/registered/profile.php">Profile</a></li>
            </ul>
        </div>
    </header>

    <div class="main-content" id="search-bar">
        <h1>Welcome to JetVoyager</h1>
        <div class="search-bar">
            <input type="text" placeholder="Search for tours..." />
        </div>
        <div class="popular-destinations">
            <?php if (!empty($destinations)) : ?>
                <?php foreach ($destinations as $destination) : ?>
                    <div class="destination-card">
                        <img src="<?= htmlspecialchars($destination['Image_path']) ?: 'https://via.placeholder.com/300x200' ?>" alt="<?= htmlspecialchars($destination['Destination_name']) ?>" />
                        <h3><?= htmlspecialchars($destination['Destination_name']) ?></h3>
                    </div>
                <?php endforeach; ?>
            <?php else : ?>
                <p>No destinations available at the moment.</p>
            <?php endif; ?>
        </div>
    </div>

    <footer>© 2024 JetVoyager. All Rights Reserved.</footer>
</body>

</html>

<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user-email'])) {
    header('Location: http://localhost/JetVoyager/src/User_pages/Unregistered/Login.php');
    exit();
}

// Include the config.php file with the correct relative path
include('../../config.php');  // Assuming config.php is two directories up from this file

// Retrieve hotel ID from the URL (if available) and store it in the session
if (isset($_GET['hotel_id'])) {
    $_SESSION['hotel_id'] = $_GET['hotel_id'];
}

// Retrieve hotel ID from the session
$hotelID = isset($_SESSION['hotel_id']) ? $_SESSION['hotel_id'] : '';

// If hotelID is not set in the session, show an error
if (!$hotelID) {
    echo "No hotel selected.";
    exit();
}

// Fetch hotel details based on the hotel ID
$query = $conn->prepare("SELECT Hotel_ID, Hotel_name, Location, No_of_rooms, Hotel_phone, Hotel_email FROM hotel_agent WHERE Hotel_ID = ?");
$query->bind_param('i', $hotelID);
$query->execute();
$result = $query->get_result();

$hotel = $result->fetch_assoc();

if (!$hotel) {
    echo "Hotel not found.";
    exit();
}

$query->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JetVoyager - Hotel Booking</title>
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

    <main>
        <h1>Hotel Details</h1>
        <section>
            <h2><?php echo htmlspecialchars($hotel['Hotel_name']); ?></h2>
            <p><strong>Location:</strong> <?php echo htmlspecialchars($hotel['Location']); ?></p>
            <p><strong>Number of Rooms:</strong> <?php echo htmlspecialchars($hotel['No_of_rooms']); ?></p>
            <p><strong>Phone:</strong> <?php echo htmlspecialchars($hotel['Hotel_phone']); ?></p>
            <p><strong>Email:</strong> <?php echo htmlspecialchars($hotel['Hotel_email']); ?></p>
        </section>
    </main>

    <footer>
        © 2024 JetVoyager. All Rights Reserved.
    </footer>
</body>
</html>

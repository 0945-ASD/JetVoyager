<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user-email'])) {
    header('Location: http://localhost/JetVoyager/JetVoyager/src/User_pages/Unregistered/Login.php');
    exit();
}

// Retrieve the session variables
$userEmail = $_SESSION['user-email'];
$userPassword = $_SESSION['user-pswd'];

// Use a relative path to include the config.php file
include('../../config.php');

// $hotelId = intval($_GET['hotel_id']);

// // Fetch hotel details from the database
// $query = $conn->prepare("SELECT name, location, price_per_night FROM hotels WHERE id = ?");
// $query->bind_param('i', $hotelId);
// $query->execute();
// $result = $query->get_result();

// if ($result->num_rows > 0) {
//     $hotel = $result->fetch_assoc();
// } else {
//     die("Hotel not found.");
// }

// $query->close();
// $conn->close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JetVoyager - Tour Management</title>
    <link
        rel="stylesheet"
        href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/homePage.css" />
</head>

<body>
    <header>
        <a class="logo" href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/homePage.php">JetVoyager</a>
        <div class="navbar">
            <ul class="nav-links">
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/bookTours.php" onclick="showFeature('book-tours'); return false;">Book Tours</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/HotelView.php" onclick="showFeature('book-tours'); return false;">View Hotels</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/manageTours.php" onclick="showFeature('manage-tours'); return false;">Manage Tours</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/tourHistory.php" onclick="showFeature('tour-history'); return false;">Tour History</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/profile.php" onclick="showFeature('profile'); return false;">Profile</a></li>
            </ul>
        </div>
    </header>
    <form method="POST" action="confirmBooking.php">
        <input type="hidden" name="hotel_id" value="<?php echo $hotelId; ?>">
        <label for="check-in">Check-in Date:</label>
        <input type="date" id="check-in" name="check_in" required>

        <label for="check-out">Check-out Date:</label>
        <input type="date" id="check-out" name="check_out" required>

        <button type="submit">Confirm Booking</button>
    </form>
</body>

</html>
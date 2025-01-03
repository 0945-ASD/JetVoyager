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

// Include the config.php file
include('../../config.php');

// Fetch all hotel details from the database
$query = $conn->prepare("SELECT Hotel_ID, Hotel_name, Location, No_of_rooms, Hotel_phone, Hotel_email FROM hotel_agent");
$query->execute();
$result = $query->get_result();

$hotels = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $hotels[] = $row; // Add each hotel record to the array
    }
} else {
    die("No hotels found.");
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
    <link
        rel="stylesheet"
        href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/homePage.css" />
</head>

<body>
    <header>
        <a class="logo" href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/homePage.php">JetVoyager</a>
        <div class="navbar">
            <ul class="nav-links">
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/bookTours.php">Book Tours</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/HotelView.php">View Hotels</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/manageTours.php">Manage Tours</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/tourHistory.php">Tour History</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/profile.php">Profile</a></li>
            </ul>
        </div>
    </header>

    <main>
        <h1>Available Hotels</h1>
        <section class="hotels">
            <?php if (!empty($hotels)) : ?>
                <?php foreach ($hotels as $hotel) : ?>
                    <div class="hotel-card">
                        <h2><?php echo htmlspecialchars($hotel['Hotel_name']); ?></h2>
                        <p><strong>Location:</strong> <?php echo htmlspecialchars($hotel['Location']); ?></p>
                        <p><strong>Number of Rooms:</strong> <?php echo htmlspecialchars($hotel['No_of_rooms']); ?></p>
                        <p><strong>Phone:</strong> <?php echo htmlspecialchars($hotel['Hotel_phone']); ?></p>
                        <p><strong>Email:</strong> <?php echo htmlspecialchars($hotel['Hotel_email']); ?></p>
                        <a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/viewHotelDetails.php?Hotel_ID=<?php echo $hotel['Hotel_ID']; ?>">View Details</a>
                    </div>
                <?php endforeach; ?>
            <?php else : ?>
                <p>No hotels are currently available.</p>
            <?php endif; ?>
        </section>
    </main>
</body>

</html>

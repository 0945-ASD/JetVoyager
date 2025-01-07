<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user-email'])) {
    header('Location: http://localhost/JetVoyager/src/User_pages/Unregistered/Login.php');
    exit();
}

// Include the config.php file with the correct relative path
include('../../config.php');  // Assuming config.php is two directories up from this file

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
// Store the Hotel_ID in the session when the user clicks "View Details"
$_SESSION['hotel_id'] = $hotel['Hotel_ID'];

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
    <style>
        .hotels {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px;
        }

        .hotel-card {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hotel-card h2 {
            color: #0073e6;
            margin: 0 0 10px;
        }

        .hotel-card p {
            margin: 5px 0;
            color: #555;
        }

        .hotel-card a {
            display: inline-block;
            margin-top: 10px;
            padding: 10px 15px;
            background-color: #0073e6;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }

        .hotel-card a:hover {
            background-color: #005bb5;
        }

        .hotel-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
        }
    </style>
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
                        <!-- Add the "View Details" button that will redirect to HotelDetails.php -->
                        <a href="HotelDetails.php?hotel_id=<?php echo $hotel['Hotel_ID']; ?>">View Details</a>
                        </div>
                <?php endforeach; ?>
            <?php else : ?>
                <p>No hotels are currently available.</p>
            <?php endif; ?>
        </section>
    </main>

    <footer>
        © 2024 JetVoyager. All Rights Reserved.
    </footer>
</body>
</html>

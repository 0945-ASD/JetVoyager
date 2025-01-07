<?php
// Start the session
session_start();

// Include the database configuration file
$conn = new mysqli('localhost', 'root', '', 'jetvoyager_db');

if ($conn->connect_error) {
    die('Connection Error: ' . $conn->connect_error);
}

// Retrieve the room ID and hotel ID from the URL
$roomID = isset($_GET['room_id']) && !empty($_GET['room_id']) ? $_GET['room_id'] : null;
$hotelID = isset($_GET['hotel_id']) && !empty($_GET['hotel_id']) ? $_GET['hotel_id'] : null;

// If roomID or hotelID is not provided, show an error
if (is_null($roomID) || is_null($hotelID)) {
    echo "Invalid room or hotel. Please ensure the URL contains both room_id and hotel_id.";
    exit();
}

// Retrieve the logged-in user's ID from the session
if (!isset($_SESSION['user-id'])) {
    echo "You must be logged in to book a room.";
    exit();
}
$userID = $_SESSION['user-id'];

// Handle the form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $checkin = $_POST['checkin'];
    $checkout = $_POST['checkout'];
    $guests = $_POST['guests'];
    $roomType = $_POST['room-type'];

    // Validate inputs
    if (empty($checkin) || empty($checkout) || empty($guests) || empty($roomType)) {
        echo "All fields are required.";
        exit();
    }

    // Get the price for the selected room
    $sqlRoomPrice = "SELECT rt.Room_price 
                     FROM room r 
                     JOIN Room_type rt ON r.type_id = rt.type_id 
                     WHERE r.Room_ID = ?";
    $stmtRoomPrice = $conn->prepare($sqlRoomPrice);
    $stmtRoomPrice->bind_param('i', $roomID);
    $stmtRoomPrice->execute();
    $roomPriceResult = $stmtRoomPrice->get_result();
    
    if ($roomPriceResult->num_rows === 0) {
        echo "Room price not found. Please try again.";
        exit();
    }
    $roomPrice = $roomPriceResult->fetch_assoc()['Room_price'];

    // Calculate total price
    $nights = (strtotime($checkout) - strtotime($checkin)) / (60 * 60 * 24); // Calculate number of nights
    if ($nights <= 0) {
        echo "Check-out date must be after check-in date.";
        exit();
    }
    $totalPrice = $nights * $roomPrice * $guests;

    // Insert the booking into the database
    $sqlBooking = "INSERT INTO booking (User_ID, Room_ID, Check_in_date, Check_out_date, No_of_rooms, Total_price)
                   VALUES (?, ?, ?, ?, ?, ?)";
    $stmtBooking = $conn->prepare($sqlBooking);
    $stmtBooking->bind_param('iissii', $userID, $roomID, $checkin, $checkout, $guests, $totalPrice);

    if ($stmtBooking->execute()) {
        echo "Booking successful!";
    } else {
        echo "Failed to book the room. Please try again.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Room</title>
</head>
<body>
    <header>
        <a href="http://localhost/JetVoyager/src/User_pages/registered/homePage.php">JetVoyager</a>
    </header>

    <main>
        <h2>Book a Room</h2>
        <form method="post" action="">
            <label for="checkin">Check-in Date:</label>
            <input type="date" id="checkin" name="checkin" required>

            <label for="checkout">Check-out Date:</label>
            <input type="date" id="checkout" name="checkout" required>

            <label for="guests">Number of Guests:</label>
            <input type="number" id="guests" name="guests" min="1" required>

            <label for="room-type">Room Type:</label>
            <select id="room-type" name="room-type" required>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="standard">Standard</option>
            </select>

            <button type="submit">Book Now</button>
        </form>
    </main>
</body>
</html>

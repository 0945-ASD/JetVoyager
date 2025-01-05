<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel Details</title>
    <link rel="stylesheet" href="http://localhost/JetVoyager/src/User_pages/registered/homePage.css">
</head>
<body>
    <header>
        <h1>Hotel Name</h1>
        <nav>
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Rooms</a></li>
                <li><a href="#">Amenities</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section id="hotel-description">
            <h2>About the Hotel</h2>
            <p>Welcome to our hotel. We offer the best services and amenities to make your stay comfortable and enjoyable.</p>
        </section>
        <section id="room-details">
            <h2>Room Details</h2>
            <ul>
                <li>Room Type: Deluxe</li>
                <li>Price: $200 per night</li>
                <li>Bed Type: King Size</li>
                <li>Occupancy: 2 Adults</li>
            </ul>
        </section>
        <section id="amenities">
            <h2>Amenities</h2>
            <ul>
                <li>Free Wi-Fi</li>
                <li>Swimming Pool</li>
                <li>Gym</li>
                <li>Spa</li>
                <li>Restaurant</li>
            </ul>
        </section>
        <section id="booking">
            <h2>Book a Room</h2>
            <form action="bookRoom.php" method="post">
                <label for="checkin">Check-in Date:</label>
                <input type="date" id="checkin" name="checkin" required>
                <label for="checkout">Check-out Date:</label>
                <input type="date" id="checkout" name="checkout" required>
                <label for="guests">Number of Guests:</label>
                 <!-- Example code snippet for HotelView.php -->
                <?php foreach ($hotels as $hotel): ?>
                    <div class="hotel">
                        <h3><?php echo htmlspecialchars($hotel['name']); ?></h3>
                        <p><?php echo htmlspecialchars($hotel['location']); ?></p>
                        <a href="HotelFrontPage.php?hotel_id=<?php echo $hotel['id']; ?>">View Details</a>
                    </div>
                <?php endforeach; ?>                <!-- Example code snippet for HotelView.php -->
                <?php foreach ($hotels as $hotel): ?>
                    <div class="hotel">
                        <h3><?php echo htmlspecialchars($hotel['name']); ?></h3>
                        <p><?php echo htmlspecialchars($hotel['location']); ?></p>
                        <a href="HotelFrontPage.php?hotel_id=<?php echo $hotel['id']; ?>">View Details</a>
                    </div>
                <?php endforeach; ?>               <input type="number" id="guests" name="guests" min="1" max="4" required>
                <label for="room-type">Room Type:</label>
                <select id="room-type" name="room-type" required>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                    <option value="standard">Standard</option>
                </select>
                <button type="submit">Book Now</button>
            </form>
        </section>
    </main>
    <footer>
        <p>&copy; 2023 Hotel Name. All rights reserved.</p>
    </footer>
</body>
</html>
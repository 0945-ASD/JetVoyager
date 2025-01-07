<?php

session_start();

// Check if the user is logged in
if (!isset($_SESSION['user-email'])) {
    header('Location: http://localhost/JetVoyager/src/User_pages/Unregistered/Login.php');
    exit();
}

// Retrieve the session variables
$userEmail = $_SESSION['user-email'];
$userPassword = $_SESSION['user-pswd'];

// Use a relative path to include the config.php file
include('../../config.php');


?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Tour</title>
    <link rel="stylesheet" href="http://localhost/JetVoyager/src/User_pages/registered/homePage.css">
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


    <div id="book-tours" class="main-content">
        <h2>Book a Tour</h2>
        <form class="booking-form">
            <label for="tour">Select Tour:</label>
            <select id="tour">
                <option value="paris">Paris, France</option>
                <option value="kyoto">Kyoto, Japan</option>
                <option value="new-york">New York, USA</option>
                <option value="rome">Rome, Italy</option>
            </select>

            <label for="date">Select Date:</label>
            <input type="date" id="date">

            <button type="button" onclick="confirmBooking()">Look for accommodation</button>
        </form>
    </div>




    <footer>
        © 2024 JetVoyager. All Rights Reserved.
    </footer>

    <script>
    function confirmBooking() {
        const tour = document.getElementById('tour').value;
        const date = document.getElementById('date').value;

        if (tour && date) {
            let destination;
            // Set the destination name based on the selected option
            switch(tour) {
                case 'paris':
                    destination = 'Paris, France';
                    break;
                case 'kyoto':
                    destination = 'Kyoto, Japan';
                    break;
                case 'new-york':
                    destination = 'New York, USA';
                    break;
                case 'rome':
                    destination = 'Rome, Italy';
                    break;
                default:
                    destination = '';
            }

            // Redirect to the hotel view page with the selected destination
            window.location.href = `http://localhost/JetVoyager/src/User_pages/registered/HotelView.php?destination=${encodeURIComponent(destination)}&date=${date}`;
        } else {
            alert('Please select both a tour and a date to proceed.');
        }
    }
</script>


</body>

</html>
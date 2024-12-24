<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Tour</title>
    <link rel="stylesheet" href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/homePage.css">
</head>

<body>
    <header>
    <div class="logo" href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/homePage.php">JetVoyager</div>
        <div class="navbar">
            <ul class="nav-links" >
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/bookTours.php" onclick="showFeature('book-tours'); return false;">Book Tours</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/manageTours.php" onclick="showFeature('manage-tours'); return false;">Manage Tours</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/tourHistory.php" onclick="showFeature('tour-history'); return false;">Tour History</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/profile.php" onclick="showFeature('profile'); return false;">Profile</a></li>
            </ul>
        </div>
    </header>


    <div id="book-tours" class="feature-section" class="main-content">
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
        function showFeature(featureId) {
            const sections = document.querySelectorAll('.feature-section');
            sections.forEach(section => section.style.display = 'none');
            document.getElementById(featureId).style.display = 'flex';
        }

        function confirmBooking() {
            const tour = document.getElementById('tour').value;
            const date = document.getElementById('date').value;
            if (tour && date) {
                alert(`Your tour to ${tour.charAt(0).toUpperCase() + tour.slice(1)} on ${date} has selected!`);
            } else {
                alert('Please select both a tour and a date to proceed.');
            }
        }
    </script>

</body>

</html>
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
      <ul class="nav-links" >
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/HotelView.php" onclick="showFeature('book-tours'); return false;">View Hotels</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/bookTours.php" onclick="showFeature('book-tours'); return false;">Book Tours</a></li>
        <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/manageTours.php" onclick="showFeature('manage-tours'); return false;">Manage Tours</a></li>
        <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/tourHistory.php" onclick="showFeature('tour-history'); return false;">Tour History</a></li>
        <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/profile.php" onclick="showFeature('profile'); return false;">Profile</a></li>
      </ul>
    </div>
  </header>

  <div class="main-content" id="search-bar">
    <h1>Welcome to JetVoyager</h1>
    <div class="search-bar">
      <input type="text" placeholder="Search for tours..." />
    </div>
    <div class="popular-destinations">
      <div class="destination-card">
        <img src="https://via.placeholder.com/300x200" alt="Destination 1" />
        <h3>Paris, France</h3>
      </div>
      <div class="destination-card">
        <img src="https://via.placeholder.com/300x200" alt="Destination 2" />
        <h3>Kyoto, Japan</h3>
      </div>
      <div class="destination-card">
        <img src="https://via.placeholder.com/300x200" alt="Destination 3" />
        <h3>New York, USA</h3>
      </div>
      <div class="destination-card">
        <img src="https://via.placeholder.com/300x200" alt="Destination 4" />
        <h3>Rome, Italy</h3>
      </div>
    </div>
  </div>

  <footer>© 2024 JetVoyager. All Rights Reserved.</footer>
</body>
<script>
  function showFeature(featureId) {
    const sections = document.querySelectorAll('.feature-section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(featureId).style.display = 'block'; // Or 'flex' if needed
  }
</script>

</html>
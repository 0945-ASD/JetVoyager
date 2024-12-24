<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tour history</title>
    <link rel="stylesheet" href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/homePage.css">
</head>

<body>
    <header>
    <a class="logo" href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/homePage.php">JetVoyager</a>
        <div class="navbar">
            <ul class="nav-links" >
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/bookTours.php" onclick="showFeature('book-tours'); return false;">Book Tours</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/manageTours.php" onclick="showFeature('manage-tours'); return false;">Manage Tours</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/tourHistory.php" onclick="showFeature('tour-history'); return false;">Tour History</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/profile.php" onclick="showFeature('profile'); return false;">Profile</a></li>
            </ul>
        </div>
    </header>


    <div id="tour-history" class="main-content">
        <h2>Tour History</h2>
        <p>Relive your past adventures by viewing your tour history.</p>
    </div>





    <footer>
        © 2024 JetVoyager. All Rights Reserved.
    </footer>

</body>
<script>
    function showFeature(featureId) {
    const sections = document.querySelectorAll('.feature-section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(featureId).style.display = 'block'; // Or 'flex' if needed
}

</script>
</html>
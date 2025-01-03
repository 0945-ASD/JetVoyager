<?php

session_start();

// Check if the user is logged in
if (!isset($_SESSION['agent-email'])) {
    header('Location: http://localhost/JetVoyager/JetVoyager/src/User_pages/Unregistered/Login.php');
    exit();
}

// Retrieve the session variables
$agentEmail = $_SESSION['agent-email'];
$agentPassword = $_SESSION['agent-pswd'];

// Use a relative path to include the config.php file
$configPath = __DIR__ . '/../config.php'; // Adjust path as needed
if (file_exists($configPath)) {
    include($configPath);
} else {
    die("Error: Unable to load configuration file.");
}

// Fetch user details from the database
$query = $conn->prepare("SELECT * FROM hotel_agent WHERE Hotel_email = ? AND password = ?");
$query->bind_param('ss', $agentEmail, $agentPassword);

$HotelDetails = [];
if ($query->execute()) {
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        $HotelDetails = $result->fetch_assoc();
    } else {
        echo "Invalid login credentials!";
        exit();
    }
}



// Handle form submission for updating profile
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $location = $_POST['location']; // Adjusted to match the 'Location' column
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $password = $_POST['password'];

    $updateQuery = $conn->prepare("UPDATE hotel_agent SET Hotel_name = ?, Location = ?, Hotel_email = ?, Hotel_phone = ?, password = ? WHERE Hotel_email = ?");
    $updateQuery->bind_param('ssssss', $name, $location, $email, $phone, $password, $agentEmail);

    if ($updateQuery->execute()) {
        // Update session variables if email or password changed
        $_SESSION['agent-email'] = $agentEmail;
        $_SESSION['agent-pswd'] = $agentPassword;

        // Redirect to the profile page
        header('Location: homePage.php#profile');
        exit();
    } else {
        echo "Error updating record: " . $conn->error;
    }

    $updateQuery->close();
}

$query->close();
$conn->close();

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JetVoyager Agent Portal</title>
    <link rel="stylesheet" href="http://localhost/JetVoyager/JetVoyager/src/Agent_pages/homePage.css">
    <script src="scripts.js" defer></script>
</head>

<body>
    <div class="admin-container">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="sidebar-header">JetVoyager</div>
            <ul class="menu">
                <li><a href="#dashboard">Dashboard</a></li>
                <li><a href="#tour-management">Tour Management</a></li>
                <li><a href="#booking-management">Booking Management</a></li>
                <li><a href="#customer-interaction">Customer Interaction</a></li>
                <li><a href="#reports">Reports</a></li>
                <li><a href="#profile">Profile</a></li>
            </ul>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <header class="header">
                <h1>Agent Portal</h1>
                <div class="header-actions">
                    <button>Logout</button>
                </div>
            </header>

            <main>
                <!-- Dashboard Section -->
                <section id="dashboard" class="section">
                    <h2>Agent Dashboard</h2>
                    <div class="stats">
                        <div class="stat">Upcoming Tours: <span id="upcoming-tours">0</span></div>
                        <div class="stat">Active Bookings: <span id="active-bookings">0</span></div>
                        <div class="stat">Customer Inquiries: <span id="customer-inquiries">0</span></div>
                    </div>
                    <div id="notifications">
                        <h3>Notifications</h3>
                        <ul id="notification-list"></ul>
                    </div>
                </section>

                <!-- Tour Management Section -->
                <section id="tour-management" class="section">
                    <h2>Tour Management</h2>
                    <button id="create-tour">Create New Tour</button>
                    <div id="tour-list">
                        <h3>Existing Tours</h3>
                        <ul></ul>
                    </div>
                </section>

                <!-- Booking Management Section -->
                <section id="booking-management" class="section">
                    <h2>Booking Management</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Tour Name</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </section>

                <!-- Customer Interaction Section -->
                <section id="customer-interaction" class="section">
                    <h2>Customer Interaction</h2>
                    <div id="customer-messages">
                        <ul></ul>
                    </div>
                </section>

                <!-- Reports Section -->
                <section id="reports" class="section">
                    <h2>Reports and Analytics</h2>
                    <div id="report-options">
                        <button>Generate Revenue Report</button>
                        <button>View Popular Tours</button>
                    </div>
                </section>

                <!-- Profile Section -->
                <section id="profile" class="section">
                    <div id="profile" class="profile">
                        <h2>Your Profile</h2>
                        <div class="profile-details">
                            <p><strong>Hotel Name:</strong> <span id="profile-name"><?php echo htmlspecialchars($HotelDetails['Hotel_name']); ?></span></p>
                            <p><strong>Location:</strong> <span id="profile-location"><?php echo htmlspecialchars($HotelDetails['Location']); ?></span></p>
                            <p><strong>Email:</strong> <span id="profile-email"><?php echo htmlspecialchars($HotelDetails['Hotel_email']); ?></span></p>
                            <p><strong>Phone:</strong> <span id="profile-phone"><?php echo htmlspecialchars($HotelDetails['Hotel_phone']); ?></span></p>
                            <p><strong>Password:</strong> <span id="profile-password"><?php echo htmlspecialchars($HotelDetails['password']); ?></span></p>

                            <button class="edit-button" onclick="openModal()">Edit Profile</button>
                        </div>
                    </div>

                    <div class="modal" id="edit-modal">
                        <div class="modal-content">
                            <h3>Edit Profile</h3>
                            <form id="edit-profile-form" method="POST" action="homePage.php#profile">
                                <label for="edit-name">Hotel Name:</label>
                                <input type="text" id="edit-name" name="name" value="<?php echo htmlspecialchars($HotelDetails['Hotel_name']); ?>">

                                <label for="edit-location">Location:</label>
                                <input type="text" id="edit-location" name="location" value="<?php echo htmlspecialchars($HotelDetails['Location']); ?>">

                                <label for="edit-email">Email:</label>
                                <input type="email" id="edit-email" name="email" value="<?php echo htmlspecialchars($HotelDetails['Hotel_email']); ?>">

                                <label for="edit-phone">Phone:</label>
                                <input type="tel" id="edit-phone" name="phone" value="<?php echo htmlspecialchars($HotelDetails['Hotel_phone']); ?>">

                                <label for="edit-password">Password:</label>
                                <input type="password" id="edit-password" name="password" value="<?php echo htmlspecialchars($HotelDetails['password']); ?>">

                                <button type="submit" class="save-button">Save</button>
                                <button type="button" class="cancel-button" onclick="closeModal()">Cancel</button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    </div>
</body>

<script>
    function openModal() {
        document.getElementById('edit-modal').style.display = 'block';
    }

    function closeModal() {
        document.getElementById('edit-modal').style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == document.getElementById('edit-modal')) {
            closeModal();
        }
    }
</script>

</html>
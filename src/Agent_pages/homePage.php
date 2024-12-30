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
$configPath = __DIR__ . '/../config.php'; // Adjust path as needed
if (file_exists($configPath)) {
    include($configPath);
} else {
    die("Error: Unable to load configuration file.");
}

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
                <div class="sidebar-item">
                    <li><a href="#dashboard">Dashboard</a></li>
                </div>
                <div class="sidebar-item">
                    <li><a href="#tour-management">Tour Management</a></li>
                </div>
                <div class="sidebar-item">
                    <li><a href="#booking-management">Booking Management</a></li>
                </div>
                <div class="sidebar-item">
                    <li><a href="#customer-interaction">Customer Interaction</a></li>
                </div>
                <div class="sidebar-item">
                    <li><a href="#reports">Reports</a></li>
                </div>
                <div class="sidebar-item">
                    <li><a href="#profile">Profile</a></li>
                </div>
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
                    <h2>Agent Profile</h2>
                    <form id="profile-form">
                        <label for="name">Name:</label>
                        <input type="text" id="name" name="name">

                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email">

                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password">

                        <button type="submit">Update Profile</button>
                    </form>
                </section>
            </main>
        </div>
    </div>
</body>
</html>

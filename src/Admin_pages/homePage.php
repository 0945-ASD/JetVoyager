<?php
$host = "localhost"; // Database host
$user = "root";      // Database username
$pass = "";          // Database password
$db = "jetvoyager_db";  // Your database name

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, name, email, message, status, created_at, phone FROM contact_form";
$result = $conn->query($sql);

$messages = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
}

echo json_encode($messages);
$conn->close();
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JetVoyager Admin Panel</title>
    <link rel="stylesheet" href="http://localhost/JetVoyager/JetVoyager/src/Admin_pages/homePage.css?v=1.0">
    <script src="http://localhost/JetVoyager/JetVoyager/src/Admin_pages/homePage.js?v=1.0" defer></script>
</head>

<body>
    <div class="admin-container">
        <!-- Sidebar -->
        <nav class="sidebar">
            <div class="sidebar-header">
                <h2>JetVoyager Admin</h2>
            </div>
            <ul class="menu">
                <li><a href="#dashboard">Dashboard</a></li>
                <!-- <li><a href="#users">Manage Users</a></li> -->
                <li><a href="#tours">Manage Destinations</a></li>
                <li><a href="#bookings">Manage Recent Bookings</a></li>
                <li><a href="#notifications">Notifications</a></li>
                <!-- <li><a href="#reports">Reports</a></li> -->
                <li><a href="#settings">Settings</a></li>
                <li><a href="#support">Customer Support</a></li>
            </ul>
        </nav>

        <!-- Main Content -->
        <main class="main-content">
            <header class="header">
                <h1>Welcome to JetVoyager Admin Panel</h1>
                <div class="header-actions">
                    <button>Logout</button>
                </div>
            </header>

            <section id="dashboard" class="section">
                <h2>Dashboard</h2>
                <div class="stats">
                    <div class="stat">Total Users: 150</div>
                    <div class="stat">Total Tours: 45</div>
                    <div class="stat">Bookings Today: 12</div>
                    <div class="stat">Revenue: $4500</div>
                </div>
            </section>

            <!-- <section id="users" class="section">
                <h2>Manage Users</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Jane Doe</td>
                            <td>jane.doe@example.com</td>
                            <td><button>Edit</button> <button>Delete</button></td>
                        </tr>
                    </tbody>
                </table>
            </section> -->

            <section id="tours" class="section">
                <h2>Manage Tours</h2>
                <button>Add New Tour</button>
                <ul>
                    <li>Tour 1: <button>Edit</button> <button>Delete</button></li>
                    <li>Tour 2: <button>Edit</button> <button>Delete</button></li>
                </ul>
            </section>

            <section id="bookings" class="section">
                <h2>Manage Bookings</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>User</th>
                            <th>Tour</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>101</td>
                            <td>John Smith</td>
                            <td>Island Adventure</td>
                            <td>Pending</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- <section id="notifications" class="section">
                <h2>Notifications</h2>
                <button>Send New Notification</button>
            </section> -->

            <!-- <section id="reports" class="section">
                <h2>Reports</h2>
                <button>Generate Report</button>
            </section> -->

            <section id="settings" class="section">
                <h2>Settings</h2>
                <button>Update Settings</button>
            </section>

            <section id="support" class="section">
                <h2>Customer Support</h2>
                <table id="support-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Message</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Dynamic content will be injected here -->
                    </tbody>
                </table>
            </section>

        </main>
    </div>
</body>


</html>
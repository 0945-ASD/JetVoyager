<?php
session_start();

// Database connection
$conn = new mysqli('localhost', 'root', '', 'jetvoyager_db');

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch total users
$userCountQuery = "SELECT COUNT(*) AS total_users FROM r_user";
$userCountResult = $conn->query($userCountQuery);
$totalUsers = ($userCountResult && $userCountResult->num_rows > 0) ? $userCountResult->fetch_assoc()['total_users'] : 0;

// Fetch total bookings
$bookingCountQuery = "SELECT COUNT(*) AS total_bookings FROM booking";
$bookingCountResult = $conn->query($bookingCountQuery);
$totalBookings = ($bookingCountResult && $bookingCountResult->num_rows > 0) ? $bookingCountResult->fetch_assoc()['total_bookings'] : 0;

// Fetch total hotels
$hotelCountQuery = "SELECT COUNT(*) AS total_hotels FROM hotel_agent";
$hotelCountResult = $conn->query($hotelCountQuery);
$totalHotels = ($hotelCountResult && $hotelCountResult->num_rows > 0) ? $hotelCountResult->fetch_assoc()['total_hotels'] : 0;

$destinationName = isset($destinationDetails['Destination_name']) ? $destinationDetails['Destination_name'] : '';
$location = isset($destinationDetails['location']) ? $destinationDetails['location'] : '';
$description = isset($destinationDetails['Destination_description']) ? $destinationDetails['Destination_description'] : '';


// Fetch destinations for list
$query = "SELECT * FROM destination";
$result = $conn->query($query);
$destinations = [];
if ($result && $result->num_rows > 0) {
    $destinations = $result->fetch_all(MYSQLI_ASSOC);
}

// Fetch destination for editing
$destinationDetails = null;
if (isset($_GET['destination_id'])) {
    $destination_id = intval($_GET['destination_id']);
    $query = "SELECT * FROM destination WHERE Destination_ID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $destination_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $destinationDetails = $result->fetch_assoc();
}


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['destination_id'])) {
    $destination_id = intval($_POST['destination_id']);
    $destination_name = $_POST['destination_name'];
    $location = $_POST['location'];
    $description = $_POST['description'];

    // Update query
    $sql = "UPDATE destination SET Destination_name = ?, location = ?, Destination_description = ? WHERE Destination_ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssi", $destination_name, $location, $description, $destination_id);

    if ($stmt->execute()) {
        echo "Destination updated successfully.";
    } else {
        echo "Error updating destination: " . $conn->error;
    }

    header('Location: homePage.php#destination');
    exit;
}

// Fetch messages
$messages = [];
$query = "SELECT id, name, email, message, status, created_at, phone FROM contact_form";
$result = $conn->query($query);
if ($result && $result->num_rows > 0) {
    $messages = $result->fetch_all(MYSQLI_ASSOC);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $destination_id = isset($_POST['destination_id']) ? intval($_POST['destination_id']) : null;
    $destination_name = $_POST['destination_name'];
    $location = $_POST['location'];
    $description = $_POST['description'];

    if ($destination_id) {
        $sql = "UPDATE destination SET Destination_name = ?, location = ?, Destination_description = ? WHERE Destination_ID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssi", $destination_name, $location, $description, $destination_id);

        if ($stmt->execute()) {
            echo "Destination updated successfully.";
        } else {
            echo "Error updating destination: " . $conn->error;
        }
    } else {
        $sql = "INSERT INTO destination (Destination_name, location, Destination_description) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $destination_name, $location, $description);

        if ($stmt->execute()) {
            echo "Destination added successfully.";
        } else {
            echo "Error adding destination: " . $conn->error;
        }
    }

    header('Location: homePage.php#destination');
    exit;
}

// SQL query to fetch data
$sql = "SELECT id, name, email, message, status, created_at, phone FROM contact_form";
$result = $conn->query($sql);

if (!$result) {
    die("Query failed: " . $conn->error);
}

$messages = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
} else {
    error_log("No rows found in contact_form table.");
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate JSON payload
    if (isset($data['id'], $data['status'])) {
        $id = $data['id'];
        $status = $data['status'];

        // Validate the status
        if (!in_array($status, ['pending', 'reviewed', 'resolved'])) {
            echo json_encode(['success' => false, 'message' => 'Invalid status']);
            exit;
        }

        // Update the status in the database
        $sql = "UPDATE contact_form SET status = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $status, $id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Status updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update status']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
    }
    $conn->close();
    exit;
}
$conn->close();
session_destroy();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JetVoyager Admin Panel</title>
    <link rel="stylesheet" href="http://localhost/JetVoyager/src/Admin_pages/homePage.css?v=1.0">
    <script src="http://localhost/JetVoyager/JetVoyager/src/Admin_pages/homePage.js"></script>
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
                <li><a href="#destination">Manage Destinations</a></li>
                <li><a href="#bookings">Manage Recent Bookings</a></li>
                <!-- <li><a href="#notifications">Notifications</a></li> -->
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
                    <div class="stat">Total Users: <?php echo $totalUsers; ?></div>
                    <div class="stat">Total Destinations: <?php echo count($destinations); ?></div>
                    <div class="stat">Total Bookings: <?php echo $totalBookings; ?></div>
                    <div class="stat">Total Hotels: <?php echo $totalHotels; ?></div>
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
            <section id="destination" class="section">
                <h2>Manage Destinations</h2>

                <!-- Add New Destination Form -->
                <div id="destination-form-section">
                    <h3><?php echo isset($_GET['destination_id']) ? 'Edit Destination' : 'Add New Destination'; ?></h3>
                    <form id="destination-form" method="POST" action="homePage.php">
                        <input type="hidden" name="destination_id"
                            value="<?php echo isset($destinationDetails) ? htmlspecialchars($destinationDetails['Destination_ID']) : ''; ?>">
                        <label for="destination-name">Destination Name:</label>
                        <input type="text" id="destination-name" name="destination_name"
                            value="<?php echo isset($destinationDetails) ? htmlspecialchars($destinationDetails['Destination_name']) : ''; ?>" required>
                        <label for="location">Location:</label><input type="text" id="location" name="location"
                            value="<?php echo isset($destinationDetails['location']) ? htmlspecialchars($destinationDetails['location']) : ''; ?>" required>
                        <label for="description">Description:</label>
                        <textarea id="description" name="description" required><?php echo isset($destinationDetails) ? htmlspecialchars($destinationDetails['Destination_description']) : ''; ?></textarea>
                        <button type="submit" class="save-button">
                            <?php echo isset($destinationDetails) ? 'Update Destination' : 'Add Destination'; ?>
                        </button>
                    </form>

                </div>


                <!-- List of Existing Destinations -->
                <div class="existing-destinations">
                    <h3>Existing Destinations</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Destination Name</th>
                                <th>Location</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            if (!empty($destinations)) {
                                foreach ($destinations as $destination) {
                                    echo "<tr>";
                                    echo "<td>" . htmlspecialchars($destination['Destination_ID']) . "</td>";
                                    echo "<td>" . htmlspecialchars($destination['Destination_name']) . "</td>";
                                    echo "<td>" . htmlspecialchars($destination['location']) . "</td>";
                                    echo "<td>" . htmlspecialchars($destination['Destination_description']) . "</td>";
                                    echo "<td>";
                                    echo "<button class='edit-destination' data-id='" . htmlspecialchars($destination['Destination_ID']) . "' 
                    data-name='" . htmlspecialchars($destination['Destination_name']) . "'
                    data-location='" . htmlspecialchars($destination['location']) . "'
                    data-description='" . htmlspecialchars($destination['Destination_description']) . "'>Edit</button>";
                                    echo "<button class='delete-destination' data-id='" . htmlspecialchars($destination['Destination_ID']) . "'>Delete</button>";
                                    echo "</td>";
                                    echo "</tr>";
                                }
                            } else {
                                echo "<tr><td colspan='5'>No Destinations found</td></tr>";
                            }
                            ?>
                        </tbody>

                    </table>
                </div>

                <div class="modal" id="edit-modal">
                    <div class="modal-content">
                        <h3>Edit Destination</h3>
                        <form id="edit-destination-form" method="POST" action="homePage.php">
                            <input type="hidden" name="destination_id" id="destination_id">
                            <label for="destination-name">Destination Name:</label>
                            <input type="text" id="destination-name" name="destination_name" value="<?php echo htmlspecialchars($destinationName); ?>" required>

                            <label for="location">Location:</label>
                            <input type="text" id="location" name="location" value="<?php echo htmlspecialchars($location); ?>" required>

                            <label for="description">Description:</label>
                            <textarea id="description" name="description" required><?php echo htmlspecialchars($description); ?></textarea>

                            <button type="submit" class="save-button">Save</button>
                            <button type="button" class="cancel-button" onclick="closeModal()">Cancel</button>
                        </form>
                    </div>
                </div>

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
                            <th>Phone</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Created_at</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        if (!empty($messages)) {
                            foreach ($messages as $message) {
                                echo "<tr>";
                                echo "<td>" . htmlspecialchars($message['id']) . "</td>";
                                echo "<td>" . htmlspecialchars($message['name']) . "</td>";
                                echo "<td>" . htmlspecialchars($message['email']) . "</td>";
                                echo "<td>" . htmlspecialchars($message['phone']) . "</td>";
                                echo "<td>" . htmlspecialchars($message['message']) . "</td>";
                                echo "<td>";
                                echo "<select class='status-dropdown' data-id='" . htmlspecialchars($message['status']) . "'>";
                                $options = ['pending', 'reviewed', 'resolved'];
                                foreach ($options as $option) {
                                    $selected = ($message['status'] === $option) ? "selected" : "";
                                    echo "<option value='$option' $selected>" . ucfirst($option) . "</option>";
                                }
                                echo "</select>";
                                echo "</td>";

                                echo "<td>" . htmlspecialchars($message['created_at']) . "</td>";
                                echo "</tr>";
                            }
                        } else {
                            echo "<tr><td colspan='7'>No Messages found</td></tr>";
                        }
                        ?>
                    </tbody>
                </table>
            </section>

        </main>
    </div>
</body>


</html>
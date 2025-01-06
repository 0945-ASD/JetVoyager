<?php
// Start session and enable error reporting for debugging
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Check if the agent is logged in
if (!isset($_SESSION['agent-email']) || !isset($_SESSION['agent-pswd'])) {
    error_log("Session expired or agent not logged in.");
    header('Location: ../User_pages/Unregistered/Login.php');
    exit();
}

// Get session variables
$agentEmail = $_SESSION['agent-email'];
$agentPassword = $_SESSION['agent-pswd'];

// Debug session variables
error_log("Agent Email: $agentEmail");

// Include database connection
include('../config.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Debug POST data
    error_log("Form submitted with POST data: " . print_r($_POST, true));

    // Validate and sanitize input
    $hotelDescription = $_POST['hotel_description'] ?? '';
    if (empty($hotelDescription)) {
        error_log("Hotel description is missing.");
        exit("Error: Missing hotel description.");
    }

    // File upload handling
    $imagePath = '';
    if (isset($_FILES['hotel_images']) && $_FILES['hotel_images']['error'] === UPLOAD_ERR_OK) {
        $imageTmpPath = $_FILES['hotel_images']['tmp_name'];
        $imageName = basename($_FILES['hotel_images']['name']);
        $imagePath = "../uploads/" . $imageName;

        // Move the uploaded file to the destination folder
        if (!move_uploaded_file($imageTmpPath, $imagePath)) {
            error_log("Failed to move uploaded file.");
            exit("Error: Failed to upload image.");
        }
        error_log("Image uploaded successfully: $imagePath");
    }

    // Fetch Hotel ID from the database
    $hotelID = null;
    $query = $conn->prepare("SELECT Hotel_ID FROM hotel_agent WHERE Hotel_email = ?");
    $query->bind_param("s", $agentEmail);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $hotelID = $row['Hotel_ID'];
        error_log("Hotel ID fetched: $hotelID");
    } else {
        error_log("Hotel ID not found for email: $agentEmail");
        exit("Error: Hotel ID not found.");
    }

    // Fetch Hotel ID from the database
    $hotelID = null;
    $query = $conn->prepare("SELECT Hotel_ID FROM hotel_agent WHERE Hotel_email = ?");
    $query->bind_param("s", $agentEmail);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $hotelID = $row['Hotel_ID'];
        error_log("Hotel ID fetched: $hotelID"); // Debugging log
    } else {
        error_log("Hotel ID not found for email: $agentEmail");
        exit("Error: Hotel ID not found.");
    }

    // Now, use the Hotel ID in the UPDATE query
    $query = $conn->prepare("UPDATE hotel_details SET description = ? WHERE Hotel_ID = ?");
    $query->bind_param("si", $hotelDescription, $hotelID); // Use Hotel ID instead of email
    if (!$query->execute()) {
        error_log("Error updating hotel_details: " . $conn->error);
        exit("Error: Failed to update hotel description.");
    }
    error_log("Hotel description updated successfully.");

    // Insert image into hotel_images table if image was uploaded
    if (!empty($imagePath)) {
        $query = $conn->prepare("INSERT INTO hotel_images (Hotel_ID, Image_path) VALUES (?, ?)");
        $query->bind_param("is", $hotelID, $imagePath);

        if (!$query->execute()) {
            error_log("Error inserting into hotel_images: " . $conn->error);
            exit("Error: Failed to save image.");
        }
        error_log("Image saved successfully to database.");
    }

    // Redirect to the same page or a confirmation page
    header('Location: homePage.php?update=success');
    exit();
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
    $name = $_POST['Hotel_name'];
    $location = $_POST['Location']; // Adjusted to match the 'Location' column
    $email = $_POST['Hotel_email'];
    $phone = $_POST['Hotel_phone'];
    $password = $_POST['password'];

    $updateQuery = $conn->prepare("UPDATE hotel_agent SET Hotel_name = ?, Location = ?, Hotel_email = ?, Hotel_phone = ?, password = ? WHERE Hotel_email = ?");
    $updateQuery->bind_param('ssssss', $name, $location, $email, $phone, $password, $agentEmail);

    if ($updateQuery->execute()) {
        // Update session variables if email or password changed
        $_SESSION['agent-email'] = $agentEmail;
        $_SESSION['agent-pswd'] = $agentPassword;

        // Redirect to the profile page
        header('Location: homePage.php');
        exit();
    } else {
        error_log("Error updating record: " . $conn->error);
        echo "An error occurred while updating your profile. Please try again later.";
    }

    $updateQuery->close();
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JetVoyager Agent Portal</title>
    <link rel="stylesheet" href="http://localhost/JetVoyager/src/Agent_pages/homePage.css">
    <script src="scripts.js" defer></script>
</head>

<body>
    <div class="admin-container">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="sidebar-header">JetVoyager</div>
            <ul class="menu">
                <li><a href="#dashboard">Dashboard</a></li>
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
                    <form action="http://localhost/JetVoyager/src/logout.php" method="POST" style="display:inline;">
                        <button type="submit" name="logout">Logout</button>
                    </form>
                </div>
            </header>

            <main>
                <!-- Dashboard Section -->
                <section id="dashboard" class="section">
                    <h2>Agent Dashboard</h2>
                    <div class="stats">
                        <div class="stat">Total Rooms: <span id="total-rooms"><?php echo htmlspecialchars($HotelDetails['No_of_rooms']); ?></span></div>
                        <div class="stat">Bookings: <span id="bookings">0</span></div>
                        <div class="stat">Reviews: <span id="reviews">0</span></div>
                    </div>
                </section>

                <!-- Booking Management Section -->
                <section id="booking-management" class="section">
                    <h2>Booking Management</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Room</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            include('../config.php');
                            $query = $conn->prepare("SELECT r_user.Name AS Customer, room.Room_ID, room.Room_status FROM booking INNER JOIN r_user ON booking.User_ID = r_user.User_ID INNER JOIN room ON booking.Room_ID = room.Room_ID WHERE room.Hotel_ID = ?");
                            $query->bind_param('i', $HotelDetails['Hotel_ID']);
                            $query->execute();
                            $result = $query->get_result();

                            while ($row = $result->fetch_assoc()) {
                                echo "<tr>";
                                echo "<td>" . htmlspecialchars($row['Customer']) . "</td>";
                                echo "<td>Room " . htmlspecialchars($row['Room_ID']) . "</td>";
                                echo "<td>" . htmlspecialchars($row['Room_status']) . "</td>";
                                echo "<td><button>Update</button></td>";
                                echo "</tr>";
                            }
                            ?>
                        </tbody>
                    </table>
                </section>

                <!-- Customer Interaction Section -->
                <section id="customer-interaction" class="section">
                    <h2>Manage Hotel Details</h2>
                    <form id="hotel-description-images-form" method="POST" enctype="multipart/form-data" action="homePage.php">
                        <label for="hotel-description">Hotel Description:</label>
                        <textarea id="hotel-description" name="hotel_description" rows="4" required></textarea>

                        <label for="hotel-images">Upload Hotel Images:</label>
                        <input type="file" id="hotel-images" name="hotel_images[]" accept="image/*" multiple required>

                        <button type="submit" class="save-button">Save</button>
                    </form>

                    <div id="uploaded-data">
                        <h3>Uploaded Data</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                include('../config.php');
                                $query = $conn->prepare("SELECT hotel_details.description, hotel_image.Image_path FROM hotel_details INNER JOIN hotel_image ON hotel_details.Hotel_ID = hotel_image.Hotel_ID WHERE hotel_details.Hotel_ID = ?");
                                $query->bind_param('i', $HotelDetails['Hotel_ID']);
                                $query->execute();
                                $result = $query->get_result();

                                while ($row = $result->fetch_assoc()) {
                                    echo "<tr>";
                                    echo "<td>" . htmlspecialchars($row['description']) . "</td>";
                                    echo "<td><img src='" . htmlspecialchars($row['Image_path']) . "' alt='Hotel Image' style='width: 100px; height: auto;'></td>";
                                    echo "</tr>";
                                }
                                ?>
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- Profile Section -->
                <section id="profile" class="section">
                    <h2>Your Profile</h2>
                    <div class="profile-details">
                        <p><strong>Hotel Name:</strong> <span id="profile-name"><?php echo htmlspecialchars($HotelDetails['Hotel_name']); ?></span></p>
                        <p><strong>Location:</strong> <span id="profile-location"><?php echo htmlspecialchars($HotelDetails['Location']); ?></span></p>
                        <p><strong>Email:</strong> <span id="profile-email"><?php echo htmlspecialchars($HotelDetails['Hotel_email']); ?></span></p>
                        <p><strong>Phone:</strong> <span id="profile-phone"><?php echo htmlspecialchars($HotelDetails['Hotel_phone']); ?></span></p>
                        <p><strong>Rooms:</strong> <span id="profile-rooms"><?php echo htmlspecialchars($HotelDetails['password']); ?></span></p>

                        <button class="edit-button" onclick="openModal()">Edit Profile</button>
                    </div>

                    <div class="modal" id="edit-modal">
                        <div class="modal-content">
                            <h3>Edit Profile</h3>
                            <form id="edit-profile-form" method="POST" action="homePage.php#profile">
                                <label for="name">Hotel Name:</label>
                                <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($HotelDetails['Hotel_name']); ?>">

                                <label for="location">Location:</label>
                                <input type="text" id="location" name="location" value="<?php echo htmlspecialchars($HotelDetails['Location']); ?>">

                                <label for="email">Email:</label>
                                <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($HotelDetails['Hotel_email']); ?>">

                                <label for="phone">Phone:</label>
                                <input type="tel" id="phone" name="phone" value="<?php echo htmlspecialchars($HotelDetails['Hotel_phone']); ?>">

                                <label for="password">Password:</label>
                                <input type="password" id="password" name="password" value="<?php echo htmlspecialchars($HotelDetails['password']); ?>">

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
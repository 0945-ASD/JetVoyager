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

// Handle form submission for updating profile
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $nic = $_POST['nic'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $password = $_POST['password'];

    $updateQuery = $conn->prepare("UPDATE r_user SET Name = ?, NIC = ?, EMAIL = ?, PhoneNum = ?, Password = ? WHERE EMAIL = ?");
    $updateQuery->bind_param('ssssss', $name, $nic, $email, $phone, $password, $userEmail);

    if ($updateQuery->execute()) {
        // Update session variables if email or password changed
        $_SESSION['user-email'] = $email;
        $_SESSION['user-pswd'] = $password;

        // Redirect to the profile page
        header('Location: profile.php');
        exit();
    } else {
        echo "Error updating record: " . $conn->error;
    }

    $updateQuery->close();
}

// Fetch user details from the database
$query = $conn->prepare("SELECT * FROM r_user WHERE EMAIL = ? AND Password = ?");
$query->bind_param('ss', $userEmail, $userPassword);

$userDetails = [];
if ($query->execute()) {
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        $userDetails = $result->fetch_assoc();
    } else {
        echo "Invalid login credentials!";
        exit();
    }
}

$query->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile</title>
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
    <main>
        <div id="profile" class="main-content">
            <h2>Your Profile</h2>
            <div class="profile-details">
                <p><strong>Name:</strong> <span id="profile-name"><?php echo htmlspecialchars($userDetails['Name'] ?? ''); ?></span></p>
                <p><strong>NIC:</strong> <span id="profile-NIC"><?php echo htmlspecialchars($userDetails['NIC'] ?? ''); ?></span></p>
                <p><strong>Email:</strong> <span id="profile-email"><?php echo htmlspecialchars($userDetails['EMAIL'] ?? ''); ?></span></p>
                <p><strong>Phone:</strong> <span id="profile-phone"><?php echo htmlspecialchars($userDetails['PhoneNum'] ?? ''); ?></span></p>
                <p><strong>Password:</strong> <span id="profile-Password"><?php echo htmlspecialchars($userDetails['Password'] ?? ''); ?></span></p>

                <button class="edit-button" onclick="openModal()">Edit Profile</button>
            </div>
        </div>

        <div class="modal" id="edit-modal">
            <div class="modal-content">
                <h3>Edit Profile</h3>
                <form id="edit-profile-form" method="POST" action="profile.php">
                    <label for="edit-name">Name:</label>
                    <input type="text" id="edit-name" name="name" value="<?php echo htmlspecialchars($userDetails['Name']); ?>">

                    <label for="edit-NIC">NIC:</label>
                    <input type="text" id="edit-NIC" name="nic" value="<?php echo htmlspecialchars($userDetails['NIC']); ?>">

                    <label for="edit-email">Email:</label>
                    <input type="email" id="edit-email" name="email" value="<?php echo htmlspecialchars($userDetails['EMAIL']); ?>">

                    <label for="edit-phone">Phone:</label>
                    <input type="tel" id="edit-phone" name="phone" value="<?php echo htmlspecialchars($userDetails['PhoneNum']); ?>">

                    <label for="edit-Password">Password:</label>
                    <input type="password" id="edit-Password" name="password" value="<?php echo htmlspecialchars($userDetails['Password']); ?>">

                    <button type="submit" class="save-button">Save</button>
                    <button type="button" class="cancel-button" onclick="closeModal()">Cancel</button>
                </form>
            </div>
        </div>
    </main>

    <footer>
        © 2024 JetVoyager. All Rights Reserved.
    </footer>

    <script>
        function openModal() {
            document.getElementById('edit-modal').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('edit-modal').style.display = 'none';
        }
    </script>
</body>

</html>
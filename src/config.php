<?php
  $conn = new mysqli('localhost', 'root', '', 'jetvoyager_db');

  if ($conn->connect_error) {
    die('Connection Error : ' . $conn->connect_error);
  }
  
?>
<?php
$id = $_POST['id'];
//database details
$dbHost     = 'localhost';
$dbUsername = 'root';
$dbPassword = '';
$dbName     = 'ElitePlanner';

//create connection and select DB
$db = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);
if ($db->connect_error) {
    die("Unable to connect database: " . $db->connect_error);
}

//update user data from the database
$query = $db->query("CALL getPastGoals('$id')");

$rows = array();
while ($r = mysqli_fetch_assoc($query)) {
    $rows[] = $r;
}

//returns data as JSON format
echo json_encode($rows);

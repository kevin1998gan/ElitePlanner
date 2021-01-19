<?php
    //database details
    $email = $_POST['in_email'];

    $dbHost     = 'localhost';
    $dbUsername = 'root';
    $dbPassword = '';
    $dbName     = 'ElitePlanner';
    
    //create connection and select DB
    $db = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);
    if($db->connect_error){
        die("Unable to connect database: " . $db->connect_error);
    }
    
    //get user data from the database
    $query = $db->query("CALL checkEmail('$email')");
    $r = "";
    $r = mysqli_fetch_assoc($query);

    //returns data as JSON format
    echo json_encode($r);
?>
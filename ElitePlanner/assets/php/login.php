<?php
     $email = $_POST['in_email'];
     $password = md5($_POST["in_password"]);

    //database details
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
    $query = $db->query("CALL check_User('$email','$password')");
    $r = mysqli_fetch_assoc($query);

    
    //returns data as JSON format
    echo json_encode($r);

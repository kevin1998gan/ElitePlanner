<?php

    $fname = $_POST['in_fname'];
    $lname = $_POST['in_lname'];
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
    
    //update user data from the database
    $query = $db->query("CALL insert_User('$fname', '$lname', '$email', '$password')");



?>

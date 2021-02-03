<?php
    $goalName = $_POST['goalName'];
    $start = $_POST['start'];
    $end = $_POST['end'];
    $id = $_POST['id'];
    
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
    $query = $db->query("CALL addGoal('$goalName', '$start', '$end','$id')");

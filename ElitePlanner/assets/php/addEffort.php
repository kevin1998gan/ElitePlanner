<?php
    $id = $_POST['id'];
    $effort = $_POST['effort'];
    $grade = $_POST['grade'];
    $credit_hour =$_POST['credit_hour'];
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
    $query = $db->query("CALL add_Effort('$effort', '$grade','$credit_hour','$id')");

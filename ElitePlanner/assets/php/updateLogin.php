<?php
    $id = $_POST['id'];
    $login = $_POST['login'];
    
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
    $query = $db->query("CALL updateLogin('$id', '$login')");

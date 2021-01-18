<?php

    $id = $_POST['id'];
    $task_name = $_POST['task_name'];
    $type = $_POST['type'];
    $due_date = date("Y-m-d H:i:s", strtotime($_POST['due_date']));;
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
    $query = $db->query("CALL edit_Task('$id', '$task_name', '$type', '1803631', '$due_date')");

?>

<?php
    include 'testHeroku.php';

    
    //update user data from the database
    $query = $db->query("SELECT * FROM users");
    $rows = array();
    while($r = mysqli_fetch_assoc($query)) {
        $rows[] = $r;
    }
    
    //returns data as JSON format
    echo json_encode($rows);

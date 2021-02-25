<?php
$dsn = "pgsql:"
    . "host=ec2-3-214-3-162.compute-1.amazonaws.com;"
    . "dbname=deebgt7apro3pu;"
    . "user=kriqhejgayywti;"
    . "port=5432;"
    . "sslmode=require;"
    . "password=4f607a0f2d151b2c543417d36e171889bae280575034c526d10c7fdb352f3f7e";

$db = new PDO($dsn);

$id = $_POST['id'];
$task_name = $_POST['task_name'];
$type = $_POST['type'];
$due_date = $_POST['due_date'];
$progress = $_POST['progression'];


$query = "CALL add_Task('$id', '$type', '$task_name','$due_date' , '$progress')";
$result = $db->query($query);

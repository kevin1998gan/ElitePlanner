<?php
$dsn = "pgsql:"
    . "host=ec2-3-214-3-162.compute-1.amazonaws.com;"
    . "dbname=deebgt7apro3pu;"
    . "user=kriqhejgayywti;"
    . "port=5432;"
    . "sslmode=require;"
    . "password=4f607a0f2d151b2c543417d36e171889bae280575034c526d10c7fdb352f3f7e";

$db = new PDO($dsn);


$goalName = $_POST['goalName'];
$start = $_POST['start'];
$end = $_POST['end'];
$id = $_POST['id'];


$query = "CALL addGoal('$goalName', '$start', '$end','$id')";
$result = $db->query($query);

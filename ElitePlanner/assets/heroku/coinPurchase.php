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
$points = $_POST['in_points'];
$coins = $_POST['in_coins'];


$query = "CALL coinPurchase('$id', '$points','$coins')";
$result = $db->query($query);

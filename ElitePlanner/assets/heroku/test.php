<?php
$dsn = "pgsql:"
    . "host=ec2-3-214-3-162.compute-1.amazonaws.com;"
    . "dbname=deebgt7apro3pu;"
    . "user=kriqhejgayywti;"
    . "port=5432;"
    . "sslmode=require;"
    . "password=4f607a0f2d151b2c543417d36e171889bae280575034c526d10c7fdb352f3f7e";

$db = new PDO($dsn);
//update user data from the database
$query = $db->query("SELECT * FROM users");
$rows = array();
while ($r = mysqli_fetch_assoc($query)) {
    $rows[] = $r;
}

//returns data as JSON format
echo json_encode($rows);

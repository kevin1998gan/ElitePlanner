<?php
     $id = $_POST['in_id'];
     $fname = $_POST["in_fname"];
     $lname = $_POST["in_lname"];
     $points = $_POST["in_points"];
     $login = $_POST["in_login"];
     $coins = $_POST["in_coin"];

session_start();

$_SESSION["id"] = $id;
$_SESSION["fname"] = $fname;
$_SESSION["lname"] = $lname;
$_SESSION["points"] = $points;
$_SESSION["login"] = $login;
$_SESSION["coins"] = $coins;
$_SESSION["spend"] = 0;


echo json_encode($_SESSION);
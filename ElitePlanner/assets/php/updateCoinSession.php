<?php
$points = $_POST['in_points'];
$coins = $_POST["in_coins"];
session_start();
$_SESSION["points"] = $_SESSION["points"] + $points;
$_SESSION["coins"] = $_SESSION["coins"] + $coins;
echo json_encode($_SESSION);

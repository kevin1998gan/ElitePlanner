<?php
$login = $_POST["login"];
$points = $_POST["points"];
session_start();
$_SESSION["login"] = $login;
$_SESSION["points"] = $_SESSION["points"] + $points;
echo json_encode($_SESSION);

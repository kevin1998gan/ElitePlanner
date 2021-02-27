<?php
$reminder = $_POST["reminder"];
session_start();
$_SESSION["reminder"] = $reminder;
echo json_encode($_SESSION);

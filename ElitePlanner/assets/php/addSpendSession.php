<?php
$spend = $_POST["spend"];
session_start();
$_SESSION["spend"] = $spend;
echo json_encode($_SESSION);

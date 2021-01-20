<?php
     $id = $_POST['in_id'];
     $fname = $_POST["in_fname"];
     $lname = $_POST["in_lname"];

session_start();

$_SESSION["id"] = $id;
$_SESSION["fname"] = $fname;
$_SESSION["lname"] = $lname;

echo json_encode($_SESSION);
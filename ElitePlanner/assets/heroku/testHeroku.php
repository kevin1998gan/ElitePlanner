<?php
 $host        = "host = ec2-3-214-3-162.compute-1.amazonaws.com";
 $port        = "port = 5432";
 $dbname      = "dbname = deebgt7apro3pu";
 $credentials = "user = kriqhejgayywti password=4f607a0f2d151b2c543417d36e171889bae280575034c526d10c7fdb352f3f7e";

 $db = pg_connect( "$host $port $dbname $credentials"  );
<?php
 		include_once('connection.php');
                $mysqli= new mysqli($host,$sqllogin,$sqlpass,$bd);
		$telephone_number = $_POST['usernamesignup'];
		$verification_code = $_POST['verification_code'];
 
		$mysqli->query("INSERT INTO `list` (telephone, verification_code) VALUES ('$telephone_number', '$verification_code')")

?>
<?php
 		include_once('db.php');
               
		$friend_jid = $_POST['friend_jid'];
		$initializer_friend_login = $_POST['initializer_friend_login'];

		$query = mysql_query("SELECT username FROM ofroster WHERE username='$initializer_friend_login' AND jid='$friend_jid' ");
$results = mysql_fetch_array($query);
print_r($results['username']);

?>
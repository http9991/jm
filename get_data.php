﻿<?php

	include_once('db.php');
$login = $_POST['login'];





$rs = mysql_query("SELECT name FROM ofuser WHERE username = '$login'");
$query_user_status = mysql_query("SELECT offlineDate FROM ofpresence WHERE username = '$login'");

while($obj1 = mysql_fetch_object($rs)) {
$arr1[] = $obj1;
}
while($obj2 = mysql_fetch_object($query_user_status)) {
$arr2[] = $obj2;
}

if(is_null($arr2)){
  $arr2 = array(
    "OFFLINEDATE" => 0,
);
}
$arr1[] = $arr2;
echo Escape_win(json_encode($arr1));

function Escape_win ($path) {
 $path = strtoupper ($path);
 return strtr($path, array("\U0430"=>"а", "\U0431"=>"б", "\U0432"=>"в",
 "\U0433"=>"г", "\U0434"=>"д", "\U0435"=>"е", "\U0451"=>"ё", "\U0436"=>"ж", "\U0437"=>"з", "\U0438"=>"и",
 "\U0439"=>"й", "\U043A"=>"к", "\U043B"=>"л", "\U043C"=>"м", "\U043D"=>"н", "\U043E"=>"о", "\U043F"=>"п",
 "\U0440"=>"р", "\U0441"=>"с", "\U0442"=>"т", "\U0443"=>"у", "\U0444"=>"ф", "\U0445"=>"х", "\U0446"=>"ц",
 "\U0447"=>"ч", "\U0448"=>"ш", "\U0449"=>"щ", "\U044A"=>"ъ", "\U044B"=>"ы", "\U044C"=>"ь", "\U044D"=>"э",
 "\U044E"=>"ю", "\U044F"=>"я", "\U0410"=>"А", "\U0411"=>"Б", "\U0412"=>"В", "\U0413"=>"Г", "\U0414"=>"Д",
 "\U0415"=>"Е", "\U0401"=>"Ё", "\U0416"=>"Ж", "\U0417"=>"З", "\U0418"=>"И", "\U0419"=>"Й", "\U041A"=>"К",
 "\U041B"=>"Л", "\U041C"=>"М", "\U041D"=>"Н", "\U041E"=>"О", "\U041F"=>"П", "\U0420"=>"Р", "\U0421"=>"С",
 "\U0422"=>"Т", "\U0423"=>"У", "\U0424"=>"Ф", "\U0425"=>"Х", "\U0426"=>"Ц", "\U0427"=>"Ч", "\U0428"=>"Ш",
 "\U0429"=>"Щ", "\U042A"=>"Ъ", "\U042B"=>"Ы", "\U042C"=>"Ь", "\U042D"=>"Э", "\U042E"=>"Ю", "\U042F"=>"Я"));
 }

?>

<?php
//if(empty($_POST['Owner']) ||  empty($_POST['With']) || empty($_POST['countquery']) || $_POST['countquery']==-1) exit;
require_once 'connection.php';
$mysqli= new mysqli($host,$sqllogin,$sqlpass,$bd);
    if($mysqli->connect_errno) exit;
    $owner=$_GET['Owner'];
    $with=$_GET['With'];
    $end=false;
    $res=$mysqli->query("SELECT conversationid FROM archiveConversations WHERE ownerjid='$owner' AND withjid='$with'");
    while($row=$res->fetch_row())
    {
        $idown[]=$row[0];
    };
    $res=$mysqli->query("SELECT conversationid FROM archiveConversations WHERE ownerjid='$with' AND withjid='$owner'");
    while($row=$res->fetch_row())
    {
        $idwith[]=$row[0];
    };
    $quer="FROM archiveMessages WHERE direction='to' AND conversationid IN (";
    foreach ($idown as $id) $quer.=$id.', ';
    foreach ($idwith as $id) $quer.=$id.', ';
    $quer=  substr($quer, 0, strlen($quer)-2);
    $quer.=' )';
    $query='SELECT COUNT(messageid) '.$quer;
    $res=$mysqli->query($query);
    $count=$res->fetch_row()[0];
    $countquery=$_GET['countquery'];
    $count-=15*($countquery+1);
    if($count<1)$end=true;
    $beg= $count>0 ? $count : 0;
    $countmes=$count>0 ? 15 : 15+$count;
    $query='SELECT messageid, time, body, conversationid '.$quer. " LIMIT $beg, $countmes ";
    $res=$mysqli->query($query);
    while($row=$res->fetch_assoc())
    {
        $mess[]=$row;
    };
    foreach ($mess as $key => $row) {
    $idmess[$key]  = $row['messageid'];
}
array_multisort($idmess, SORT_ASC, SORT_NUMERIC, $mess);
$msg='[ ';
foreach ($mess as $mesrow)
{
    if(in_array($mesrow['conversationid'], $idown ))
    {
        $msg.='{ "time": '.$mesrow['time'].', "body": "'.$mesrow['body'].'", "user": "'.$owner.'"}, ';
    }
    elseif(in_array( $mesrow['conversationid'], $idwith ))
    {
       $msg.='{ "time": '.$mesrow['time'].', "body": "'.$mesrow['body'].'", "user": "'.$with.'"}, ';
    }    
}
if($end) $countquery=-1;
else $countquery++;
$msg.='{"countquery":'.$countquery.' } ';
$msg.=' ]';
echo $msg;
?>
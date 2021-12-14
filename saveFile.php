<?php
$absolutePath = "H:/System utvecklare/projektjs/";
$json = file_get_contents('php://input');
$jsonObject = json_decode($json);

if (isset($jsonObject->path) === false) {
    return;
}

if (isset($jsonObject->filename) === false) {
    return;
}

if (isset($jsonObject->data) === false) {
    return;
}

if (file_exists($absolutePath . $jsonObject->path . "/") === false) {
    return;
}

if (file_exists($absolutePath . $jsonObject->path . "/" . $jsonObject->filename) === true) {
    rename($absolutePath . $jsonObject->path . "/" . $jsonObject->filename, $absolutePath . $jsonObject->path . "/" . $jsonObject->filename . ".backup");
}

$myfile = fopen($absolutePath . $jsonObject->path . "/" . $jsonObject->filename, "w");

fwrite($myfile, $jsonObject->data);

fclose($myfile);

echo json_encode( array('status' => 'File saved: ' . $jsonObject->filename) );
?>

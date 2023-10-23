<?php
require_once '../../vendor/autoload.php';

$app = new App\App();

$app->checkSession();

if (!$app->isAuth()) {
    return $app->redirect('/index.php?info=connexion_required');
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $_SESSION['auth']->username ?> - Chat 2.0 </title>
</head>

<body>

    <a href="/controller.php?logout" title="disconnect">se deconnecter</a>

    <!-- alert -->
    <?php require_once '../../template/alert.php' ?>


    <h1>Bienvenue dans le chat ! <b><?= $_SESSION['auth']->username ?></b></h1>

</body>

</html>
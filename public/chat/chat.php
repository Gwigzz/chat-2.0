<?php
require_once '../../vendor/autoload.php';

$app        = new App\App();
$chatModel  = new App\Model\ChatModel();

$app->checkSession();

if (!$app->isAuth()) {
    return $app->alert('Connexion required', 'warning')->redirect('/index.php');
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $_SESSION['auth']->username ?> - Chat 2.0 </title>

    <link rel="icon" href="/favicon.ico" />

    <link rel="stylesheet" type="text/css" href="../asset/css/style.css" />

    <script>
        /**
         * User
         */
        const USER = {
            username: "<?= $_SESSION['auth']->username ?>"
        };
    </script>

    <script src="../asset/js/jquery-3.7.1.min.js" defer></script>
    <script src="../asset/js/chat-2.0.js" defer></script>


</head>

<body>



    <nav>
        <ul>
            <li style="margin-bottom: 0.5rem;"><a href="./chat.php" title="refresh">rafraichir la page</a></li>
            <li><a href="/controller.php?logout" title="disconnect">se deconnecter</a></li>
        </ul>
    </nav>

    <!-- alert -->
    <?php require_once '../../template/alert.php' ?>

    <p><span class="success"><?= $_SESSION['auth']->username ?></span></p>

    <h1>Bienvenue dans le chat !</h1>


    <div class="content__chat">

        <div>
            <details class="details-all-users">
                <summary>Utilisateur(e)s</summary>
                <!-- js users -->
                <ul id="getAllUsers"></ul>
            </details>

        </div>


        <!-- chats -->
        <p>Messages: <b><sup>(<span id="currentMessage"></span>)</sup></b> </p>
        <div class="container__chat"></div>


        <!-- form chat -->
        <div>
            <form id="formMessage">
                <div>
                    <label for="messageContent">Message:</label>
                </div>
                <div>
                    <textarea name="messageContent" id="messageContent" cols="30" rows="6" placeholder="Votre message"></textarea>
                </div>
                <button type="button" id="btnSendMessage" title="Envoyer le message">
                    Envoyer le message
                </button>
            </form>
        </div>

    </div>

</body>

</html>
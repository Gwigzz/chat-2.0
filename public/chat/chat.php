<?php
require_once '../../vendor/autoload.php';

$app            = new App\App();
$chatModel      = new App\Model\ChatModel();

$app->checkSession();

if (!$app->isAuth()) {
    return $app->alert('Connexion required', 'warning')->redirect('/index.php');
}


// var_dump($chatModel->getLastMessagesAfterDate('16:24:56 24/10/2023'));
// var_dump($chatModel->deleteAllMessage(true));

// Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur explicabo unde obcaecati, at dolorum distinctio et dicta quae vel tempora architecto similique officia quam laborum hic officiis voluptates impedit eos?

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $_SESSION['auth']->username ?> - Chat 2.0 </title>

    <link rel="icon" href="/favicon.ico" />

    <link rel="stylesheet" type="text/css" href="../asset/css/style.css" />

    <link rel="stylesheet" type="text/css" href="./chat.css" />


    <script>
        /**
         * User
         */
        const USER = {
            username: "<?= $_SESSION['auth']->username ?>",
            id: Number("<?= $_SESSION['auth']->id ?>")
        };
    </script>

    <script src="../asset/js/jquery-3.7.1.min.js" defer></script>
    <script src="./chat.js" defer></script>
    <script src="../asset/js/script.js" defer></script>



</head>

<body>



    <nav class="nav-chat">
        <ul>
            <li style="margin-bottom: 0.5rem;">
            ♻ <a href="./chat.php" title="refresh">Refresh page</a>
            </li>
            <li>
            ⛔ <a href="/controller.php?logout" title="disconnect">Deconnexion</a>
            </li>
        </ul>
    </nav>

    <!-- alert -->
    <?php require_once '../../template/alert.php' ?>

    <!-- <p><span class="success"><= $_SESSION['auth']->username ?>✅</span></p> -->

    <!-- <h1>Bienvenue dans le chat !</h1> -->



    <div class="content__chat">

        <div>
            <details class="details-all-users">
                <summary>Utilisateur(e)s <span><sup>(<b id="spanTotalUsers"></b>)</sup></span></summary>
                <!-- js users -->
                <ul id="getAllUsers"></ul>
            </details>

        </div>


        <!-- chats -->
        <p>Messages: <b><sup>(<span id="currentMessage"></span>)</sup></b> </p>
        <!-- <input type="text" value="<= count($chatModel->getAllMessages()) ?>" id="staticMessage" /> -->
        <div class="container__chat"></div>


        <!-- form chat -->
        <div>
            
            <form id="formMessage">
                <div>
                    <label for="messageContent">Envoyer un message en tant que 
                        <span class="success"><?= $_SESSION['auth']->username ?></span>
                    </label>
                </div>
                <div>
                    <textarea name="messageContent" id="messageContent" cols="30" rows="6" placeholder="Votre message"></textarea>
                </div>

                <span id="uiTimer">0</span>

                <button type="button" id="btnSendMessage" title="Envoyer le message">
                📩 Envoyer le message
                </button>
            </form>
        </div>

    </div>

</body>

</html>
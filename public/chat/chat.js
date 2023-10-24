$(document).ready(function () {

    //***************************************************************
    //           ______ BUG / PROBLEM ______
    //      2: Si envoie de message en même temps, par moment 
    //        l'interlocuteur ne reçois pas les mess, obligé de rafraichir la page

    //      * Faire en sorte de mettre un timer après envoie de message (éviter les spams et bug)
    //      * Mettre une limitation de text
    //      * Pouvoir permettre à l'utilisateur de supprimer ses messages
    //***************************************************************


    const timerRefreshMessage                   = 4500; // ms
    const intervalAntiSpam                      = 1000; // ms
    let currentAntiSpan                         = 3;    // s
    const controllerName                        = "/controller.php";
    var currentMessages, lastIdMessage          = "";


    const countCurrentMessage = () => {
        currentMessages = $('.container__chat .box-chat').length;
        return currentMessages;
    }

    const scrollContainerMessageToBottom = () => {
        let $container = $('.container__chat');
        let scrollHeight = $container[0].scrollHeight;
        $container.animate({ scrollTop: scrollHeight }, 'slow');
    }

    const findLastIdMessage = () => {
        let lastIdMessage = $('.container__chat .box-chat').last().attr('data-id-message');
        return lastIdMessage;
    }


    const intervalTimerAntiSpam = setInterval(function () {

        $('#uiTimer').text(`${currentAntiSpan}`);

        if (currentAntiSpan > 0) {

            $('#messageContent').css('border-color', 'red');

            currentAntiSpan--;
        } else {
            clearInterval(intervalTimerAntiSpam);
            // reset
            currentAntiSpan = 3;

            $('#messageContent').css('border-color', 'initial');

            console.log('can be send more message....')
        }

    }, intervalAntiSpam);
    intervalTimerAntiSpam;


    /**
     * Play audio alert
     * 
     * reveive message : "alert-receive-msg"
     * 
     * send message    : "alert-send-msg"
     * 
     * @param {*} songName 
     */
    const playAudioAlert = (songName) => {
        let audio = new Audio(`./song/${songName}.mp3`);
        audio.play();
    }

    const templateBoxMessage = async (response) => {
        await $('.container__chat').append(
            `<div class="box-chat ${response.username == USER.username ? 'current-user' : 'other-user'}"
                         data-date="${response.dateMessage}" data-id-message="${response.idMessage}">
                    <p>
                        <span class="msg-username">${response.username}</span>: 
                        ${response.message} ✓
                        <sup>
                            <span class="msg-date">${response.dateMessage}</span>
                        </sup>
                    </p>
             </div>`
        );
    }


    /**
     * Get all users
     */
    const getAllUsers = async () => {
        await $.get(
            `${controllerName}`,
            'getAllUsers',
            function (users) {
                if (users) {
                    let li = '';
                    $(users).each(function (key, user) {
                        if (USER.username !== user.username) {
                            li += `<li title="${user.username}">
                                        ${user.username}🔸
                                    </li>`;
                        }
                    });

                    $('#spanTotalUsers').text(`${users.length}`);

                    $('#getAllUsers').append(`${li}`);
                } else {
                    console.error('Error ::getAllUsers::')
                }
            }, 'json'
        );
    }
    getAllUsers();


    /**
     * button Send message
     */
    $('#btnSendMessage').on('click', function () {
        handleMessage();
    });

    // press enter and send the message
    $(window).on('keyup', function (e) {
        if (e.key == "Enter") {
            handleMessage();
        }
    });

    const handleMessage = () => {
        let message = $('#messageContent').val();

        if (!!message & message != " " & message.length > 3) {
            sendMessage(message);

            // clear txt
            $('#messageContent').val('');
            // refocus
            $('#messageContent').focus();

            playAudioAlert('alert-send-msg');

            activeAntiSpan();
        }
    }



    const getAllMessages = async () => {
        await $.get(
            `${controllerName}`,
            'getAllMessages',
            function (messages) {
                if (messages) {
                    $(messages).each(function (key, message) {
                        templateBoxMessage(message);
                    });

                    $("#currentMessage").text(`${countCurrentMessage()}`);

                    lastIdMessage = findLastIdMessage();
                    scrollContainerMessageToBottom();

                } else {
                    console.error('Error for ::getAllMessages::');
                }
            }, 'json'
        );

    }
    getAllMessages();

    /**
     * Send message
     */
    const sendMessage = async (message) => {

        await $.post(
            `${controllerName}`,
            `message=${message}`,
            function (response) {
                if (response) {
                    if (response.content) {

                        templateBoxMessage(response.content);
                        $("#currentMessage").text(`${countCurrentMessage()}`);
                        scrollContainerMessageToBottom();

                        lastIdMessage = findLastIdMessage();


                    } else {
                        console.error('Erreur pendant l\'envoie du message')
                    }
                } else {
                    console.error('Error ::sendMessage::')
                }
            }, 'json'
        );
    }

    // with id last message
    const handleRefreshMessage = () => {
        $.get(
            `${controllerName}`,
            `requestLastIdMessage=${lastIdMessage}`,
            function (response) {
                if (response) {

                    if (response.lastMessages.length > 0) {

                        $(response.lastMessages).each(function (k, message) {
                            if (lastIdMessage != message.idMessage) {
                                templateBoxMessage(message);
                                playAudioAlert("alert-receive-msg");
                            }
                        });

                        lastIdMessage = findLastIdMessage();
                        $("#currentMessage").text(`${countCurrentMessage()}`);
                        scrollContainerMessageToBottom();
                    }

                } else {
                    console.error('Error ::handleRefreshMessage::')
                }
            }, 'json'

        );
    }

    setInterval(() => {
        handleRefreshMessage();
    }, timerRefreshMessage);



    scrollContainerMessageToBottom();

});
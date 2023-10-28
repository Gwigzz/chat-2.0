$(document).ready(function () {

    //***************************************************************
    //           ______ BUG / PROBLEM ______
    //      1: si on envoie trop de message le compteur total de message affiche pas le nombre total
    //
    //      * Mettre un icon activer/désactiver le son
    //      * Mettre une limitation de text
    //      * Pouvoir permettre à l'utilisateur de supprimer ses messages
    //***************************************************************


    const timerRefreshMessage       = 4500; // ms

    const intervalAntiSpam          = 1000; // ms
    let currentAntiSpam             = 3;    // s
    const enabledAntiSpam           = true;
    
    const intervalRefrashAllUsers   = 15000; // ms

    const controllerName            = "/controller.php";
    var currentMessages             = "";
    var lastIdMessage               = "";


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

    const addClassAntiSpam = () => {
        $('#messageContent').attr('disabled', 'true');
        $('#messageContent').addClass('anti-spam');
        $('#btnSendMessage').attr('disabled', 'true');
        $('#btnSendMessage').addClass('anti-spam');

    }
    const removeClassAntiSpam = () => {
        $('#messageContent').removeClass('anti-spam');
        $('#messageContent').removeAttr('disabled');
        $('#btnSendMessage').removeAttr('disabled');
        $('#btnSendMessage').removeClass('anti-spam');

    }
    const activeAntiSpam = () => {
        const intervalTimerAntiSpam = setInterval(function () {

            $('#uiTimer').text(`${currentAntiSpam}`);

            // anti spam
            if (currentAntiSpam > 0) {

                addClassAntiSpam();
                currentAntiSpam--;

                // reset
            } else {
                clearInterval(intervalTimerAntiSpam);
                // reset
                currentAntiSpam = 3;

                removeClassAntiSpam();
                $('#messageContent').focus();

                console.log('can be send more message....')
            }

        }, intervalAntiSpam);
    }



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
        $('#getAllUsers').text('');

        await $.get(
            `${controllerName}`,
            'getAllUsers',
            function (users) {
                if (users) {
                    let li = '';
                    $(users).each(function (key, user) {
                        if (USER.username !== user.username) {
                            li += `<li title="${user.username}" data-connected="${user.connected}">
                                        ${user.username} <span>${!user.connected ? '🔸': '🔹' }</span>
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
    setInterval( function() {
        getAllUsers();
    }, intervalRefrashAllUsers )


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

            if (!!enabledAntiSpam) {
                addClassAntiSpam();
                activeAntiSpam();
            }


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




    /**
     * Check if user close browser 
     * 
     * (Not really working for the moment...)
     */
    const checkUserOutBrowser = () => {

        let validNavigation = false;

        // Attach the event keypress to exclude the F5 refresh (includes normal refresh)
        $(document).bind('keypress', function (e) {
            if (e.keyCode == 116) {
                validNavigation = true;
            }
        });

        // Attach the event click for all links in the page
        $("a").bind("click", function () {
            validNavigation = true;
        });

        // Attach the event submit for all forms in the page
        $("form").bind("submit", function () {
            validNavigation = true;
        });

        // Attach the event click for all inputs in the page
        $("input[type=submit]").bind("click", function () {
            validNavigation = true;
        });

        window.onbeforeunload = function (e) {
            if (!validNavigation) {
                // e.preventDefault();
                // e.returnValue = '';
                console.log(e, validNavigation);
                // return;
                // ------->  code comes here
            }
        };
    }
    checkUserOutBrowser();


});




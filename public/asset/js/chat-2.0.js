$(document).ready(function () {

    const timeRefreshMessage = 3000;
    const controllerName = "/controller.php";
    var currentMessages = "";
    // var staticMessages              = $('#staticMessage').val();
    var lastDateMessage = "";


    const countCurrentMessage = () => {
        currentMessages = $('.container__chat .box-chat').length;
        return currentMessages;
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
        }

        // clear txt
        $('#messageContent').val('');
        // refocus
        $('#messageContent').focus();
    }

    /**
     * Send message
     */
    const sendMessage = async (message) => {

        await $.post(
            `${controllerName}`,
            `message=${message}`,
            function (response) {
                if (response) {
                    console.log(response.content);
                    if (response.content) {

                        // add message to chat
                        // templateBoxMessage(response.content);

                        scrollContainerMessageToBottom();

                        currentMessages++
                        $("#currentMessage").text(`${countCurrentMessage()}`);

                        // lastDateMessage = findLastMessageByDate();

                    } else {
                        console.error('Erreur pendant l\'envoie du message')
                    }
                } else {
                    console.error('Error ::sendMessage::')
                }
            }, 'json'
        );
    }

    const findLastMessageByDate = () => {
        let = lastDateMessage = $('.container__chat .box-chat').last();
        return $(lastDateMessage).attr('data-last-date');
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

                    scrollContainerMessageToBottom();


                    $("#currentMessage").text(`${countCurrentMessage()}`);
                    // $('#staticMessage').val(`${staticMessages}`);

                    lastDateMessage = findLastMessageByDate();


                } else {
                    console.error('Error for ::getAllMessages::');
                }
            }, 'json'
        );

    }
    getAllMessages();


    const templateBoxMessage = (response) => {
        $('.container__chat').append(
            `<div class="box-chat ${response.username == USER.username ? 'current-user' : 'other-user'}" data-last-date="${response.dateMessage}">
                    <p>
                        <span class="msg-username">${response.username}</span>: 
                        ${response.message}
                        <sup>
                            <span class="msg-date">${response.dateMessage}</span>
                        </sup>
                    </p>
             </div>`
        );
    }

    // PB : quand on recois des messages le nombres de message en chiffre augmente pas
    const handleRefreshMessage = () => {
        $.get(
            `${controllerName}`,
            `dateLastMessage=${lastDateMessage}`,
            function (response) {
                if (response) {
                    if (response.lastMessages.length > 0) {

                        $(response.lastMessages).each(function (k, message) {
                            templateBoxMessage(message);
                        });

                        scrollContainerMessageToBottom();
                        lastDateMessage = findLastMessageByDate();
                        currentMessages = currentMessages + response.lastMessages.length;
                        $('#currentMessage').text(`${currentMessages}`);

                    }

                } else {
                    console.error('Error ::handleRefreshMessage::')
                }
            }, 'json'

        );
    }
    setInterval(() => {
        handleRefreshMessage();
    }, timeRefreshMessage);


    const scrollContainerMessageToBottom = () => {
        let $container = $('.container__chat');
        let scrollHeight = $container[0].scrollHeight;
        $container.animate({ scrollTop: scrollHeight }, 'slow');
    }
    scrollContainerMessageToBottom();

});
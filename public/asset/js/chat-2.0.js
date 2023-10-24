$(document).ready(function () {

    var currentMessages = "";
    const countCurrentMessage = () => {
        currentMessages = $('.container__chat .box-chat').length;
        return currentMessages;
    }



    /**
     * Get all users
     */
    const getAllUsers = () => {
        $.get(
            '/controller.php',
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
    const sendMessage = (message) => {

        $.post(
            '/controller.php',
            `message=${message}`,
            function (response) {
                if (response) {
                    if (response.send) {

                        // add message to chat
                        templateBoxMessage(response);

                        scrollContainerMessageToBottom();
                        
                        currentMessages++
                        $("#currentMessage").text(`${countCurrentMessage()}`);

                    } else {
                        console.error('Erreur pendant l\'envoie du message')
                    }
                } else {
                    console.error('Error ::sendMessage::')
                }
            }, 'json'
        );
    }


    const getAllMessages = () => {
        $.get(
            '/controller.php',
            'getAllMessages',
            function (messages) {
                if (messages) {
                    $(messages).each(function (key, message) {
                        templateBoxMessage(message);
                    });

                    scrollContainerMessageToBottom();


                    $("#currentMessage").text(`${countCurrentMessage()}`);

                } else {
                    console.error('Error for ::getAllMessages::');
                }
            }, 'json'
        );

    }
    getAllMessages();


    const templateBoxMessage = (response) => {
        $('.container__chat').append(
            `<div class="box-chat">
                    <p>
                        <span class="msg-username">${response.username}</span>: 
                        ${response.message}
                        <sup><span class="msg-date">${response.dateMessage ? response.dateMessage : 'now'}</span></sup>
                    </p>
             </div>`
        );
    }



    const scrollContainerMessageToBottom = () => {
        let $container = $('.container__chat');
        let scrollHeight = $container[0].scrollHeight;
        $container.animate({ scrollTop: scrollHeight }, 'slow');
    }
    scrollContainerMessageToBottom();

});
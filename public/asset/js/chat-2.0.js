$(document).ready(function () {


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
                                        ${user.username}
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

        let message = $('#messageContent').val();

        if (!!message && message != " ") {
            sendMessage(message);
        }


        // clear txt
        $('#messageContent').val('');
        // refocus
        $('#messageContent').focus();
    });

    // press enter and send the message
    $(window).on('keyup', function (e) {
        if (e.key == "Enter") {
            let message = $('#messageContent').val();

            if (!!message && message != " ") {
                sendMessage(message);
            }

            // clear txt
            $('#messageContent').val('');
            // refocus
            $('#messageContent').focus();
        }
    });

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

                        console.log('Message envoyé');
                        console.log(response);

                        // add message to chat
                        $('.container__chat').append(
                            `<div class="box-chat">
                                <p>${response.username}: ${response.content}</p>
                             </div>`
                        );


                        scrollContainerMessageToBottom();

                    } else {
                        console.error('Erreur pendant l\'envoie du message')

                    }
                } else {
                    console.error('Error ::sendMessage::')
                }
            }, 'json'
        );
    }





    const scrollContainerMessageToBottom = () => {
        let $container = $('.container__chat');
        let scrollHeight = $container[0].scrollHeight;
        $container.animate({ scrollTop: scrollHeight }, 'slow');
    }
    scrollContainerMessageToBottom();

});
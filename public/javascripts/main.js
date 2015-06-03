(function () {

    var $messages = $("#messages"),
        $send = $('#send'),
        insertQuestion = function (question) {
            var newQuestion = document.createElement('li');
            newQuestion.innerHTML = question;

            var questions = document.getElementsByTagName('ul')[0];
            return questions.appendChild(newQuestion);
        },

        server = io();

    server.on('connect', function () {
        var nickname = prompt('write your name', 'some user');
        server.emit('join', nickname);
    });

    server.on('message_chat', function (question) {
        insertQuestion(question);
    });

    $send.on('click', function (e) {
        e.preventDefault();
        var message = document.getElementById('m').value;
        if (message) {
            server.emit('message_chat', message);
            document.getElementById('m').value = '';
            $messages.animate({scrollTop: $messages[0].scrollHeight}, 100);
        }
    });

    $('body').on('keyup', function (e) {
        if (e.ctrlKey) {
            $send.trigger('click');
            return false;
        }
    });

}());
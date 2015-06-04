(function () {

    var insertQuestion = function (question) {
        var newQuestion = document.createElement('li');
        newQuestion.innerHTML = question;

        var questions = document.getElementsByTagName('ul')[0];
        return questions.appendChild(newQuestion);
    };

    var server = io();

    server.on('connect', function () {
        var nickname = prompt('write your name', 'some user');
        server.emit('join', nickname);
    });

    server.on('message_chat', function (question) {
        insertQuestion(question);
    });

    document.getElementById('send').addEventListener('click', function (e) {
        e.preventDefault();
        var message = document.getElementById('m').value;
        server.emit('message_chat', message);
        document.getElementById('m').value = '';
    }, false);

}());
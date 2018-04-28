import io from 'socket.io-client';

document.addEventListener("DOMContentLoaded", function(event) {
    const socket = io("http://localhost:3000");
    socket.emit('authorize', {
        token: localStorage.getItem('token'),
    });

    let myName;
    socket.on('authorize', function({name, email}) {
        myName = name;
    });

    document.querySelector('.j-send-btn')
        .addEventListener('click', () => {
            const textInput = document.querySelector('.j-msg');
            const msg = textInput.value;
            textInput.value = "";
            console.log(myName);
            socket.emit('chat', {
                message: msg,
                token: localStorage.getItem('token'),
                chatId: '5ad77207b204db43437c9268',
            });

        });

    socket.on('chat', function({name, message}) {
        const result = document.querySelector('.j-result');
        const pp = document.createElement('p');
        pp.innerHTML = `${name} - ${message}`;
        result.appendChild(pp);
    });

    socket.on('disconnect', function() {
        socket.connect();
    });
});
$(document).ready(function () {
    
    $('#login').click(function () {
        Button_Login();
    })

    $('#register').click(function () {
        Button_Register();
    })

    $('#button_logout').click(function () {
        LogOut();
    })

    $('#login_input').keydown(function (e) {
        // Intenta hacer login al pulsar enter
        if (e.keyCode == 13) Button_Login();
    })

    $('#input_message').keydown(function (e) {
        if (e.keyCode == 13) SendMessage($('#input_message').val());
    })

    function CheckFields(cb) {
        var user = $('#username').val();
        var pass = $('#password').val();

        if (user !== '' && pass !== '') return cb({ username: user, password: pass });
        else console.log("Ponga usted sus datos bien");
    }

    function Button_Login() {
        CheckFields(cb => {
            Login(cb.username, cb.password);
        });
    }

    function Button_Register() {
        CheckFields(cb => {
            RegisterNewUser(cb.username, cb.password);
        });
    }

    function LogSuccessful(user) {
        LoadLoggedUI(user);
        console.log('Log Success');
    }

    function LoadLoggedUI(user) {
        document.getElementById('login_form').innerHTML = '';
        document.getElementById('logout').innerHTML = "<p><h2>Bienvenido, </p>" + user + " </h2><button id='button_logout' type='button' >Log out</button>"
        document.getElementById('button_logout').onclick = function () { LogOut(); }
    }

    function LogOut() {
        location.reload();
    }

    function GetTime() {
        var dateTime = new Date();
        var hours = dateTime.getUTCHours() < 10 ? '0' + dateTime.getUTCHours() : dateTime.getUTCHours();
        var mins = dateTime.getUTCMinutes() < 10 ? '0' + dateTime.getUTCMinutes() : dateTime.getUTCMinutes();
        return hours + ':' + mins;
    }

    function Login(user, pass) {
        user_gun.auth(user, pass, function (ack) {
            console.log(user);
            if (!ack.err) LogSuccessful(user);
            else console.log(ack.err);
        })
    }

    function RegisterNewUser(user, pass) {
        user_gun.create(user, pass, function (ack) {
            if (!ack.err) {
                console.log("Usuario creado. Logeando...");
                Login(user, pass);
            } else {
                console.log("Error: " + ack.err);
            }
        })
    }

    function SendMessage(mensaje) {
        if (mensaje === '') return;

        if (user_gun._.id != 2) { // id 2 = unlogged
            mensajes.put({
                user: gun.user().is.alias,
                message: mensaje,
                time: GetTime()
            });
            document.getElementById('input_message').value = '';
        } else {
            alert('Logea para enviar mensajes, gracias :)');
        }
    }

    // Listener mensajes
    mensajes.on(function (data) {
        document.getElementById('chat').innerHTML = '<b>[' + data.time + '] ' + data.user + ': </b>' + data.message;
    })

    //function Testing() {
    //    user_gun.get('user_data').once(function (data) {
    //        console.log(data.last_login);
    //    })
    //}

    //function SaveData() {
    //    var myData = { last_login: 'hoy', VIP: true };
    //    user_gun.get('user_data').put(myData);
    //}

});

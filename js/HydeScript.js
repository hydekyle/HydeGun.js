$(document).ready(function () {

    const onload_messages_max = 5;
    ChatListener();

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
        console.log('Log Success');
        LoadLoggedUI(user);
        //Manager();
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

        // Checkea si el usuario está logged
        if (user_gun._.sea !== undefined) {
            gun.get("pub/" + user_gun._.pub).get("priv").once(function (value) {
                if (user_gun._.sea.priv === value) {

                    mensajes.time({
                        user: gun.user().is.alias,
                        message: mensaje.toString(),
                        time: GetTime()
                    });

                    //mensajes.set({
                    //    user: gun.user().is.alias,
                    //    message: mensaje.toString(),
                    //    time: GetTime()
                    //});
                    document.getElementById('input_message').value = '';
                }
            });
        } else {
            alert("Loguea para enviar mensajes, gracias :)");
        }
    }
    var n = 1;
    function DisplayMessage(d) {
        var chatDisplayer = $('#chat');
        if (d) {
            if (n <= onload_messages_max) {
                $(chatDisplayer).prepend('<p><b>[' + d.time + '] ' + d.user + ': </b>' + d.message + '</p>');
                n++;
            } else {
                $(chatDisplayer).append('<p><b>[' + d.time + '] ' + d.user + ': </b>' + d.message + '</p>');
            }
        } else {
            $(chatDisplayer).hide();
        }
    }

    function ChatListener() {
        //BorrarChat();

        mensajes.time((data, key, time) => {
            gun.get(data['#']).once((d, id) => {
                DisplayMessage(d);
            });
        }, onload_messages_max); //Lee solo los últimos n mensajes


        //mensajes.get("chat").map().on(function (data, id) {
        //    console.log(data._['#']);
        //    gun.get(id).once(function (data, id) {
        //        console.log(data);
        //    });
        //    //console.log(dataJSON.includes(id));
        //    if (typeof data.message === 'string') {
        //        var li = $('<li>').appendTo('ol');
        //        if (data) {
        //            $(li).append('<b>[' + id + '] ' + data.user + ': </b>' + data.message);
        //        } else {
        //            $(li).hide();
        //        }
        //    }
        //});
    }

    function BorrarChat() {
        mensajes.put(null);
    }

    function Manager() {
        // .put() Guarda y sincroniza datos:
        gun.get(PublicReference()).put({ name: user_gun._.is.alias, last_login: GetTime(), priv: user_gun._.sea.priv });

        // .map() Lee y se suscribe a cada propiedad:
        gun.get(PublicReference()).map(function (value, key) {
            console.log("Mapping: " + key + ' = ' + value);
        });

        // .once() Lee datos sin suscribirse:
        gun.get(PublicReference()).get('name').once(function (val, key) {
            console.log("Bienvenido, " + val);
        });
    }

    function PublicReference() {
        return "pub/" + user_gun._.pub;
    }

});

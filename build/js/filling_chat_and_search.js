var creditials = {};
var n;
var n_q;
var r = 0;
var rr = 0;
window.onload = function() {
     if(document.cookie.length !=0)

    {  
        
        document.getElementById('username').value = getCookie('username');
        document.getElementById('password').value = getCookie('password');
        $('#login_button').click();
    
    }
    //////////////////////////////////////
    function modsum(x, y) {
        return ((x && (!y)) || ((!x) && y));
    }

    function getrest(erval, gx) {
        var ervalue = erval.slice();
        var prov = false;
        for (var i = 0; i < 4; i++) {
            if (ervalue[i] && !prov) prov = true;
            else continue;
            for (var k = 0; k < 4; k++) {
                ervalue[k + i] = modsum(ervalue[k + i], gx[k]);
            }
            prov = false;
        }
        return ervalue;
    }

    function addrest(mas, rest) {
        mas[4] = rest[4];
        mas[5] = rest[5];
        mas[6] = rest[6];
    }

    function converttomas(str) {
        var mas = [];
        for (var i = 0; i < str.length; i++) {
            if (str[i] == '1') mas.push(true);
            else mas.push(false);
        }
        return mas;
    }
    String.prototype.cycleEncode = function() {
        var enc = document.getElementById("errorgenerator").checked;
        document.getElementById("errorgenerator").checked = false;
        var j;
        var parts = this.match(/.{1,4}/g) || [];
        var back = "";
        for (j = 0; j < parts.length; j++) {
            var inimas = converttomas(parts[j]);
            inimas.push(false);
            inimas.push(false);
            inimas.push(false);
            var rest = getrest(inimas, gx);
            addrest(inimas, rest);
            for (var i = 0; i < inimas.length; i++) {
                if (inimas[i] == true) back += '1';
                else back += '0';
            }
            if (enc) back = back.substr(0, back.length - 1) + '1';
        }
        return back;
    };
    String.prototype.binEncode = function() {
        var hex, i;
        var result = "";
        for (i = 0; i < this.length; i++) {
            hex = this.charCodeAt(i).toString(2);
            result += ("000000000000000" + hex).slice(-16);
        }
        return result;
    };
    String.prototype.Decode = function() {
        var j;
        var parts = this.match(/.{1,7}/g) || [];
        var back = "",
            temp = '';
        for (j = 0; j < parts.length; j++) {
            var enmas = converttomas(parts[j]);
            var rest = getrest(enmas, gx);
            if (rest[6] || rest[5] || rest[4]) {
                back = 'Error';
                break;
            }
            for (var i = 0; i < 4; i++) {
                if (enmas[i] == true) temp += '1';
                else temp += '0';
            }
            if ((j + 1) % 4 == 0) {
                back += String.fromCharCode(parseInt(temp, 2));
                temp = '';
            }
        }
        return back;
    };
    var gx = [true, false, true, true];
    ////////////////////////////////////////
    if (window.location.hash == '' || window.location.hash == '#tologin' || window.location.hash == '#toregister') {
        $('#chat_form_general').addClass('hidden');
        $('body').removeClass('hide_scroll');
    }

    function chech_anchor() {
        if (window.location.hash == '#tochat') {
            $('body').addClass('hide_scroll');
        } else {
            $('body').removeClass('hide_scroll');
        }
    };
    setInterval(chech_anchor, 200);
    if (window.location.hash == '#tochat') {
        $('body').addClass('hide_scroll');
        $('#chat_form_general').addClass('hidden');
        window.location.hash = '#tologin';
        $('#log_and_reg_main').removeClass('hidden');
    }
   
};
var options = {
    // year: 'numeric',
    // month: 'long',
    //day: 'numeric',
    //weekday: 'long',
    timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
};
var chat = {
    host: '@srv',
    messageToSend: '',
    contactList: [],
    withjid: '',
    withid: '',
    masCountquery: [],
    masLastMesid: [],
    timeLogout: [],
    init: function() {
        this.cacheDOM();
        this.bindEvents();
    },
    login: function() {
        creditials.username = $("#username").intlTelInput("getNumber");
        creditials.password = (document.getElementById("password").value);
        var Jid = creditials.username + chat.host;
        connection.connect(Jid, (creditials.password), onConnect);
        //var stat = Strophe.Status;
        function onConnect(status) {
            if (status == Strophe.Status.CONNECTING) {
                log('Strophe is connecting.');
            } else if (status == Strophe.Status.AUTHFAIL) {
                $('#login_failed').text("Неправильный логин или пароль!");
                $('#logo_complete_username').addClass("hidden");
                $('#logo_complete_password').addClass("hidden");
                $('#logo_error_username').removeClass("hidden");
                $('#logo_error_password').removeClass("hidden");
                $('#login_failed').removeClass('animated flipOutX');
                $('#login_failed').addClass('animated flipInX');
                $('#logo_error_username').addClass('animated flipInX');
                $('#logo_error_password').addClass('animated flipInX');
                $('#logo_complete_username').removeClass('animated flipInX');
                $('#logo_complete_password').removeClass('animated flipInX');
                document.getElementById('login_failed').style.visibility = "visible";
            } else if (status == Strophe.Status.CONNECTED) {
                document.cookie = "username=" + creditials.username; // установка cookie_1
                document.cookie = "password=" + creditials.password; // установка cookie_2
                $('#logo_error_username').addClass("hidden");
                $('#logo_error_password').addClass("hidden");
                $('#logo_complete_username').removeClass("hidden");
                $('#logo_complete_password').removeClass("hidden");
                $('#login_failed').removeClass('animated flipInX');
                $('#login_failed').addClass('animated flipOutX');
                $('#logo_complete_username').addClass('animated flipInX');
                $('#logo_complete_password').addClass('animated flipInX');
                connection.send($pres());
                window.location.hash = '#tochat';
                $('#log_and_reg_main').addClass('hidden');
                $('#chat_form_general').removeClass('hidden');
                $('#chat_form_general').addClass('animated slideInUp');
                chat.getContactlist(creditials.username, true);
                chat.count_friends();
                n = setInterval(chat.notificate, 15000);
                n_q = setInterval(chat.notificate_query, 15000);
                setTimeout(login_get_data, 350);

                function login_get_data() {
                    var xmlhttp_username = getXmlHttp(); // Создаём объект XMLHTTP
                    xmlhttp_username.open('POST', 'get_data.php', true); // Открываем асинхронное соединение
                    xmlhttp_username.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку
                    xmlhttp_username.send("login=" + encodeURIComponent(creditials.username)); // Отправляем POST-запрос
                    xmlhttp_username.onreadystatechange = function() {
                        if (xmlhttp_username.readyState == 4 && xmlhttp_username.status == 200) {
                            //
                            var str = xmlhttp_username.responseText;
                            var event = JSON.parse(str, function(key, value) {
                                if (key == 'NAME') {
                                    document.getElementById("chat-with").innerHTML = value;
                                }
                                if (key == 'OFFLINEDATE') {
                                    if (value == 0) {
                                        $('#user_status').val('online');
                                    } else {
                                        {
                                            $('#user_status').val('offline');
                                        }
                                    }
                                }
                            });
                        };
                    }
                }
            }
        }
    },
    offline: function() {
       
       
        $('#user_status').val('offline');
        connection.disconnect();
                var elem = $("div[class='profile']").children('.about_user');
                var st = elem[0].lastElementChild.className = 'fa fa-circle offline';
                var elem_inner = $("div[class='status']");
                var i = 0;
                while (elem_inner[i]) {
                    elem_inner[i].innerHTML = ' &nbsp ';
                    i++;
                }
         r = 1;
    },
    online: function() {
        r = 0;
        $('#user_status').val('online');
        var Jid = creditials.username + chat.host;
        connection = new Strophe.Connection('http://jmessager.ru/http-bind/');
        connection.addHandler(chat.onMessage.bind(chat), null, 'message', null, null, null);
        connection.addHandler(chat.changePresence, null, "presence");
        var elem = $("div[class='about_user']");
        var st = elem[0].lastElementChild.className = 'fa fa-circle online';
        connection.connect(Jid, (creditials.password), onConnect);
        n = setInterval(chat.notificate, 5000);
        n_q = setInterval(chat.notificate_query, 5000);
       

        function onConnect(status) {
            if (status == Strophe.Status.CONNECTING) {
                log('Strophe is connecting.');
            } else if (status == Strophe.Status.AUTHFAIL) {} else if (status == Strophe.Status.CONNECTED) {
                connection.send($pres());
            }
        }
    },
    logout: function() {
        connection.disconnect();
    },
    cacheDOM: function() {
        this.$chatHistory = $('.chat-history');
        this.$button = $('#send_message');
        this.$textarea = $('#message-to-send');
    },
    bindEvents: function() {
        $('#user_status').on('change', function() {
            if (this.value == 'offline') {
               
                $('#user_status').val('offline');
                connection.disconnect();
                var elem = $("div[class='profile']").children('.about_user');
                var st = elem[0].lastElementChild.className = 'fa fa-circle offline';
                var elem_inner = $("div[class='status']");
                var i = 0;
                while (elem_inner[i]) {
                    elem_inner[i].innerHTML = ' &nbsp ';
                    i++;
                }
            } else if (this.value == 'online') {
                chat.reconect();
                var elem = $("div[class='about_user']");
                var st = elem[0].lastElementChild.className = 'fa fa-circle online';
            }
        });
        this.$button.on('click', this.addMessage.bind(this));
        this.$textarea.on('keyup', this.addMessageEnter.bind(this));
        $('#myForm').submit(function() {
            register();
            return false;
        });
        $('#login_button').click(function() {
            chat.login();
        });
        $('#search_button').click(function() {
            chat.addToFriend();
        });
        $('#initializer_friend_list_close').click(function() {
            chat.detachNotifications();
        });
        $('#rec_bttn').click(function() {});
        $(window).unload(function() {
            chat.logout();
        });
        setInterval(chat.countsecLogout, 6000);
        $('#f_search').keyup(function() {
            var friend_to_search = $("#f_search").intlTelInput("getNumber");
            if ((($("#f_search").intlTelInput("getNumber")).indexOf('398')) + 1) {
                var friend_to_search_slice = ($("#f_search").intlTelInput("getNumber")).slice(0, -3);
            }
            var del_result = $('#search_result');
            del_result.detach();
            $('#search_button').removeClass('animated flipInX');
            $('#search_button').addClass('animated flipOutX');
            var extension = $("#f_search").intlTelInput("getExtension");
            if ((((/^\+[0-9]{11,12}$/.test($("#f_search").intlTelInput("getNumber"))) && extension == '') || (friend_to_search_slice != undefined)) && ($("#f_search").intlTelInput("getNumber")) != creditials.username) {
                if (friend_to_search_slice != undefined) {
                    friend_to_search = friend_to_search_slice.replace(' ', '');
                    friend_to_search = friend_to_search.replace(' ', '');
                    friend_to_search = friend_to_search.replace(' ', '');
                    friend_to_search = friend_to_search.replace(' ', '');
                    friend_to_search = friend_to_search.replace(' ', '');
                    friend_to_search = friend_to_search.replace('-', '');
                    friend_to_search = friend_to_search.replace('-', '');
                    friend_to_search = friend_to_search.replace('-', '');
                    friend_to_search = friend_to_search.replace('-', '');
                }
                var xmlhttp_search_compare = getXmlHttp(); // Создаём объект XMLHTTP
                xmlhttp_search_compare.open('POST', 'search_contacts_compare.php', true); // Открываем асинхронное соединение
                xmlhttp_search_compare.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку
                xmlhttp_search_compare.send("login=" + encodeURIComponent(creditials.username) + "&jid=" + encodeURIComponent(friend_to_search + chat.host)); // Отправляем POST-запрос
                xmlhttp_search_compare.onreadystatechange = function() {
                    if (xmlhttp_search_compare.readyState == 4 && xmlhttp_search_compare.status == 200) {
                        if (xmlhttp_search_compare.responseText == creditials.username) {
                            var del_result = $('#search_result');
                            del_result.detach();
                            friend_to_search = creditials.username;
                            var newdiv_result = document.createElement('div');
                            newdiv_result.innerHTML = 'Этот контакт уже есть в вашем списке друзей или ему отправлена заявка!';
                            document.getElementById("search_list").appendChild(newdiv_result);
                            $(newdiv_result).attr('id', 'search_result');
                        } else {
                            var xmlhttp_search = getXmlHttp(); // Создаём объект XMLHTTP
                            xmlhttp_search.open('POST', 'search_contacts.php', true); // Открываем асинхронное соединение
                            xmlhttp_search.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку
                            xmlhttp_search.send("login=" + encodeURIComponent(friend_to_search)); // Отправляем POST-запрос
                            xmlhttp_search.onreadystatechange = function() {
                                if (xmlhttp_search.readyState == 4 && xmlhttp_search.status == 200) {
                                    if ((xmlhttp_search.responseText) != '' && !(document.getElementById('search_result')) && (friend_to_search != creditials.username)) {
                                        var newdiv_result = document.createElement('div');
                                        newdiv_result.innerHTML = xmlhttp_search.responseText + ' (' + friend_to_search + ')';
                                        document.getElementById("search_list").appendChild(newdiv_result);
                                        $(newdiv_result).attr('id', 'search_result');
                                        $('#search_button').removeClass('hidden');
                                        $('#search_button').removeClass('animated flipOutX');
                                        $('#search_button').addClass('animated flipInX');
                                    } else if ((xmlhttp_search.responseText) == '' && (document.getElementById('search_result'))) {
                                        var del_result = $('#search_result');
                                        del_result.detach();
                                        $('#search_button').removeClass('animated flipInX');
                                        $('#search_button').addClass('animated flipOutX');
                                    }
                                }
                            }
                        }
                    }
                }
            } else if ((document.getElementById('search_result')) && !(/^\+[0-9]{11,12}$/.test(friend_to_search))) {
                var del_result = $('#search_result');
                del_result.detach();
                $('#search_button').removeClass('animated flipInX');
                $('#search_button').addClass('animated flipOutX');
            }
        });
        $('#notification_info').click(function() {
            chat.showqueries_initilizer();
        });
        $('#notification_info_query').click(function() {
            chat.showqueries_accept();
        });
    },
    showqueries_initilizer: function() {
        var xmlhttp_initializer_friend_queries = getXmlHttp(); // Создаём объект XMLHTTP
        xmlhttp_initializer_friend_queries.open('POST', 'initializer_friend_queries.php', true); // Открываем асинхронное соединение
        xmlhttp_initializer_friend_queries.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку
        xmlhttp_initializer_friend_queries.send("login=" + encodeURIComponent(creditials.username)); // Отправляем POST-запрос
        var i = 1;
        var j = 1;
        var k = 1;
        var counter = 1;
        xmlhttp_initializer_friend_queries.onreadystatechange = function() {
            if (xmlhttp_initializer_friend_queries.readyState == 4 && xmlhttp_initializer_friend_queries.status == 200) {
                var str = xmlhttp_initializer_friend_queries.responseText;
                var event = JSON.parse(str, function(key, value) {
                    if (key == 'jid') {
                        var xmlhttp_initializer_friend_queries_name = getXmlHttp(); // Создаём объект XMLHTTP
                        xmlhttp_initializer_friend_queries_name.open('POST', 'initializer_friend_queries_name.php', true); // Открываем асинхронное соединение
                        xmlhttp_initializer_friend_queries_name.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку
                        xmlhttp_initializer_friend_queries_name.send("login=" + encodeURIComponent(value.slice(0, -4))); // Отправляем POST-запрос
                        var br1 = document.createElement("br");
                        var br2 = document.createElement("br");
                        xmlhttp_initializer_friend_queries_name.onreadystatechange = function() {
                            if (xmlhttp_initializer_friend_queries_name.readyState == 4 && xmlhttp_initializer_friend_queries_name.status == 200) {
                                var friend_query = document.createElement('div');
                                $(friend_query).attr('id', 'friend_query_' + counter);
                                var newli_result_name = document.createElement('div');
                                newli_result_name.innerHTML = xmlhttp_initializer_friend_queries_name.responseText
                                $(newli_result_name).attr('id', 'search_rez_names_' + i);
                                document.getElementById("initializer_friend").appendChild(friend_query);
                                document.getElementById('friend_query_' + counter).appendChild(newli_result_name);
                                var newli_result_number = document.createElement('div');
                                newli_result_number.innerHTML = '(' + value.slice(0, -4) + ')';
                                $(newli_result_number).attr('id', 'search_rez_numbers_' + j);
                                document.getElementById('friend_query_' + counter).appendChild(newli_result_number);
                                var new_bttn_result = document.createElement('button');
                                new_bttn_result.innerHTML = ' удалить ';
                                $(new_bttn_result).attr('type', 'button');
                                $(new_bttn_result).attr('id', 'remove_query_' + k);
                                $(new_bttn_result).attr('onclick', 'removeFriendQuery(' + j + ')');
                                new_bttn_result.style.display = "block";
                                document.getElementById('friend_query_' + counter).appendChild(new_bttn_result);
                                document.getElementById('friend_query_' + counter).appendChild(br1);
                                document.getElementById('friend_query_' + counter).appendChild(br2);
                                i++;
                                j++;
                                k++;
                                counter++;
                            }
                        }
                    }
                });
            }
        }
    },
    showqueries_accept: function() {
        var xmlhttp_initializer_friend_queries = getXmlHttp(); // Создаём объект XMLHTTP
        xmlhttp_initializer_friend_queries.open('POST', 'accept_friend_queries.php', true); // Открываем асинхронное соединение
        xmlhttp_initializer_friend_queries.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку
        xmlhttp_initializer_friend_queries.send("login=" + encodeURIComponent(creditials.username)); // Отправляем POST-запрос
        var i = 1;
        var j = 1;
        var k = 1;
        var kk = 1;
        var counter = 1;
        xmlhttp_initializer_friend_queries.onreadystatechange = function() {
            if (xmlhttp_initializer_friend_queries.readyState == 4 && xmlhttp_initializer_friend_queries.status == 200) {
                var str = xmlhttp_initializer_friend_queries.responseText;
                var event = JSON.parse(str, function(key, value) {
                    if (key == 'jid') {
                        var xmlhttp_initializer_friend_queries_name = getXmlHttp(); // Создаём объект XMLHTTP
                        xmlhttp_initializer_friend_queries_name.open('POST', 'initializer_friend_queries_name.php', true); // Открываем асинхронное соединение
                        xmlhttp_initializer_friend_queries_name.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку
                        xmlhttp_initializer_friend_queries_name.send("login=" + encodeURIComponent(value.slice(0, -4))); // Отправляем POST-запрос
                        var br1 = document.createElement("br");
                        var br2 = document.createElement("br");
                        xmlhttp_initializer_friend_queries_name.onreadystatechange = function() {
                            if (xmlhttp_initializer_friend_queries_name.readyState == 4 && xmlhttp_initializer_friend_queries_name.status == 200) {
                                var friend_query = document.createElement('div');
                                $(friend_query).attr('id', 'friend_query_' + counter);
                                var newli_result_name = document.createElement('div');
                                newli_result_name.innerHTML = xmlhttp_initializer_friend_queries_name.responseText
                                $(newli_result_name).attr('id', 'search_rez_names_' + i);
                                document.getElementById("initializer_friend").appendChild(friend_query);
                                document.getElementById('friend_query_' + counter).appendChild(newli_result_name);
                                var newli_result_number = document.createElement('div');
                                newli_result_number.innerHTML = '(' + value.slice(0, -4) + ')';
                                $(newli_result_number).attr('id', 'search_rez_numbers_' + j);
                                document.getElementById('friend_query_' + counter).appendChild(newli_result_number);
                                var new_bttn_result = document.createElement('button');
                                new_bttn_result.innerHTML = ' удалить ';
                                $(new_bttn_result).attr('type', 'button');
                                $(new_bttn_result).attr('id', 'remove_query_' + k);
                                $(new_bttn_result).attr('onclick', 'removeFriendQuery(' + j + ')');
                                new_bttn_result.style.display = "block";
                                var new_bttn_result_accept = document.createElement('button');
                                new_bttn_result_accept.innerHTML = ' добавить ';
                                $(new_bttn_result_accept).attr('type', 'button');
                                $(new_bttn_result_accept).attr('id', 'accept_query_' + kk);
                                $(new_bttn_result_accept).attr('onclick', 'acceptFriendQuery(' + j + ')');
                                new_bttn_result_accept.style.display = "block";
                                document.getElementById('friend_query_' + counter).appendChild(new_bttn_result);
                                document.getElementById('friend_query_' + counter).appendChild(new_bttn_result_accept);
                                document.getElementById('friend_query_' + counter).appendChild(br1);
                                document.getElementById('friend_query_' + counter).appendChild(br2);
                                i++;
                                j++;
                                k++;
                                kk++;
                                counter++;
                            }
                        }
                    }
                });
            }
        }
    },
    detachNotifications: function() {
        var element = document.getElementById("initializer_friend");
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },
    addToFriend: function() {
        var start_cut_friend_number = ((document.getElementById('search_result')).innerHTML).indexOf('+');
        var friend_jid = ((((document.getElementById('search_result')).innerHTML).replace(')', '')).slice(start_cut_friend_number)) + chat.host;
        var initializer_friend_login = creditials.username;
        var xmlhttp_addfriend = getXmlHttp(); // Создаём объект XMLHTTP
        xmlhttp_addfriend.open('POST', 'addFriend_vs.php', true); // Открываем асинхронное соединение
        xmlhttp_addfriend.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку
        xmlhttp_addfriend.send("friend_jid=" + encodeURIComponent(friend_jid) + "&initializer_friend_login=" + encodeURIComponent(initializer_friend_login)); // Отправляем POST-запрос
        xmlhttp_addfriend.onreadystatechange = function() {
            if (xmlhttp_addfriend.readyState == 4 && xmlhttp_addfriend.status == 200) {
                if (xmlhttp_addfriend.responseText == creditials.username) {
                    alert('Заявка на добавление уже была отправлена вам этим контактом!');
                    $("#f_search").intlTelInput("setCountry", "ru");
                    document.getElementById("f_search").value = "+7";
                    $('#search_result').detach();
                    $('#search_button').addClass('hidden');
                } else {
                    var xmlhttp_addfriend_success = getXmlHttp(); // Создаём объект XMLHTTP
                    xmlhttp_addfriend_success.open('POST', 'addFriend.php', true); // Открываем асинхронное соединение
                    xmlhttp_addfriend_success.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку
                    xmlhttp_addfriend_success.send("friend_jid=" + encodeURIComponent(friend_jid) + "&initializer_friend_login=" + encodeURIComponent(initializer_friend_login));
                    $("#f_search").intlTelInput("setCountry", "ru");
                    document.getElementById("f_search").value = "+7";
                    $('#search_result').detach();
                    $('#search_button').addClass('hidden');
                }
            }
        }
    },
    notificate: function() {
        var xmlhttp_notification = getXmlHttp(); // Создаём объект XMLHTTP
        xmlhttp_notification.open('POST', 'notificate.php', true); // Открываем асинхронное соединение
        xmlhttp_notification.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку
        xmlhttp_notification.timeout = 800;
        xmlhttp_notification.ontimeout = function() {
            if (r == 0) {
                chat.offline();
            }
        }
        xmlhttp_notification.send("initializer_login=" + encodeURIComponent(creditials.username)); // Отправляем POST-запрос  
        xmlhttp_notification.onreadystatechange = function() {
            if (xmlhttp_notification.readyState == 4 && xmlhttp_notification.status == 200) {
                chat.count_friends();

                console.log(1);
                if (r == 1) {
                    chat.online();
                }
                if (xmlhttp_notification.readyState == 4 && xmlhttp_notification.status == 200 && +(xmlhttp_notification.responseText) > 0) {
                    $('#friend_add_event').removeClass('hidden');
                    $('#friend_add_event').removeClass('animated flipOutX');
                    document.getElementById('notification_info').innerHTML = 'У Вас ' + xmlhttp_notification.responseText + ' отправленных заявка(ок) в друзья';
                    $('#friend_add_event').addClass('animated flipInX');
                      
                    
                    if (creditials.friend_number_after > creditials.friend_number) {
                        chat.testaction();
                        chat.getContactlist(creditials.username, true);
                    }
                }
            } else {
                $('#friend_add_event').removeClass('animated flipInX');
                $('#friend_add_event').addClass('animated flipOutX');
                $('#friend_add_event').addClass('hidden');
                if (creditials.friend_number_after > creditials.friend_number) {
                    chat.testaction();
                    chat.getContactlist(creditials.username, true);
                };
            }
        }
    },
    notificate_query: function() {
        var xmlhttp_notification_query = getXmlHttp(); // Создаём объект XMLHTTP
        xmlhttp_notification_query.open('POST', 'notificate_query.php', true); // Открываем асинхронное соединение
        xmlhttp_notification_query.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку
        xmlhttp_notification_query.timeout = 800;
        xmlhttp_notification_query.send("friend_login=" + encodeURIComponent(creditials.username)); // Отправляем POST-запрос
        xmlhttp_notification_query.onreadystatechange = function() {
            if (xmlhttp_notification_query.readyState == 4 && xmlhttp_notification_query.status == 200) {
                console.log(2);
                 chat.count_friends();
                if (xmlhttp_notification_query.readyState == 4 && xmlhttp_notification_query.status == 200 && +(xmlhttp_notification_query.responseText) > 0) {
                    $('#friend_query_event').removeClass('hidden');
                    $('#friend_query_event').removeClass('animated flipOutX');
                    document.getElementById('notification_info_query').innerHTML = 'У Вас ' + xmlhttp_notification_query.responseText + ' заявка(ок) в друзья';
                    $('#friend_query_event').addClass('animated flipInX');
                   
        
                    if (creditials.friend_number_after > creditials.friend_number) {
                        chat.testaction();
                        chat.getContactlist(creditials.username, true);
                    };
                }
               /* if (rr == 1) {
                    console.log(123456);
                    xmlhttp_notification_query.abort();
                }*/
            } else {
                $('#friend_query_event').removeClass('animated flipInX');
                $('#friend_query_event').addClass('animated flipOutX');
                $('#friend_query_event').addClass('hidden');

                if (creditials.friend_number_after > creditials.friend_number) {
                    chat.testaction();
                    chat.getContactlist(creditials.username, true);
                };
            }
        }
    },
    testaction: function() {
        $('#list_friend').empty();
        this.contactList = [];
        this.withjid = '';
        this.withid = '';
        this.masCountquery = [];
        this.masLastMesid = [];
        this.timeLogout = [];
        creditials.friend_number++;
        chat.logout();
        setTimeout(chat.reconect, 1000);
    },
    reconect: function() {
        var Jid = creditials.username + chat.host;
        connection = new Strophe.Connection('http://jmessager.ru/http-bind/');
        connection.addHandler(chat.onMessage.bind(chat), null, 'message', null, null, null);
        connection.addHandler(chat.changePresence, null, "presence");
        connection.connect(Jid, (creditials.password), onConnect);
        //var stat = Strophe.Status;
        function onConnect(status) {
            if (status == Strophe.Status.CONNECTING) {
                log('Strophe is connecting.');
            } else if (status == Strophe.Status.AUTHFAIL) {} else if (status == Strophe.Status.CONNECTED) {
                connection.send($pres());
            }
        }
    },
    send: function() {
        this.scrollToBottom();
        if (this.messageToSend.trim() !== '' || this.withjid.trim() !== '') {
            var msg = $msg({
                to: chat.withjid + this.host,
                from: connection.jid,
                type: 'chat'
            }).c('body').t(this.messageToSend.binEncode().cycleEncode());
            connection.send(msg.tree());
            var context = {
                messageOutput: this.messageToSend,
                date: this.getCurrentDate(),
                class: 'mess'
            };
            $(chat.$chatHistoryList[this.withid]).append(chat.ownTemp(context));
            this.scrollToBottom();
            this.$textarea.val('');
        }
    },
    addMessage: function() {
        this.messageToSend = this.$textarea.val().trim().replace(/\n/g, '');
        this.send();
    },
    addMessageEnter: function(event) {
        // enter was pressed
        if (event.keyCode === 13) {
            this.addMessage();
        }
    },
    onMessage: function(msg) {
        var to = msg.getAttribute('to');
        var from = msg.getAttribute('from');
        var type = msg.getAttribute('type');
        var elems = msg.getElementsByTagName('body');
        if (type == "chat" && elems.length > 0) {
            var body = elems[0];
            var mess = Strophe.getText(body);
            if (mess != '10000001') {
                var resp = Strophe.getText(body).Decode();
                var context = {
                    response: resp,
                    date: chat.getCurrentTime(),
                    class: 'mess'
                };
                if (resp == 'Error') {
                    var msg = $msg({
                        to: from.substr(0, from.indexOf('@')) + chat.host,
                        from: connection.jid,
                        type: 'chat'
                    }).c('body').t('10000001');
                    connection.send(msg.tree());
                }
                var i = chat.contactList.indexOf(from.substr(0, from.indexOf('@')));
                $(chat.$chatHistoryList[i]).append(chat.withTemp(context));
                chat.scrollToBottom();
                // AddText(Strophe.getText(body), 'in');
            } else {
                chat.send();
            }
        }
        // we must return true to keep the handler alive.  
        // returning false would remove it after it finishes.
        return true;
    },
    changePresence: function(presence) {
        var jid = presence.getAttribute('from'),
            type = presence.getAttribute('type'),
            show = (presence.getElementsByTagName('show').length !== 0) ? Strophe.getText(presence.getElementsByTagName('show')[0]) : null,
            status = (presence.getElementsByTagName('status').length !== 0) ? Strophe.getText(presence.getElementsByTagName('status')[0]) : null,
            priority = (presence.getElementsByTagName('priority').length !== 0) ? Strophe.getText(presence.getElementsByTagName('priority')[0]) : null;
        switch (type) {
            case null:
                if (jid.indexOf(connection.authzid) < 0) {
                    var i = chat.contactList.indexOf(jid.substr(0, jid.indexOf('@')));
                    if (i > -1) {
                        var elem = $("div[name='mate" + i + "'] .status");
                        elem.text(' online');
                        elem.prepend('<i class="fa fa-circle online"></i>');
                        chat.timeLogout[i] = 0;
                        if (i == chat.withid) {
                            elem = $('.chat-about .status');
                            elem.text(' online');
                            elem.prepend('<i class="fa fa-circle online"></i>');
                        }
                    }
                }
                break
            case 'unavailable':
                var i = chat.contactList.indexOf(jid.substr(0, jid.indexOf('@')));
                if (i > -1) {
                    chat.timeLogout[i] = (new Date()).getTime();
                }
                break;
            case 'subscribe':
                break;
            default:
                break;
        }
        return true;
    },
    upHistory: function() {
        if (this.masCountquery[this.withid] != -1) {
            $.getJSON('/uphistory.php', {
                Owner: connection.authzid,
                With: this.withjid + this.host,
                countquery: this.masCountquery[this.withid]
            }, insertHistory.bind(this));
            setTimeout(chat.set_name_on_messages, 50);
        }

        function insertHistory(data, success) {
            for (var i = data.length - 2; i >= 0; i--) {
                var time = new Date(data[i].time);
                if (data[i].user == connection.authzid) {
                    var context = {
                        messageOutput: data[i].body,
                        date: time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + '  ' + time.getDate() + '.' + time.getMonth(),
                        class: 'mess' + this.masLastMesid[this.withid]++
                    };
                    $(this.$chatHistoryList[this.withid]).prepend(chat.ownTemp(context));
                } else {
                    var context = {
                        response: data[i].body,
                        date: time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + '  ' + time.getDate() + '.' + time.getMonth(),
                        class: 'mess' + this.masLastMesid[this.withid]++
                    };
                    $(this.$chatHistoryList[this.withid]).prepend(chat.withTemp(context));
                }
            }
            var offset = 0;
            for (var i = this.masLastMesid[this.withid] - 1; i > this.masLastMesid[this.withid] - data.length; i--) {
                offset += $("div[name='chat" + chat.withid + "'] .mess" + i).outerHeight(true);
            }
            var count = parseInt(data[data.length - 1].countquery);
            this.masCountquery[this.withid] = count;
            if (count == 1) this.scrollToBottom();
            else $(this.$chatHistory[this.withid]).scrollTop($(this.$chatHistory[this.withid]).scrollTop() + offset);
        }
    },
    set_name_on_messages: function() {
        var you = $('[class = message-data-name]');
        var i = 0;
        var name_you = (document.getElementById("chat-with").innerHTML);
        while (i < you.length) {
            you[i].innerHTML = name_you;
            i++;
        }
        var friend = $('[class = message-data-name-sender]');
        var j = 0;
        while (j < friend.length) {
            friend[j].innerHTML = 'ИМЯ ДРУГА';
            j++;
        }
    },
    getContactlist: function(login, all) {
        $.post('/getcontactlist.php', {
            login: login
        }, chat.insertContacts, 'json');
    },
    insertContacts: function(data, success) {
        if (success === 'success') {
            var template = Handlebars.compile($("#getcontacts-template").html());
            var list = $('.list');
            $(list).attr('id', 'list_friend');
            var chatmes = $('.chat-message');
            var style = '<style>';
            var k = chat.contactList.length;
            var end = data.length;
            if (data[data.length - 1].jid === undefined) {
                end--;
                $('#chat-with').text(data[data.length - 1].name);
            }
            for (var i = 0; i < end; i++, k++) {
                chat.contactList.push(data[i].jid);
                var temp = {
                    name: data[i].name,
                    jid: data[i].jid,
                    idcontact: k
                };
                list.append(template(temp));
                style += 'input[name="visi"]:checked + .key' + k + ' ~ div[name="chat' + k + '"], ';
                chat.masCountquery.push(0);
                chat.masLastMesid.push(0);
                chat.timeLogout.push(data[i].dateoff ? parseInt(data[i].dateoff) : 0);
            }
            style = style.substr(0, style.length - 2);
            style += '{z-index: 20;}';
            $('head').append(style);
            $("div[name^='mate']").click(chat.catchContact);
            chat.$chatHistory = $('div[name^="chat"].chat-history');
            chat.$chatHistoryList = $('div[name^="chat"].chat-history ul');
            chat.$chatHistory.scroll(function() {
                if (chat.masCountquery[chat.withid] != -1) {
                    if ($(this).scrollTop() == 0) {
                        chat.upHistory();
                    }
                }
            });
            setTimeout(chat.countsecLogout, 10);
        }
    },
    getContact: function(jid) {},
    catchContact: function(event) {
        var num = $(this).attr('name').substr(4);
        chat.withid = parseInt(num);
        chat.withjid = chat.contactList[chat.withid];
        var chatwith = $('.chat-about');
        chatwith.find('.chat-with').text(('Чат с ' + $('div[name=mate' + chat.withid + '] .about .name').text()));
        chatwith.find('.status').remove();
        $("div[name='mate" + chat.withid + "'] .status").clone().appendTo(chatwith);
        if (chat.masCountquery[chat.withid] == 0) {
            chat.upHistory();
        }
    },
    countsecLogout: function() {
        if (($('#user_status').val()) != 'offline') {
            var time = new Date();
            var date = time.getTime();
            chat.timeLogout.forEach(function(item, i) {
                if (item > 0) {
                    var test2 = new Date(item);
                    var status = ' offline ';
                    var differ = Math.ceil((date - item) / 1000);
                    if (differ < 3599) {
                        status += Math.ceil(differ / 60) + ' минут(ы) назад';
                    }
                    if (differ >= 3600 && differ <= 86399) {
                        status += Math.round(differ / 3600) + ' час(а)(ов) назад';
                    }
                    if (differ >= 86400) {
                        status += Math.ceil(differ / 86400) + ' день(ней) назад';
                    }
                    var elem = $("div[name='mate" + i + "'] .status");
                    elem.text(status);
                    elem.prepend('<i class="fa fa-circle offline"></i>');
                    if (i == chat.withid) {
                        elem = $('.chat-about .status');
                        elem.text(status);
                        elem.prepend('<i class="fa fa-circle offline"></i>');
                    }
                }
            });
        }
    },
    withTemp: Handlebars.compile($("#message-response-template").html()),
    ownTemp: Handlebars.compile($("#message-template").html()),
    scrollToBottom: function() {
        $(this.$chatHistory[this.withid]).scrollTop(this.$chatHistory[0].scrollHeight);
    },
    getCurrentTime: function() {
        return new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    },
    getCurrentDate: function() {
        return new Date().toLocaleString("ru", options);
    },
    count_friends: function() {
        var name = creditials.username.slice(1);
        name = 'login=' + name;
        var xhr = $.ajax({
            type: "POST",
            url: "count_friends.php",
            dataType: 'text',
            data: name,
            timeout: 800,
            success: function(msg) {
                chat.number_of_friends(msg);
            }
        });
    },
    number_of_friends: function(data) {
        if (creditials.friend_number == undefined) {
            creditials.friend_number = data;
        } else {
            creditials.friend_number_after = data;
        }
    }
};
chat.init();
var connection = new Strophe.Connection('http://jmessager.ru/http-bind/');
connection.addHandler(chat.onMessage.bind(chat), null, 'message', null, null, null);
connection.addHandler(chat.changePresence, null, "presence");
var searchFilter = {
    options: {
        valueNames: ['name']
    },
    init: function() {
        var userList = new List('people-list', this.options);
    }
};
searchFilter.init();

function removeFriendQuery(id) {
    var delete_from_initializer = ((document.getElementById('search_rez_numbers_' + id).innerHTML).slice(1, -1)) + chat.host;
    var xmlhttp_remove_friend_query = getXmlHttp(); // Создаём объект XMLHTTP
    xmlhttp_remove_friend_query.open('POST', 'remove_friend_query.php', true); // Открываем асинхронное соединение
    xmlhttp_remove_friend_query.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку
    xmlhttp_remove_friend_query.send("login_initializer=" + encodeURIComponent(creditials.username) + "&jid=" + encodeURIComponent(delete_from_initializer)); // Отправляем POST-запрос
    var element = document.getElementById("friend_query_" + id);
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    setTimeout(chat.showqueries, 50);
}

function acceptFriendQuery(id) {
    var accept_from_friend = ((document.getElementById('search_rez_numbers_' + id).innerHTML).slice(1, -1)) + chat.host;
    /*var xmlhttp_remove_friend_query = getXmlHttp(); // Создаём объект XMLHTTP
    xmlhttp_remove_friend_query.open('POST', 'accept_friend_query.php', true); // Открываем асинхронное соединение
    xmlhttp_remove_friend_query.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку
    xmlhttp_remove_friend_query.send("login_initializer=" + encodeURIComponent(creditials.username) + "&jid=" + encodeURIComponent(accept_from_friend)); // Отправляем POST-запрос*/
    $.post('/accept_friend_query.php', {
        login_initializer: creditials.username,
        jid: accept_from_friend
    }, chat.insertContacts, 'json');
    var element = document.getElementById("friend_query_" + id);
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    setTimeout(chat.showqueries, 50);
}

function getCookie(name) {
  var cookie = " " + document.cookie;
  var search = " " + name + "=";
  var setStr = null;
  var offset = 0;
  var end = 0;
  if (cookie.length > 0) {
    offset = cookie.indexOf(search);
    if (offset != -1) {
      offset += search.length;
      end = cookie.indexOf(";", offset)
      if (end == -1) {
        end = cookie.length;
      }
      setStr = unescape(cookie.substring(offset, end));
    }
  }
  return(setStr);
}
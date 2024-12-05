define(['jquery', 'core/str', 'core/notification'], function ($, str, notification) {
    return {
        init: function() {
            // Copier les informations dans le presse-papiers
            $('#infos').off('click').on('click', function () {
                if (!navigator.clipboard) {
                    str.get_string('msgalertbadbrowser', 'block_su_agent_moodle').then(function(string) {
                        alert(string);
                    }).fail(notification.exception);
                } else {
                    let serverlabel = document.getElementById("serverlabel").innerText;
                    let identificationlabel = document.getElementById("identificationlabel").innerText;
                    let ipaddresslabel = document.getElementById("ipaddresslabel").innerText.split(' ').slice(-1);
                    let configurationlabel = document.getElementById("configurationlabel").innerText;
                    let datelabel = document.getElementById("datelabel").innerText;

                    str.get_string('msgalertgood', 'block_su_agent_moodle').then(function(msgalertgoodString) {
                        return navigator.clipboard.writeText(
                            datelabel + " | " + serverlabel + " | " + identificationlabel + " => " + ipaddresslabel + " | " + configurationlabel
                        ).then(function () {
                            alert(msgalertgoodString);
                        });
                    }).catch(function () {
                        str.get_string('error', 'block_su_agent_moodle').then(function(errorString) {
                            alert(errorString);
                        }).fail(notification.exception);
                    });
                }
            });
            // Envoi de l'e-mail via AJAX lors du clic sur le bouton
            $('#msgbtn').off('click').on('click', function () {
                let message = $('#msg').val();

                if (!message) {
                    str.get_string('msgempty', 'block_su_agent_moodle').then(function(string) {
                        alert(string);
                    }).fail(notification.exception);
                    return;
                }
                let serverlabel = document.getElementById("serverlabel").innerText;
                let identificationlabel = document.getElementById("identificationlabel").innerText;
                let ipaddresslabel = document.getElementById("ipaddresslabel").innerText.split(' ').slice(-1)[0];
                let configurationlabel = document.getElementById("configurationlabel").innerText;
                let datelabel = document.getElementById("datelabel").innerText;
                $.ajax({
                    url: M.cfg.wwwroot + '/blocks/su_agent_moodle/sendmail.php',
                    method: 'POST',
                    data: {
                        message: message,
                        server: serverlabel,
                        identification: identificationlabel,
                        ipaddress: ipaddresslabel,
                        configuration: configurationlabel,
                        date: datelabel,
                        sesskey: M.cfg.sesskey
                    },
                    success: function(response) {
                        console.log("Réponse du serveur :", response);

                        if (response && response.status === 'success') {
                            str.get_string('msgemailsuccess', 'block_su_agent_moodle').then(function(successString) {
                                notification.addNotification({
                                    message: successString,
                                    type: 'success'
                                });
                                $('#msg').val('');  // Vider le champ message si tout se passe bien
                            }).fail(notification.exception);
                        } else {
                            str.get_string('msgemailerror', 'block_su_agent_moodle').then(function(errorString) {
                                notification.addNotification({
                                    message: errorString,
                                    type: 'error'
                                });
                            }).fail(notification.exception);
                        }
                    },
                    error: function() {
                        str.get_string('msgemailerror', 'block_su_agent_moodle').then(function(errorString) {
                            notification.addNotification({
                                message: errorString,
                                type: 'error'
                            });
                        }).fail(notification.exception);
                    }
                });
            });
        }
    };
});

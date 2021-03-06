﻿var chatHub;
var miNombre;
$(document).ready(function () {
    chatHub = $.connection.hubChat;

    registrarEventos();

    $.connection.hub.start().done(function () {
        bootbox.prompt("¿Como te llamas?", function (res) {
           
            if (res != null) {
                miNombre = res;
                chatHub.server.conectar(miNombre);
                registrarLlamadas();
            }
        });
    });


});

function registrarLlamadas() {
    $("#btnEnv").click(function () {
        var txt = $("#txtMens").val();
        //conecta con el servidor y le envia el mensaje
        chatHub.server.enviarMensaje(miNombre, txt);
    });
}

function registrarEventos() {
    chatHub.client.onConectado = function (id, nombre, usuarios, mensajes) {
        $.each(usuarios, function (key, obj) {
            var elem = "<li id='us-'" + obj.Id
                + "'>" + obj.miNombre + "</li>";
        });

        $.each(mensajes, function (key, obj) {
            var elem = "<p>" + obj.Usuario + " dice " + obj.Contenido + "</p>";
            $("#mensajes").append(elem);
        });
    };
    chatHub.client.onNuevoConectado = function (id, nombre) {
        var elem = "<li id='us->" + id + "'>" + nombre + "</li>";
        $("#conectados").append(elem);
        $("#mensajes").append("<p> Se ha conectado " + nombre + "</p>");
    }

    chatHub.client.enviadoMensaje = function (usuario, mensaje) {
        var elem = "<p>" + usuario + " dice " + mensaje + "</p>";
        $("#mensajes").append(elem);
    }

    chatHub.client.usuarioDesconectado = function (id, nombre) {
        var item = $("#us-" + id);
        $("#conectados").remove(item);
        var elem = "<p>" + nombre + " se ha desconectado</p>";
        $("#mensajes").append(elem);
    }
}
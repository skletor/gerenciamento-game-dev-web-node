const signalR = require("@microsoft/signalr");

var hubConnection = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Trace)
    .withUrl("http://localhost:63591/chatHub")
    .build();
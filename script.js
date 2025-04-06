document.getElementById("credits").addEventListener("click", function() {
    alert("Not available yet!");
});

document.getElementById("newgame").addEventListener("click", function() {
    document.getElementById("main-menu").style.display = 'none';
    document.getElementById("cafe").style.display = 'flex';
});

let startchat = document.getElementById("chat");
let startpos = document.getElementById("order");

startchat.addEventListener("click", function() {
    console.log("Chatting!");
});

startpos.addEventListener("click", function() {
    console.log("Notetaking!");
});
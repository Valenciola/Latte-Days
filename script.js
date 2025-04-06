// Overarching
let playername = "Pamela";

// Main Menu
document.getElementById("credits").addEventListener("click", function() {
    alert("Not available yet!");
});

document.getElementById("newgame").addEventListener("click", function() {
    document.getElementById("main-menu").style.display = 'none';
    document.getElementById("cafe").style.display = 'flex';
});

// Cafe UI
let options = document.getElementById("options"); // Overarching options div
let startchat = document.getElementById("chat"); // Chat button
let startpos = document.getElementById("order"); // Order button
let todelivery = document.getElementById("todeliver"); // Left
let tobarista = document.getElementById("todrink"); // Right

// Chat
let chatbox = document.getElementById("dialogue");

let tutorialconvo = [ // The tutorial chat convo placeholder
    ["Chima", "Pleasure to see you! I'm quite glad that I get to train you today. My name's Chima!"],
    [playername, "I'm excited to be here."],
    ["Chima", "Let's get started, shall we?"]
];

function dialogue(lines, element, button) {
    // All logic handling the dialogue chat feature
    let line = 0;
    let i = 0; // Initialize character index
    const interval = 35; // Wait time
    element.textContent = ''; // Erase original text
    button.style.display = "none";

    function addCharacter() {
        if (i < lines[line][1].length) {
            element.textContent += lines[line][1][i];
            i++;
            setTimeout(addCharacter, interval);
        }
        else {
            if (line == lines.length - 1) {
                button.textContent = "✓";
            }
            else {
                button.textContent = "→";
            }
            button.style.display = "flex";
        }
    }

    function displayText() {
        if (line < lines.length) {
            document.getElementById("custoname").textContent = lines[line][0];
            if (lines[line][0] == playername) {
                document.getElementById("custoname").style.backgroundColor = "lightskyblue";
            }
            else {
                document.getElementById("custoname").style.backgroundColor = "purple";
            }
            addCharacter();
        }
        else {
            // Dialogue is finished; reset
            button.removeEventListener('click', buttonHandle);
            chatbox.style.display = "none";
            options.style.display = "flex";
        }
    }

    function buttonHandle() {
        button.style.display = "none";
        element.textContent = ''; // Clear previous line
        line++; // Move to the next line
        i = 0; // Reset character index for the new line
        displayText();
    }

    button.addEventListener('click', buttonHandle);

    displayText(); // Start displaying the first line
}

startchat.addEventListener("click", function() {
    // Upon click, initiate chat
    chatbox.style.display = "flex";
    options.style.display = "none";
    // Edit lines here depending on the character and other factors. RETURN to this later.
    dialogue(tutorialconvo, document.getElementById("text"), document.getElementById("textprogress"));
});

// Take Order

// Shift Barista

// Shift Delivery
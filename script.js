// Overarching
let playername = "Pamela"; // RETURN to this and change to base on main menu selection
const optionData = {
    "Bases": ["Latte", "Tea", "Espresso", "Americano"],
    "Flavorings": ["Original", "Matcha", "Chai", "Mocha", "Vanilla"],
    "AddIns": ["Cream", "Ice", "Boba", "Milk", "Oat Milk", "Sugar"],
    "Toppings": ["Cold Foam", "Chocolate Sauce", "Whipped Cream", "Shaved Chocolate"]
}
let customername = "Chima"; // RETURN to this and change to base on code running
let posflag = false;
let opentickets = [];
let currentcustomers = [];
let drinks = [null, null, null];

// Classes
class Ticket {
    constructor(customerName, drinkBase, flavoring, addIns = [], toppings = []) {
        this.customerName = customerName || "?";
        this.drinkBase = drinkBase || "Latte";
        this.flavoring = flavoring || "Original";
        this.addIns = addIns || [];
        this.toppings = toppings || [];
    }
}
class Drink {
    constructor(base, flavoring, addIns = [], toppings = [], desc = "?") {
        this.base = base || "Latte";
        this.flavoring = flavoring || "Original";
        this.addIns = addIns || [];
        this.toppings = toppings || [];
        this.desc = desc || "Regular Latte";
    }
}

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
    [customername, "Pleasure to see you! I'm quite glad that I get to train you today. My name's Chima!"],
    [playername, "I'm excited to be here."],
    [customername, "Let's get started, shall we?"]
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
            // Line is complete
            if (line == lines.length - 1) { // If/else toggle between check and arrow for aesthetics and whatnot
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

            if (posflag) {
                // Handle creating a ticket here
                document.getElementById("pos").style.display = "none";
                posflag = false;
                setTicket();
                console.log(opentickets);
            }
        }
    }

    function buttonHandle() {
        button.style.display = "none";
        element.textContent = ''; // Clear previous line
        line++; // Move to the next line
        i = 0; // Reset character index for the new line
        displayText();
    }

    function setTicket() {
        const newTicket = new Ticket(
            customername,
            Selections.Bases, 
            Selections.Flavorings, 
            Selections.AddIns, 
            Selections.Toppings
        );
        opentickets.push(newTicket);

        Selections.Bases = null;
        Selections.Flavorings = null;
        Selections.AddIns = [];
        Selections.Toppings = [];
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
let posoptions = document.getElementById("posoptions")
let tobases = document.getElementById("posbases");
let toflavorings = document.getElementById("posflavor");
let toaddins = document.getElementById("posaddin");
let totoppings = document.getElementById("postopping");
const Selections = {
    Bases: null,
    Flavorings: null, 
    AddIns: [], 
    Toppings: [] 
};
let order = [[customername, "I'll have a regular latte."]];

let createForm = function(category) {
    const formspace = document.getElementById("ticketselect");
    formspace.innerHTML = '';

    formspace.style.display = "flex";
    posoptions.style.display = "none";

    let formtitle = document.createElement("h3");
    formtitle.textContent = `Choose from ${category}`;
    formspace.appendChild(formtitle);

    optionData[category].forEach(option => {
        const label = document.createElement("label");
        const input = document.createElement("input");

        // Set the type of input (radio for single-choice, checkbox for multi-choice)
        input.type = (category === "Bases" || category === "Flavorings") ? "radio" : "checkbox";
        input.name = category; // Group inputs by category
        input.value = option;

        if (category === "AddIns" || category === "Toppings") {
            // For multi-choice categories, check if the option is in the array
            input.checked = Selections[category].includes(option);
        } else {
            // For single-choice categories, check if the value matches
            input.checked = Selections[category] === option;
        }

        // Attach an event listener to handle user selections
        input.addEventListener("change", () => updateChange(category, option, input.checked));

        // Append the input and its label to the form container
        label.appendChild(input);
        label.appendChild(document.createTextNode(option));
        formspace.appendChild(label);
        formspace.appendChild(document.createElement("br")); // Optional: Line break for better spacing
    });

    const backButton = document.createElement("button");
    backButton.textContent = "Back";
    backButton.addEventListener("click", function() {
        formspace.style.display = "none";
        posoptions.style.removeProperty("display");
    });
    formspace.appendChild(backButton);
}

let updateChange = function(category, value, isChecked) {
    if (category === "AddIns" || category === "Toppings") {
        // For checkboxes: Add or remove values in the array
        if (isChecked) {
            Selections[category].push(value); // Add selection
        } else {
            Selections[category] = Selections[category].filter(item => item !== value); // Remove selection
        }
    } else {
        // For radio buttons: Replace the existing selection
        Selections[category] = value;
    }

    console.log(Selections); // Debugging: See the updated selections in the console

    writeUp();
}

let writeUp = function() {
    // Update the ticket
    let ticket = document.getElementById("ticketsummary");
    ticket.innerHTML = "";

    let namecard = document.createElement("li");
    namecard.textContent = `Name: ${customername}`;
    ticket.appendChild(namecard);

    Object.keys(Selections).forEach(category => {
        if (Array.isArray(Selections[category])) {
            // Multi-choice categories (AddIns, Toppings)
            Selections[category].forEach(item => {
                const listItem = document.createElement("li");
                listItem.textContent = `${category}: ${item}`;
                ticket.appendChild(listItem);
            });
        } else if (Selections[category]) {
            // Single-choice categories (Bases, Flavorings)
            const listItem = document.createElement("li");
            listItem.textContent = `${category}: ${Selections[category]}`;
            ticket.appendChild(listItem);
        }
    });
}

tobases.addEventListener("click", () => createForm("Bases"));
toflavorings.addEventListener("click", () => createForm("Flavorings"));
toaddins.addEventListener("click", () => createForm("AddIns"));
totoppings.addEventListener("click", () => createForm("Toppings"));

startpos.addEventListener("click", function() {
    // Upon click, initiate chat
    document.getElementById("pos").style.display = "flex";
    options.style.display = "none";

    chatbox.style.display = "flex";
    document.getElementById("ticketsummary").innerHTML = '';
    posflag = true;
    dialogue(order, document.getElementById("text"), document.getElementById("textprogress"));
});

// Shift Barista
let backtocaf = document.getElementById("backbar");
let createdrink = document.getElementById("newdrink");

tobarista.addEventListener("click", function() {
    // Switch to the Barista Station
    document.getElementById("cafe").style.display = 'none';
    document.getElementById("barista").style.display = 'flex';
});

backtocaf.addEventListener("click", function() {
    // Switch back to the Cafe
    document.getElementById("cafe").style.display = 'flex';
    document.getElementById("barista").style.display = 'none';
});

createdrink.addEventListener("click", function() {
    console.log("Here's to new drinks!");
});

// Shift Delivery
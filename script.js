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
let posoptions = document.getElementById("posoptions");
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

let createForm = function(category, formspace, select, options, pos) {
    formspace.innerHTML = '';

    formspace.style.display = "flex";
    options.style.display = "none";

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
            input.checked = select[category].includes(option);
        } else {
            // For single-choice categories, check if the value matches
            input.checked = select[category] === option;
        }

        // Attach an event listener to handle user selections
        input.addEventListener("change", () => updateChange(category, option, input.checked, select, pos));

        // Append the input and its label to the form container
        label.appendChild(input);
        label.appendChild(document.createTextNode(option));
        formspace.appendChild(label);
        formspace.appendChild(document.createElement("br"));
    });

    const backButton = document.createElement("button");
    backButton.textContent = "Back";
    backButton.addEventListener("click", function() {
        formspace.style.display = "none";
        if (pos) {
            options.style.removeProperty("display");
        }
        else {
            options.style.display = 'flex';
        }
    });
    formspace.appendChild(backButton);
}

let updateChange = function(category, value, isChecked, selectTarget, pos) {
    if (category === "AddIns" || category === "Toppings") {
        // For checkboxes: Add or remove values in the array
        if (isChecked) {
            selectTarget[category].push(value); // Add selection
        } else {
            selectTarget[category] = selectTarget[category].filter(item => item !== value); // Remove selection
        }
    } else {
        // For radio buttons: Replace the existing selection
        selectTarget[category] = value;
    }

    console.log(selectTarget); // Debugging: See the updated selections in the console

    if (pos) {
        writeUp();
    }
    else {
        buildDesc();
    }
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

tobases.addEventListener("click", () => createForm("Bases", document.getElementById("ticketselect"), Selections, posoptions, true));
toflavorings.addEventListener("click", () => createForm("Flavorings", document.getElementById("ticketselect"), Selections, posoptions, true));
toaddins.addEventListener("click", () => createForm("AddIns", document.getElementById("ticketselect"), Selections, posoptions, true));
totoppings.addEventListener("click", () => createForm("Toppings", document.getElementById("ticketselect"), Selections, posoptions, true));

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
let baroptions = document.getElementById("baroptions");

let callTickets = function() {
    let viewtickets = document.getElementById("viewtickets");

    let existingMessage = viewtickets.querySelector("p");
    if (existingMessage) {
        existingMessage.remove();
    }

    if (opentickets.length == 0) {
        // We got no tickets
        let notickets = document.createElement("p");

        // Put that message right in the center
        viewtickets.style.display = "flex";
        viewtickets.style.justifyContent = "center";
        viewtickets.style.alignItems = "center";

        notickets.textContent = "No open tickets.";
        viewtickets.appendChild(notickets);
    }
    else {
        // We got tickets
        viewtickets.style.display = ""; // Clearing things
        viewtickets.style.justifyContent = "";
        viewtickets.style.alignItems = "";
        viewtickets.innerHTML = "";

        let orderhead = document.createElement("h2");
        orderhead.textContent = `Order for ${customername}`;
        viewtickets.appendChild(orderhead);

        // Display from tickets
        const firstTicket = opentickets[0];
        const ticketDetails = document.createElement("ul");
        Object.keys(firstTicket).forEach(key => {
            if (Array.isArray(firstTicket[key]) && firstTicket[key].length > 0) {
                // Toppinds, Add-Ins
                const listItem = document.createElement("li");
                listItem.textContent = `${firstTicket[key].join(", ")}`;
                ticketDetails.appendChild(listItem);
            } else if (!Array.isArray(firstTicket[key]) && firstTicket[key] && key != "customerName") {
                // Base, Flavor
                const listItem = document.createElement("li");
                listItem.textContent = `${firstTicket[key]}`;
                ticketDetails.appendChild(listItem);
            }
        });

        viewtickets.appendChild(ticketDetails);
    }
}

tobarista.addEventListener("click", function() {
    // Switch to the Barista Station
    document.getElementById("cafe").style.display = 'none';
    document.getElementById("barista").style.display = 'flex';
    if (!(drinks.includes(null))) {
        createdrink.disabled = true;
    }
    else {
        createdrink.disabled = false;
    }
});

backtocaf.addEventListener("click", function() {
    // Switch back to the Cafe
    document.getElementById("cafe").style.display = 'flex';
    document.getElementById("barista").style.display = 'none';
});

// Open create drinks
createdrink.addEventListener("click", function() {
    baroptions.style.display = 'none';
    document.getElementById("drinkstation").style.display = 'flex';
    callTickets();
});

// Make Drinks
let boptions = document.getElementById("makedrink");
let bbases = document.getElementById("barbases");
let bflavorings = document.getElementById("barflavor");
let baddins = document.getElementById("baraddin");
let btoppings = document.getElementById("bartopping");
let backbar = document.getElementById("closebar");
const DrinkSelections = {
    Bases: "Latte",
    Flavorings: "Original", 
    AddIns: [], 
    Toppings: [],
    Desc: "Regular Latte"
};

function buildDesc() {
    // Create a description from the choices
    let tempd = "";

    if (DrinkSelections.AddIns.includes("Ice")) {
        tempd = tempd + "Iced";
    }

    if (DrinkSelections.Flavorings == "Original") {
        tempd = tempd + " Regular";
    }
    else {
        tempd = tempd + ` ${DrinkSelections.Flavorings}`;
    }

    tempd = tempd + ` ${DrinkSelections.Bases}`;

    let nonex = [] // Non-Excluded Add-Ins
    for(i = 0; i < DrinkSelections.AddIns.length; i++) {
        if (DrinkSelections.AddIns[i] != "Ice") {
            nonex.push(DrinkSelections.AddIns[i]);
        }
    }
    if (nonex.length != 0) {
        tempd = tempd + " with";
        if (nonex.length == 2) {
            tempd = tempd + ` ${nonex[0]} and ${nonex[1]}`;
        }
        else if (nonex.length == 1) {
            tempd = tempd + ` ${nonex[0]}`;
        }
        else {
            for(i = 0; i < nonex.length; i++) {
                if (i == nonex.length - 1) {
                    tempd = tempd + ` and ${nonex[i]}`;
                }
                else {
                    tempd = tempd + ` ${nonex[i]},`;
                }
            }
        }
    }

    if (DrinkSelections.Toppings.length != 0) {
        if (nonex.length != 0) {
            tempd = tempd + " and";
        }
        tempd = tempd + " topped with";
        if (DrinkSelections.Toppings.length == 2) {
            tempd = tempd + ` ${DrinkSelections.Toppings[0]} and ${DrinkSelections.Toppings[1]}`;
        }
        else if (DrinkSelections.Toppings.length == 1) {
            tempd = tempd + ` ${DrinkSelections.Toppings[0]}`;
        }
        else {
            for(i = 0; i < DrinkSelections.Toppings.length; i++) {
                if (i == DrinkSelections.Toppings.length - 1) {
                    tempd = tempd + ` and ${DrinkSelections.Toppings[i]}`;
                }
                else {
                    tempd = tempd + ` ${DrinkSelections.Toppings[i]},`;
                }
            }
        }
    }

    DrinkSelections.Desc = tempd;
    document.getElementById("drinkdesc").textContent = tempd;
}

function setDrink() {
    const newDrink = new Drink(
        DrinkSelections.Bases,
        DrinkSelections.Flavorings,
        DrinkSelections.AddIns,
        DrinkSelections.Toppings,
        DrinkSelections.Desc
    );
    drinks[drinks.indexOf(null)] = newDrink;

    DrinkSelections.Bases = "Latte";
    DrinkSelections.Flavorings = "Original";
    DrinkSelections.AddIns = [];
    DrinkSelections.Toppings = [];
    DrinkSelections.Desc = "Regular Latte";
}

// Handle Barista Station Modal Buttons
bbases.addEventListener("click", () => createForm("Bases", document.getElementById("custodrink"), DrinkSelections, boptions, false));
bflavorings.addEventListener("click", () => createForm("Flavorings", document.getElementById("custodrink"), DrinkSelections, boptions, false));
baddins.addEventListener("click", () => createForm("AddIns", document.getElementById("custodrink"), DrinkSelections, boptions, false));
btoppings.addEventListener("click", () => createForm("Toppings", document.getElementById("custodrink"), DrinkSelections, boptions, false));
backbar.addEventListener("click", function() {
    baroptions.style.display = '';
    document.getElementById("drinkstation").style.display = 'none';
});
document.getElementById("confirmdrink").addEventListener("click", function() {
    setDrink();
    if (!(drinks.includes(null))) {
        createdrink.disabled = true;
    }
    else {
        createdrink.disabled = false;
    }
    baroptions.style.display = '';
    document.getElementById("drinkstation").style.display = 'none';
    console.log(drinks);
});

// Shift Delivery
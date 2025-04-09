// Overarching
let playername = "Pamela"; // RETURN to this and change to base on main menu selection
const optionData = {
    "Bases": ["Latte", "Tea", "Espresso", "Americano"],
    "Flavorings": ["Original", "Matcha", "Chai", "Mocha", "Vanilla"],
    "AddIns": ["Cream", "Ice", "Boba", "Milk", "Sugar"],
    "Toppings": ["Cold Foam", "Chocolate Sauce", "Whipped Cream", "Shaved Chocolate"]
}
let tutorial = false;

let posflag = false; // For dialogue engine w/ POS
let callflag = false; // For dialogue engine w/Delivery
let judgeflag = false; // Handle a judging part

let customername = null; // RETURN to this and change to base on code running
let readycustomers = []; // Queue customers at the front counter
let waitingcustomers = []; // Customers waiting to be served
let focuscustomer = null; // Current customer (call at delivery)

let drinks = [null, null, null]; // Drinks (cap 3)
let drinkindex = null; // Current drink
let opentickets = []; // Pushed tickets
let ticketindex = null; // Current ticket

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

class Order {
    constructor(base, flavoring, addIns = [], toppings = []) {
        this.base = base || "";
        this.flavoring = flavoring || "";
        this.addIns = addIns || [];
        this.toppings = toppings || [];
    }
}

class Customer {
    constructor(name = "", order = Order, orderdesc = "", placed = "", chat, recieve = "", judgings = []) {
        this.name = name || "?";
        this.order = order || null;
        this.orderdesc = orderdesc || "?";
        this.placed = placed || "Thank you.";
        this.chat = chat || true;
        this.recieve = recieve || "That's for me.";
        this.judgings = judgings || [ // Perfect, Good, Okay, BAD
            "This is perfect! Thank you!", 
            "Thank you very much.", 
            "This looks okay... thanks.", 
            "I didn't order this."
        ];
    }
}

// Big Data
let Chima = new Customer(
    "Chima", 
    new Order("Latte", "Original"), 
    "I'll have a regular latte.",
    "Thanks!",
    true, 
    "All ready?",
    [
        "This is perfect! Thank you!", 
        "Thank you very much.", 
        "This looks okay... thanks.", 
        "I didn't order this."
    ]
);

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

function updateFront() {
    if (readycustomers.length == 0) {
        document.getElementById("customer").style.display = 'none';
        startchat.disabled = true;
        startpos.disabled = true;
    }
    else {
        let currcust = readycustomers[0];
        console.log("There's still someone!");

        if (currcust.chat == true) {
            startchat.disabled = false;
        }
        else {
            startchat.disabled = true;
        }
    }
}

// Chat
let chatbox = document.getElementById("dialogue");

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
                document.getElementById("order").disabled = true;
            }
            else if (callflag) {
                callflag = false;
                document.getElementById("delcustomer").style.display = 'block';
                document.getElementById("delcustomer").src = `Assets/Characters/${lines[1][0]}-Static.png`;
                //console.log(`Assets/Characters/${lines[1][0]}-Static.png`);
                let score = judgeDelivery(focuscustomer[0], focuscustomer[1], focuscustomer[2])
                focuscustomer.push(score);
                judgeflag = true;

                let feedback = [[focuscustomer[2].name, null]];
                let accuracy = (focuscustomer[3]/17) * 100;
                if (accuracy == 100) {
                    feedback[0][1] = focuscustomer[2].judgings[0];
                }
                else if (accuracy >= 80) {
                    feedback[0][1] = focuscustomer[2].judgings[1];
                } 
                else if (accuracy >= 50) {
                    feedback[0][1] = focuscustomer[2].judgings[2];
                } 
                else {
                    feedback[0][1] = focuscustomer[2].judgings[3];
                }
                //console.log(feedback);

                setTimeout(() => {
                    chatbox.style.display = "flex";
                    options.style.display = "none";
                    dialogue(feedback, document.getElementById("text"), document.getElementById("textprogress"));
                }, 100);
            }
            else if (judgeflag) {
                judgeflag = false;
                document.getElementById("delcustomer").style.display = 'none';
                document.getElementById("deloptions").style.display = 'flex';
            }
            else if (!tutorial) {
                readycustomers[0].chat = false;
                document.getElementById("chat").disabled = true;
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
        if (ticketindex == null) {
            ticketindex = 0;
        }

        waitingcustomers.push(readycustomers.shift()); // Shift Customers Over

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

let callTickets = function(viewtickets) {
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
    updateFront();
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
    callTickets(document.getElementById("viewtickets"));
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
    if (drinkindex == null) {
        drinkindex = 0;
    }

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
let backfromdel = document.getElementById("backdel");
let deloptions = document.getElementById("deloptions");
let startdelivery = document.getElementById("finorder");

backfromdel.addEventListener("click", function() {
    // Switch back to the Cafe
    document.getElementById("cafe").style.display = 'flex';
    document.getElementById("pickup").style.display = 'none';
});
todelivery.addEventListener("click", function() {
    // Switch to the Delivery Station
    document.getElementById("cafe").style.display = 'none';
    document.getElementById("pickup").style.display = 'flex';
    updateFront();
});

let callDrinks = function(viewdrinks) {
    let existingMessage = viewdrinks.querySelector("p");
    if (existingMessage) {
        existingMessage.remove();
    }

    if (drinks.every(drink => drink === null)) {
        // We got no drinks
        let nodrink = document.createElement("p");

        viewdrinks.style.display = "flex";
        viewdrinks.style.justifyContent = "center";
        viewdrinks.style.alignItems = "center";

        nodrink.textContent = "No available drinks.";
        viewdrinks.appendChild(nodrink);
    }
    else {
        // We got drinks
        let drinkIndex = drinks.findIndex(drink => drink !== null);
        let currentDrink = drinks[drinkIndex];
        let drinkDetails = document.createElement("h3");
        drinkDetails.innerHTML = currentDrink.desc;

        //RETURN to this function and give functionality to images

        viewdrinks.appendChild(drinkDetails);
    }
}

// Delivery Station
let backtodel = document.getElementById("nodel");
let sendorder = document.getElementById("yesdel");

function pairOrder(ticket, drink) {
    console.log(ticket, drink);
    document.getElementById("delivery").style.display = 'none';

    let custoindex = waitingcustomers.findIndex(customer => customer.name === ticket.customerName);
    drinks[drinkindex] = null;
    let nonNullDrinks = drinks.filter(drink => drink !== null);
    for (let i = 0; i < drinks.length; i++) {
        drinks[i] = nonNullDrinks[i] || null;
    }
    let ticustomer = waitingcustomers[custoindex];
    waitingcustomers.splice(custoindex, 1);
    opentickets.splice(ticketindex, 1);
    ticketindex = opentickets.length > 0 ? 0 : null;
    drinkindex = drinks.findIndex(drink => drink !== null);

    callTickets(document.getElementById("showtickets"));
    callDrinks(document.getElementById("showdrinks"));

    let confirmlines = [
        [playername, `I've got a ${drink.desc} for ${ticustomer.name}!`],
        [customername, ticustomer.recieve]
    ]
    callflag = true;
    chatbox.style.display = "flex";
    options.style.display = "none";
    dialogue(confirmlines, document.getElementById("text"), document.getElementById("textprogress"));
    return([ticket, drink, ticustomer]);
}

function judgeDelivery(ticket, drink, customer) {
    let points = 0;
    let comp = customer.order;
    
    // Drink to Order
    if (drink.base === comp.base) {points += 2};
    if (drink.flavoring === comp.flavoring) {points += 2};

    if (drink.addIns.length === comp.addIns.length && drink.addIns.every(addIn => comp.addIns.includes(addIn))) {
        points += 2;
    }
    else if (drink.addIns.some(addIn => comp.addIns.includes(addIn))) {
        points += 1;
    }

    if (drink.toppings.length === comp.toppings.length && drink.toppings.every(topping => comp.toppings.includes(topping))) {
        points += 2;
    }
    else if (drink.toppings.some(topping => comp.toppings.includes(topping))) {
        points += 1;
    }

    // Order to Ticket
    if (ticket.drinkBase === comp.base) {points += 2};
    if (ticket.flavoring === comp.flavoring) {points += 2};

    if (ticket.addIns.length === comp.addIns.length && ticket.addIns.every(addIn => comp.addIns.includes(addIn))) {
        points += 1;
    }

    if (ticket.toppings.length === comp.toppings.length && ticket.toppings.every(topping => comp.toppings.includes(topping))) {
        points += 1;
    }

    // Chat or No Chat
    if (customer.chat) {
        points += 3;
    }

    return points;
}

startdelivery.addEventListener("click", function() {
    deloptions.style.display = 'none';
    document.getElementById("delivery").style.display = 'flex';
    callTickets(document.getElementById("showtickets"));
    callDrinks(document.getElementById("showdrinks"));

    if (opentickets.length == 0 || drinks.every(drink => drink === null)) {
        sendorder.disabled = true;
    }
    else {
        sendorder.disabled = false;
    }
});

backtodel.addEventListener("click", function() {
    deloptions.style.display = '';
    document.getElementById("delivery").style.display = 'none';
});

sendorder.addEventListener("click", function() {
    focuscustomer = pairOrder(opentickets[ticketindex], drinks[drinkindex]);
});

// Regular Run
readycustomers.push(Chima);
customername = readycustomers[0].name;
let order = [[customername, readycustomers[0].orderdesc]];
let tutorialconvo = [ // The tutorial chat convo placeholder
    [customername, "Pleasure to see you! I'm quite glad that I get to train you today. My name's Chima!"],
    [playername, "I'm excited to be here."],
    [customername, "Let's get started, shall we?"]
];
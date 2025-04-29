// Overarching
import { canbeserved } from "./customers.js";
import { Ticket, Drink, Order } from "./structures.js";

let playername = "You"; // RETURN to this and change to base on main menu selection
const optionData = {
    "Bases": ["Latte", "Tea", "Espresso", "Americano"],
    "Flavorings": ["Original", "Matcha", "Chai", "Mocha", "Vanilla"],
    "AddIns": ["Cream", "Ice", "Boba", "Milk", "Sugar"],
    "Toppings": ["Cold Foam", "Chocolate Sauce", "Whipped Cream", "Shaved Chocolate"]
}

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

let order = [[null, null]]; // Get the order

let tutorial = false;
let tutorialconvo = [
    [playername, "Good morning, Miss Chima. How are you today?"],
    ["Chima", "I'm doing well, thanks! How about you?"],
    [playername, "I'm doing alright. A little nervous since it's my first day, but I'm excited to learn!"],
    ["Chima", "I'm happy to hear that. Shall we continue, then?"]
];
let tcheckpoint = [true, true, true, true];

let days = 0;

// Transition
let blackscreen = document.getElementById("transition");
function transition(speed, hold, source, destination) {
    blackscreen.style.transition = `opacity ${speed}s ease`;
    blackscreen.style.opacity = "1";

    setTimeout(() => {
        blackscreen.style.opacity = "0";
    }, hold + speed * 1000);

    setTimeout(() => {
        source.style.display = 'none';
        destination.style.display = 'flex';
    }, speed * 1000);
}

// New Day

// Main Menu
document.getElementById("credits").addEventListener("click", function() {
    alert("Not available yet!");
});

document.getElementById("newgame").addEventListener("click", function() { // Start new game
    transition(0.5, 1, document.getElementById("main-menu"),  document.getElementById("cafe"));
    setTimeout(function() {
        if (tutorial) {
            Tutorial();
        }
        else {
            // Regular Run
            readycustomers.push(canbeserved[0]);
            updateFront();
        }
        console.log(readycustomers[0]);
    }, 0.5 * 1000);
});

// Cafe UI
let options = document.getElementById("options"); // Overarching options div
let startchat = document.getElementById("chat"); // Chat button
let startpos = document.getElementById("order"); // Order button
let todelivery = document.getElementById("todeliver"); // Left
let tobarista = document.getElementById("todrink"); // Right

function updateFront() {
    setTimeout(function() {
        if (readycustomers.length == 0) {
            document.getElementById("customer").style.display = 'none';
            startchat.disabled = true;
            startpos.disabled = true;
        }
        else {
            let currcust = readycustomers[0];
            console.log("There's still someone!");
            document.getElementById("customer").src = `Assets/Characters/${currcust.name}-Static.png`;
    
            if (currcust.chat == true) {
                startchat.disabled = false;
            }
            else {
                startchat.disabled = true;
            }
            
            if (tutorial) {
                startchat.disabled = true;
            }
        }
    }, 0.5 * 1000);
}

// Chat
let chatbox = document.getElementById("dialogue");

function dialogue(lines) {
    // All logic handling the dialogue chat feature
    let button = document.getElementById("textprogress");
    let element = document.getElementById("text");

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
            else if (lines[line][0] == "Tip") {
                document.getElementById("custoname").style.backgroundColor = "mediumturquoise";
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

            if (callflag) { // Handle having called a customer over for a delivery
                callflag = false;
                transition(0.5, 1, document.getElementById("pickup"),  document.getElementById("pickup"));
                setTimeout(function() {
                    document.getElementById("delcustomer").style.display = 'block';
                    document.getElementById("delcustomer").src = `Assets/Characters/${lines[1][0]}-Static.png`;
                }, 0.5 * 1000);
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

                if (tutorial) {
                    feedback.push(["Chima", "Anyway, that's about all you need to know to work here at Latte Days!"]);
                    feedback.push(["Chima", "Please do your absolute best to satisfy the rest of the customers. I really believe you can do it!"]);
                    //readycustomers.push(canbeserved[0]); // The "Try It On Your Own" customer
                    feedback.push([playername, "Thank you!"]);
                    feedback.push(["Chima", "I'll be heading out now, okay? You've got the customers for these next few days!"]);
                    feedback.push([playername, "I'll do my best."]);
                    feedback.push(["Chima", `Alright! See you later.`]);
                    tutorial = false;
                }

                //console.log(feedback);

                setTimeout(() => {
                    chatbox.style.display = "flex";
                    options.style.display = "none";
                    dialogue(feedback);
                }, 0.5 * 1000 + 500);
            }
            else if (judgeflag) { // Handle judging an order and ticket
                judgeflag = false;
                transition(0.5, 1, document.getElementById("pickup"),  document.getElementById("pickup"));
                console.log(waitingcustomers, readycustomers);
                if (waitingcustomers.length == 0 && readycustomers.length == 0) {
                    console.log("No more customers!");
                }
                setTimeout(function() {
                    document.getElementById("delcustomer").style.display = 'none';
                    document.getElementById("deloptions").style.display = 'flex';
                    if (!tutorial && tcheckpoint.includes(false)) {
                        document.getElementById("fence").style.display = 'flex';
                        document.getElementById("fence").style.opacity = "1";
                    }
                }, 0.5 * 1000);
            }

            if(tutorial) { // Based on tutorial checkpoints do some other actions
                if (tcheckpoint[0]) {
                    console.log("To Chat");
                    tcheckpoint[0] = false;
                }
                else if (tcheckpoint[1]) {
                    console.log("To POS");
                    tcheckpoint[1] = false;

                    order = [[readycustomers[0].name, readycustomers[0].orderdesc]];
                    let aboutpos = [
                        ["Chima", "Thanks for the conversation! Now, let's go over using the POS."],
                        ["Chima", "You'll use the POS to write tickets based on a customer's order. Use the buttons to put together the order they ask for!"],
                        ["Chima", "If you don't select anything in the POS, it'll automatically write a ticket for a regular latte. However, it's better practice to write an accurate ticket."],
                        ["Chima", "Why don't you try taking my order now?"],
                        ["Tip", "Use the TAKE ORDER button to access the POS."]
                    ];
                    document.getElementById("order").style.backgroundColor = "pink";
                    document.getElementById("chat").disabled = true;
                    document.getElementById("order").disabled = false;
                    setTimeout(function() {
                        chatbox.style.display = "flex";
                        options.style.display = "none";
                        dialogue(aboutpos);
                    }, 1);
                }
                else if (tcheckpoint[2]) {
                    console.log("Make Drink");
                    tcheckpoint[2] = false;
                }
                else if (tcheckpoint[3]) {
                    tcheckpoint[3] = false
                    startpos.style.backgroundColor = "rgb(243, 180, 63)";
                    document.getElementById("todeliver").disabled = false;
                    document.getElementById("todrink").disabled = false;

                    let sum = [
                        ["Chima", "Good! Now, head over to the drink station to your right. Follow the directions on the machine to create the drink on the ticket you just wrote."],
                        ["Chima", "After you're done, the delivery station will be all the way to your left. Call me over with the ticket you wrote and we'll see how well you did!"],
                        [playername, "Understood! I'll get right to it!"],
                        ["Tip", "Use the RIGHT ARROW to get to the drink machine and make a new drink. Then, click the LEFT ARROW to go back to the counter, and then press the LEFT ARROW again to go to the delivery station."],
                        ["Tip", "Pair a ticket with a drink to submit an order."]
                    ];
                    setTimeout(function() {
                        chatbox.style.display = "flex";
                        options.style.display = "none";
                        dialogue(sum);
                    }, 1);
                }
            }
        }
    }

    function buttonHandle() {
        if (posflag) { // Handle creating a ticket here
            document.getElementById("pos").style.display = "none";
            posflag = false;
            setTicket();
            console.log(opentickets);
            document.getElementById("order").disabled = true;
            document.getElementById("chat").disabled = true;
        }

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

        if (document.getElementById("chat").disabled == true) {
            readycustomers[0].chat = true;
        }
        else {
            readycustomers[0].chat = false;
        }
        document.getElementById("chat").disabled = true;

        waitingcustomers.push(readycustomers.shift()); // Shift Customers Over

        Selections.Bases = null;
        Selections.Flavorings = null;
        Selections.AddIns = [];
        Selections.Toppings = [];

        console.log(readycustomers, waitingcustomers);
    }

    button.addEventListener('click', buttonHandle);

    displayText(); // Start displaying the first line
}

function pickChat(customer) { // Taking conditional statements into account, decide what each character should say
    let possibles = [];
    let inquestion = customer.interactions;

    for (let i = 0; i < inquestion.length; i++) {
        if (inquestion[i].conditional) {
            possibles.push(inquestion[i].dialogue);
        }
    }

    //console.log(possibles);
    let select = Math.floor(Math.random() * possibles.length);
    return possibles[select];
}

startchat.addEventListener("click", function() {
    // Upon click, initiate chat
    chatbox.style.display = "flex";
    options.style.display = "none";
    if (tutorial) {
        dialogue(tutorialconvo);
        startchat.style.backgroundColor = "rgb(243, 180, 63)";
    }
    else {
        dialogue(pickChat(readycustomers[0]));
    }
    startchat.disabled = true;
    readycustomers[0].chat = false;
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

    //console.log(selectTarget); // Check the update

    if (pos) {
        writeUp();
    }
    else {
        buildDesc();
        if (DrinkSelections.Flavorings == "Original") {
            document.getElementById("drinkpreview").src = `Assets/Drinks/${DrinkSelections.Bases}.png`;
        }
        else {
            document.getElementById("drinkpreview").src = `Assets/Drinks/${DrinkSelections.Bases}-${DrinkSelections.Flavorings}.png`;
        }
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
    customername = readycustomers[0].name;
    if (tutorial) {
        order = [
            ["Chima", "I'll have a regular latte."],
            ["Chima", "Alright! Let's continue."]
        ]
    }
    else {
        order = [
            [readycustomers[0].name, readycustomers[0].orderdesc],
            [readycustomers[0].name, readycustomers[0].placed]
        ];
    }
    dialogue(order);
});

// Shift Barista
let backtocaf = document.getElementById("backbar");
let createdrink = document.getElementById("newdrink");
let baroptions = document.getElementById("baroptions");

let callTickets = function(viewtickets) {
    viewtickets.innerHTML = "";

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
    transition(0.5, 1, document.getElementById("cafe"),  document.getElementById("barista"));
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
    transition(0.5, 1, document.getElementById("barista"),  document.getElementById("cafe"));
});

// Open create drinks
createdrink.addEventListener("click", function() {
    baroptions.style.display = 'none';
    document.getElementById("drinkstation").style.display = 'flex';
    callTickets(document.getElementById("viewtickets"));
    
    document.getElementById("custodrink").style.display = "none";
    document.getElementById("makedrink").style.display = "flex";

    // Adjust description based on what's available in DrinkSelections at the moment
    buildDesc();
    if (DrinkSelections.Flavorings == "Original") {
        document.getElementById("drinkpreview").src = `Assets/Drinks/${DrinkSelections.Bases}.png`;
    }
    else {
        document.getElementById("drinkpreview").src = `Assets/Drinks/${DrinkSelections.Bases}-${DrinkSelections.Flavorings}.png`;
    }
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
    for(let i = 0; i < DrinkSelections.AddIns.length; i++) {
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
            for(let i = 0; i < nonex.length; i++) {
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
            for(let i = 0; i < DrinkSelections.Toppings.length; i++) {
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
    transition(0.5, 1, document.getElementById("pickup"),  document.getElementById("cafe"));
});
todelivery.addEventListener("click", function() {
    // Switch to the Delivery Station
    transition(0.5, 1, document.getElementById("cafe"),  document.getElementById("pickup"));
    updateFront();
});

let callDrinks = function(viewdrinks) {
    viewdrinks.innerHTML = "";

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
        viewdrinks.innerHTML = '';

        let drinkIndex = drinks.findIndex(drink => drink !== null);
        let currentDrink = drinks[drinkIndex];
        let drinkDetails = document.createElement("h3");
        drinkDetails.innerHTML = currentDrink.desc;

        let drinkview = document.createElement("img");
        if (currentDrink.flavoring == "Original") {
            drinkview.src = `Assets/Drinks/${currentDrink.base}.png`;
        }
        else {
            drinkview.src = `Assets/Drinks/${currentDrink.base}-${currentDrink.flavoring}.png`;
        }

        viewdrinks.appendChild(drinkDetails);
        viewdrinks.appendChild(document.createElement("br"));
        viewdrinks.appendChild(drinkview);
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
    dialogue(confirmlines);
    ticustomer.visits++;
    console.log(ticustomer);

    return([ticket, drink, ticustomer]);
}

function judgeDelivery(ticket, drink, customer) {
    let points = 0;
    let comp = customer.order;
    if (tutorial) {
        comp = new Order("Latte", "Original");
    }
    console.log(comp);

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

// Tutorial
function Tutorial() {
    // Set it up!
    console.log("Go ahead!");
    readycustomers.push(canbeserved[0]);
    customername = readycustomers[0].name;
    options.style.display = 'none';

    // Initial Conversation
    let convo = [
        [customername, `Good morning!`],
        [playername, "Good morning!"],
        [customername, "So, it's your first day! I'm excited to teach you."],
        [customername, "Let's jump right into it. I'll show you the ropes."],
        [playername, "I'm ready!"],
        [customername, "Great! First things first, let's start with what to do when meeting others."],
        [customername, "It's important to engage with customers before taking their order. Don't be shy and try to strike up a conversation!"],
        [customername, "Sometimes, that can be the difference between a good and bad experience."],
        ["Tip", "Use the CHAT button to have a conversation with a customer."]
    ];
    chatbox.style.display = "flex";
    dialogue(convo);
    document.getElementById("chat").style.backgroundColor = "pink";

    document.getElementById("order").disabled = true;
    document.getElementById("todeliver").disabled = true;
    document.getElementById("todrink").disabled = true;
}
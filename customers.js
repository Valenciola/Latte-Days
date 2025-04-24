import { Customer, Order, Interaction } from "./structures.js";

/*
class Customer { // Add first visiting day, a special order, friendship level buffer (how fast you can be friends)
    constructor(name = "", order = Order, orderdesc = "", placed = "", chat, recieve = "", judgings = []) {
        this.name = name || "?";
        this.order = order || null;
        this.orderdesc = orderdesc || "?";
        this.placed = placed || "Thank you.";
        this.chat = chat || true; // Flag for if they're chattable or not, reset upon day assignment
        this.recieve = recieve || "That's for me.";
        this.judgings = judgings || [ // Perfect, Good, Okay, BAD
            "This is perfect! Thank you!", 
            "Thank you very much.", 
            "This looks okay... thanks.", 
            "I didn't order this."
        ];
    }
}
*/

// Characters
let Chima = new Customer(
    // Calm, kind, friendly
    "Chima", 
    new Order("Espresso", "Mocha", [], ["Cold Foam", "Chocolate Sauce"]), 
    "I'd like a mocha espresso topped with cold foam and chocolate sauce, please!",
    "Thanks!",
    true, 
    "All ready?",
    [
        "This is perfect! Thank you!", 
        "Thank you very much.", 
        "This looks okay... thanks.", 
        "I didn't order this..."
    ]
);

let Shon = new Customer(
    // Hyper, extroverted, opposite of Devon
    "Shon",
    new Order("Americano", "Chai", ["Ice"]), 
    "I'd like an iced chai Americano, please!",
    "'Preciate it!",
    true, 
    "Oh, my drink is ready!",
    [
        "Yes! I've been waiting for this! Thank you so much!", 
        "This looks good! Can't wait to enjoy it. Thanks!", 
        "This seems a bit weird, but I'll take it anyway.", 
        "So... I don't recall making this order, actually..."
    ]
);

let Devon = new Customer(
    // Calm, introverted, opposite of Shon
    "Devon",
    new Order("Tea", "Matcha", ["Milk"]), 
    "I'll have a matcha tea with milk, please",
    "Thank you.",
    true, 
    "I'm here.",
    [
        "Just as I expected. I appreciate it.", 
        "Thank you. Have a nice day.", 
        "...This is a bit different than expected...", 
        "I didn't order this. Are you sure you heard me correctly?"
    ]
);

let canbeserved = [Chima]; // Deal with this variable and make it update dynamically depending on everyone's first day

export {canbeserved};
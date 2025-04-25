import { Customer, Order, Interaction } from "./structures.js";

/*
class Customer { 
    // A special order, friendship level buffer (how fast you can be friends), friendship level, interactions
    constructor(name = "", firstday, visits, order = Order, orderdesc = "", placed = "", chat = Boolean, interactions = [], recieve = "", judgings = []) {
        this.name = name || "?"; // Character name
        this.firstday = firstday || 0; // The first day they become servable
        this.visits = visits || 0; // The amount of times they're visited

        this.order = order || null; // Character's default order
        this.orderdesc = orderdesc || "?"; // The way the character says the order
        this.placed = placed || "Thank you."; // What the character says after you submit the order

        this.chat = chat || true; // Flag for if they're chattable or not, reset upon day assignment
        this.interactions = interactions || [
            new Interaction(true, [
                [name, "Is this okay?"]
            ])
        ];

        this.recieve = recieve || "That's for me."; // What they say upon a call
        this.judgings = judgings || [ // Lines upon judging order: Perfect, Good, Okay, BAD
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
    1,
    0,
    new Order("Espresso", "Mocha", [], ["Cold Foam", "Chocolate Sauce"]), 
    "I'd like a mocha espresso topped with cold foam and chocolate sauce, please!",
    "Thanks!",
    true, 
    [
        new Interaction(true, [ // Test default 1
            ["Chima", "Everything good with you?"],
            ["You", "Yeah, everything's alright."]
        ]),
        new Interaction(true, [ // Test default 2
            ["Chima", "Hey, what's up?"],
            ["You", "Nothing, really. Hoping I'm doing my job well..."],
            ["Chima", "I already think you're doing just fine."],
            ["You", "That's kind of you to say."]
        ])
    ],
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
    1,
    0,
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
    2,
    0,
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
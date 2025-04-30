import { Customer, Order, Interaction } from "./structures.js";
let name = "You";

/* A little help...
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

// Characters (this is gonna fill up so fast ;-;)
const Chima = new Customer(
    // Calm, kind, friendly
    "Chima", 
    1,
    0,
    new Order("Espresso", "Mocha", [], ["Cold Foam", "Chocolate Sauce"]), 
    "I'd like a mocha espresso topped with cold foam and chocolate sauce, please!",
    "Thanks!",
    true, 
    [ // Chats
        new Interaction(true, [ // Test default 1
            ["Chima", "Everything good with you?"],
            [name, "Yeah, everything's alright."]
        ]),
        new Interaction(true, [ // Test default 2
            ["Chima", "Hey, what's up?"],
            [name, "Nothing, really. Hoping I'm doing my job well..."],
            ["Chima", "I already think you're doing just fine."],
            [name, "That's kind of you to say."]
        ]),
        new Interaction(true, [ // Test default 3
            ["Chima", `${name}, are you doing alright? I hope you're handling things well on your own.`],
            [name, "Yeah, I'm okay, Miss Chima! You taught me well, so things are going just fine here."],
            ["Chima", "What a relief. In that case, I'll give you my coffee order now."]
        ])
    ],
    "All ready?",
    [ // Judges
        "This is perfect! Thank you!", 
        "Thank you very much.", 
        "This looks okay... thanks.", 
        "I didn't order this..."
    ]
);

const Shon = new Customer(
    // Hyper, extroverted, opposite of Devon
    "Shon",
    1,
    0,
    new Order("Americano", "Chai", ["Ice"]), 
    "I'd like an iced chai Americano, please!",
    "'Preciate it!",
    true, 
    [ // Chats
        new Interaction(true, [
            ["Shon", "Yeah so I don't exactly exist in-game yet..."]
        ]),
        new Interaction(true, [
            [name, "How's it going?"],
            ["Shon", "It would be better if I wasn't a disembodied voice..."]
        ])
    ],
    "Oh, my drink is ready!",
    [ // Judges
        "Yes! I've been waiting for this! Thank you so much!", 
        "This looks good! Can't wait to enjoy it. Thanks!", 
        "This seems a bit weird, but I'll take it anyway.", 
        "So... I don't recall making this order, actually..."
    ]
);

const Devon = new Customer(
    // Calm, introverted, opposite of Shon
    "Devon",
    2,
    0,
    new Order("Tea", "Matcha", ["Milk"]), 
    "I'll have a matcha tea with milk, please",
    "Thank you.",
    true, 
    [ // Chats
        new Interaction(true, [
            ["Devon", "Hi there, how goes it?"],
            [name, "Things are a bit quiet around here, but otherwise good."],
            ["Devon", "Yes. Actually, I prefer it that way."],
            [name, "Quiet?"],
            ["Devon", "Yeah."]
        ]),
        new Interaction(true, [
            ["Devon", "Hello."],
            [name, "Hi! How's it going?"],
            ["Devon", "Things are good for now, but it's clear that there's some work to be done around here..."],
            [name, "Pardon?"]
        ])
    ],
    "I'm here.",
    [ // Judges
        "Just as I expected. I appreciate it.", 
        "Thank you. Have a nice day.", 
        "...This is a bit different than expected...", 
        "I didn't order this. Are you sure you heard me correctly?"
    ]
);

let canbeserved = [Chima, Shon, Devon]; // Deal with this variable and make it update dynamically depending on everyone's first day

export {canbeserved};
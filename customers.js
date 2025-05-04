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
        new Interaction((customer) => customer.visits == 0, [ // In case first time visit
            ["Chima", `Hey there, ${name}. How are you?`],
            [name, "I'm doing okay! I think I'm starting to get more comfortable with everything."],
            ["Chima", "Oh, how nice! I'm glad to know that there's someone else I can trust to run the shop."]
        ]),
        new Interaction((customer) => customer.visits >= 1, [ // Test default 1
            ["Chima", "Everything good with you?"],
            [name, "Yeah, everything's alright."]
        ]),
        new Interaction((customer) => customer.visits >= 1, [ // Test default 2
            ["Chima", "Hey, what's up?"],
            [name, "Nothing, really. Hoping I'm doing my job well..."],
            ["Chima", "I already think you're doing just fine."],
            [name, "That's kind of you to say."]
        ]),
        new Interaction((customer) => customer.visits >= 1, [ // Test default 3
            ["Chima", `${name}, are you doing alright? I hope you're handling things well on your own.`],
            [name, "Yeah, I'm okay, Miss Chima! You taught me well, so things are going just fine here."],
            ["Chima", "What a relief. In that case, I'll give you my coffee order now."]
        ]),
        new Interaction((customer, others) => customer.visits >= 1 && others.find(x => x.name == "Shon")?.visits > 0 && others.find(x => x.name == "Devon")?.visits > 0, [
            [name, "Miss Chima, you've met Shon and Devon before, right?"],
            ["Chima", "Yes, I have. Did you know they're twins?"],
            [name, "I didn't until I met Devon for the first time and thought he was Shon..."],
            ["Chima", "Haha! I made the same mistake the first time too!"],
            [name, "It was a bit embarassing, but he was really gracious about it."],
            ["Chima", "Yep! That's Devon for you."]
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
        new Interaction((customer) => customer.visits == 0, [ // First time visit
            ["Shon", "Hey there! How's it going?"],
            [name, "Things are going alright! How about you?"],
            ["Shon", "Everything is good with me! By the way, I come by here often, but I don't think I've seen you before..."],
            [name, "Ah, yes. I just started working here. Actually, it's my first day!"],
            ["Shon", "Oh, that's nice! Well, then, it's nice to meet you. I'm Shon."],
            [name, `${name}. Nice to meet you as well! Please, let me take your order.`]
        ]),
        new Interaction((customer) => customer.visits >= 1, [
            ["Shon", "Yeah so I don't exactly exist in-game yet..."],
            [name, "In-game? What do you mean by that?"]
        ]),
        new Interaction((customer) => customer.visits >= 1, [
            [name, "How's it going?"],
            ["Shon", "It would be better if I wasn't a disembodied voice..."]
        ]),
        new Interaction((customer, others) => customer.visits >= 1 && others.find(x => x.name == "Devon")?.visits > 0, [
            ["Shon", `${name}! Hey there! What's up?`],
            [name, "Not much. You know, I didn't know you had a twin brother."],
            ["Shon", "Oh, yeah! So you met Devon, then?"],
            [name, "Yeah... Actually, I thought he was you."],
            ["Shon", "AHAHAHA NO WAY!"],
            ["Shon", "I mean, I completely believe that since we look so alike but it's so hilarious because he usually gets confused for me but I hardly get mistaken for him. It's kind of ironic."],
            [name, "Oh yeah? How interesting..."]
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
        new Interaction((customer, others) => customer.visits == 0 && others.find(x => x.name == "Shon")?.visits > 0, [ // First time visit (should be)
            [name, "Oh, it's Shon, right? Nice to see you again!"],
            ["?", "...?"],
            [name, "..."],
            ["Devon", "Oh! I see where the confusion is. Actually, my name is Devon. I'm Shon's older twin."],
            [name, "Ah... My bad! Nice to meet you, Devon."],
            ["Devon", "Haha, no worries. I get it a lot."]
        ]),
        new Interaction((customer) => customer.visits >= 1, [
            ["Devon", "Hi there, how goes it?"],
            [name, "Things are a bit quiet around here, but otherwise good."],
            ["Devon", "Yes. Actually, I prefer it that way."],
            [name, "Quiet?"],
            ["Devon", "Yeah."]
        ]),
        new Interaction((customer) => customer.visits >= 1, [
            ["Devon", "Hello."],
            [name, "Hi! How's it going?"],
            ["Devon", "Things are good for now, but it's clear that there's some work to be done around here..."],
            [name, "Pardon?"]
        ])
    ],
    "I'm here.",
    [ // Judges
        "Just as I expected! I appreciate it.", 
        "Thank you. Have a nice day.", 
        "...This is a bit different than expected...", 
        "I didn't order this. Are you sure you heard me correctly?"
    ]
);

const masterList = [Chima, Shon, Devon];
let canbeserved = []; // Deal with this variable and make it update dynamically depending on everyone's first day
let day = 0;

function updateList() { // Update servable characters based on what day it is
    canbeserved.length = 0;
    day++;
    //console.log(day);
    for (let i = 0; i < masterList.length; i++) {
        if (masterList[i].firstday <= day) {
            canbeserved.push(masterList[i]);
        }
    }
    //console.log("Servables", canbeserved);
};

export {canbeserved, updateList};
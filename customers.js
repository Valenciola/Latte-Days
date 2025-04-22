import { Customer, Order } from "./structures.js";

// Characters
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

let Shon = new Customer(
    "Shon",
    new Order("Americano", "Chai", ["Ice"]), 
    "I'd like an iced chai Americano, please!",
    "'Preciate it!",
    true, 
    "Oh, my drink is ready!",
    [
        "This is perfect! Thank you!", 
        "Thank you very much.", 
        "This looks okay... thanks.", 
        "I didn't order this."
    ]
);

let Devon = new Customer(
    "Devon",
    new Order("Tea", "Matcha", ["Milk"]), 
    "I'll have a matcha tea with milk, please",
    "Thank you.",
    true, 
    "I'm here.",
    [
        "This is perfect! Thank you!", 
        "Thank you very much.", 
        "This looks okay... thanks.", 
        "I didn't order this."
    ]
);

let canbeserved = [Chima];

export {canbeserved};
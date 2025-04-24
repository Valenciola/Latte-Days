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
    // A special order, friendship level buffer (how fast you can be friends), friendship level, interactions
    constructor(name = "", firstday, visits, order = Order, orderdesc = "", placed = "", chat = Boolean, recieve = "", judgings = []) {
        this.name = name || "?"; // Character name
        this.firstday = firstday || 0; // The first day they become servable
        this.visits = visits || 0; // The amount of times they're visited

        this.order = order || null; // Character's default order
        this.orderdesc = orderdesc || "?"; // The way the character says the order
        this.placed = placed || "Thank you."; // What the character says after you submit the order

        this.chat = chat || true; // Flag for if they're chattable or not, reset upon day assignment

        this.recieve = recieve || "That's for me."; // What they say upon a call
        this.judgings = judgings || [ // Lines upon judging order: Perfect, Good, Okay, BAD
            "This is perfect! Thank you!", 
            "Thank you very much.", 
            "This looks okay... thanks.", 
            "I didn't order this."
        ];
    }
}

class Interaction { // Each character should keep an array of these (to be sifted at the chat button)
    constructor(conditional = Boolean, dialogue = []) {
        this.conditional = conditional || false;
        this.dialogue = dialogue || [
            ["Name", "Empty"]
        ];
    }
}

export {Ticket, Drink, Order, Customer, Interaction};
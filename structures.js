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

class Customer { // Add first visiting day, a special order, friendship level buffer (how fast you can be friends)
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

export {Ticket, Drink, Order, Customer};
// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      }
    });
  });
}


// Install input filters.
var x = document.getElementsByClassName("positive_integer");
var i;
for (i = 0; i < x.length; i++) {
    setInputFilter(x[i], function(value) {
        return /^\d*$/.test(value); });
}

function getRndInteger(min, max) {
    //both min and max includsive
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

var creature_list = {
    'wolf': {num_dice:2, die_value:4, hit_mod:4, dmg_mod:2}
};

document.getElementById("roll_attacks_button").addEventListener("click", (e) => {
    var total_damage = 0;
    var adv = document.getElementById("advantage_disadvantage").value;
    var creature_string = document.getElementById("creature").value;
    var AC = document.getElementById("target_AC").value;
    var hits = 0;
    var crits = 0;
    var log = '';
    var roll_1, roll_2, roll, damage;
    if (creature_string === 'custom') {
            var creature = {};
    } else {
        var creature = creature_list[creature_string];
    }
    log += 'Rolling ' + document.getElementById("number_of_attacks").value
    if (adv === 'advantage') {
        log += ' attacks with advantage\n';
    } else if (adv === 'disadvantage') {
        log += ' attacks with disadvantage\n';
    } else {
        log += ' attacks flat\n';
    }
    for (i = 0; i < Number(document.getElementById("number_of_attacks").value); i++) {
        roll_1 = getRndInteger(1, 20);
        if (adv === 'advantage') {
            roll_2 = getRndInteger(1, 20);
            roll = Math.max(roll_1, roll_2);
            log += 'Rolled ' + roll_1.toString() + ', ' + roll_2.toString() + ', used ' + roll.toString();
        } else if (adv === 'disadvantage') {
            roll_2 = getRndInteger(1, 20);
            roll = Math.min(roll_1, roll_2);
            log += 'Rolled ' + roll_1.toString() + ' and ' + roll_2.toString() + ', used ' + roll.toString();
        } else {
            roll = roll_1;
            log += 'Rolled ' + roll_1;
        }
        if (roll === 20) {
            crits++;
            hits++;
            damage = creature.dmg_mod
            for (j = 0; j < 2*creature.num_dice; j++) {
                damage += getRndInteger(1, creature.die_value);
            }
            log += ', crit! Does ' + damage.toString() + ' damage.\n'
        } else if (roll == 1) {
            damage = 0;
            log += ', total miss.\n'
        } else if (roll + creature.hit_mod >= AC) {
            hits++;
            damage = creature.dmg_mod
            for (j = 0; j < creature.num_dice; j++) {
                damage += getRndInteger(1, creature.die_value); 
            }
            log += ', hit. Does ' + damage.toString() + ' damage.\n'
        } else {
            damage = 0;
            log += ', miss.\n'
        }
        total_damage += damage;
    }
    document.getElementById("damage").innerHTML = total_damage;
    document.getElementById("num_hits").innerHTML = hits;
    document.getElementById("num_crits").innerHTML = crits;
    document.getElementById("log").innerHTML = log;
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../sw.js').then( () => {
            console.log('Service Worker Registered')
        })
    })
}
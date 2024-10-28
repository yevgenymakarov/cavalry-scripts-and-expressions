/* {cavalry script} */

/*
    Custom Easing Functions
    Sets a custom easing expression for selected keyframes.
*/

const color_text = ui.getThemeColor("Text");
const color_numeric_field = ui.getThemeColor("Window");

let settings = {}; /* store user settings */

function save_settings() {
    let id = btn_function.getText();
    let value = btn_option.getValue();

    settings[id] = value;
}

function getFunction(id, value) {
    switch (id) {
        case "Back Ease In":
            return `var s := ${value};
(s + 1) * t ^ 3 - s * t ^ 2;`;
        case "Back Ease Out":
            return `var s := ${value};
1 + (s + 1) * pow(t - 1, 3) + s * pow(t - 1, 2);`;
        case "Back Ease In & Out":
            return `var s := ${value} * 1.525;
t < 0.5
  ? 2 * pow(t, 2) * ((s + 1) * 2 * t - s)
  : 1 + 2 * pow(t - 1, 2) * ((s + 1) * 2 * (t - 1) + s);`;
        case "Elastic Ease In":
            return `var p := ${1/value};
- pow(2, -10 * (1 - t)) * sin(2 * pi * ((1 - t) / p - 0.25));`;
        case "Elastic Ease Out":
            return `var p := ${1/value};
1 + pow(2, -10 * t) * sin(2 * pi * (t / p - 0.25));`;
        case "Elastic Ease In & Out":
            return `var p := ${1/value};
if (t < 0.5) {
    - pow(2, -10 * (1 - 2 * t)) * sin(2 * pi * ((1 - 2 * t) / p - 0.25)) / 2;
} else {
    1 + pow(2, -10 * (2 * t - 1)) * sin(2 * pi * ((2 * t - 1) / p - 0.25)) / 2;
}`;
        case "Bounce Ease In":
            return `var a := ${value};
var f := (1 - t);
if (f < 4 / 11) {
    1 - 7.5625 * f ^ 2;
} else if (f < 8 / 11) {
    a * (1 - 7.5625 * pow(f - 6 / 11, 2) - 0.75);
} else if (f < 10 / 11) {
    a * (1 - 7.5625 * pow(f - 9 / 11, 2) - 0.9375);
} else {
    a * (1 - 7.5625 * pow(f - 21 / 22, 2) - 0.984375);
}`;
        case "Bounce Ease Out":
            return `var a := ${value};
if (t < 4 / 11) {
    7.5625 * t ^ 2;
} else if (t < 8 / 11) {
    1 - a * (1 - 7.5625 * pow(t - 6 / 11, 2) - 0.75);
} else if (t < 10 / 11) {
    1 - a * (1 - 7.5625 * pow(t - 9 / 11, 2) - 0.9375);
} else {
    1 - a * (1 - 7.5625 * pow(t - 21 / 22, 2) - 0.984375);
}`;
        case "Bounce Ease In & Out":
            return `var a := ${value};
if (t < 0.5) {
    var f := (1 - 2 * t);
    if (f < 4 / 11) {
        (1 - 7.5625 * f ^ 2) / 2;
    } else if (f < 8 / 11) {
        a * (1 - 7.5625 * pow(f - 6 / 11, 2) - 0.75) / 2;
    } else if (f < 10 / 11) {
        a * (1 - 7.5625 * pow(f - 9 / 11, 2) - 0.9375) / 2;
    } else {
        a * (1 - 7.5625 * pow(f - 21 / 22, 2) - 0.984375) / 2;
    }
} else {
    var f := (t * 2 - 1);
    if (f < 4/11) {
        (1 + (7.5625 * f ^ 2)) / 2;
    } else if (f < 8/11) {
        1 - a * (1 - 7.5625 * pow(f - 6/11, 2) - 0.75) / 2;
    } else if (f < 10/11) {
        1 - a * (1 - 7.5625 * pow(f - 9/11, 2) - 0.9375) / 2;
    } else {
        1 - a * (1 - 7.5625 * pow(f - 21/22, 2) - 0.984375) / 2;
    }
}`;
        case "Circular Ease In":
            return `var n := ${value};
1 - sqrt(1 - t ^ n);`;
        case "Circular Ease Out":
            return `var n := ${value};
sqrt(1 - pow(1 - t, n));`;
        case "Circular Ease In & Out":
            return `var n := ${value};
t < 0.5
  ? (1 - sqrt(1 - pow(2 * t, n))) / 2
  : (1 + sqrt(1 - pow(2 * (1 - t), n))) / 2;`;
        case "Polynomial Ease In":
            return `var n := ${value};
t ^ n;`;
        case "Polynomial Ease Out":
            return `var n := ${value};
1 - pow(1 - t, n);`;
        case "Polynomial Ease In & Out":
            return `var n := ${value};
t < 0.5 ? pow(2, n - 1) * pow(t, n) : 1 - pow(2, n - 1) * pow(1 - t, n);`;
        case "Atan Ease In":
            return `var s := ${value};
1 + atan((t - 1) * s) / atan(s);`;
        case "Atan Ease Out":
            return `var s := ${value};
atan(t * s) / atan(s);`;
        case "Atan Ease In & Out":
            return `var s := ${value};
(1 + atan((2 * t - 1) * s) / atan(s)) / 2;`;
        default:
            console.error("Easing function not found");
    }
}

function apply() {
    let id = btn_function.getText() + " " + btn_type.getText();
    let value = btn_option.getValue();

    let expr = getFunction(id, value);

    let selKeys = api.getSelectedKeyframeIds();

    selKeys.forEach((keyId) => {
        let keyData = api.get(keyId, "data");

        keyData.easing = 34;
        keyData.exprEasing = expr;

        api.set(keyId, {"data": keyData});
    });
}

function reset() {
    let selKeys = api.getSelectedKeyframeIds();

    selKeys.forEach((keyId) => {
        let keyData = api.get(keyId, "data");

        keyData.easing = 0;
        keyData.exprEasing = "";

        api.set(keyId, {"data": keyData});
    });
}

/* update ui */

function set_option() {
    let id = btn_function.getText();
    let value = settings[id];

    function set(text, min, max, step, value) {
        txt_option.setText(text);
        btn_option.setMin(min);
        btn_option.setMax(max);
        btn_option.setStep(step);
        btn_option.setValue(value);
    }

    switch (id) {
      case "Back":
        set("Overshoot", 0, 100, 0.01, value ?? 2);
        break;
      case "Elastic":
        set("Frequency", 1, 10, 0.01, value ?? 3);
        break;
      case "Bounce":
        set("Amplitude", 0, 4, 0.01, value ?? 1);
        break;
      case "Polynomial":
        set("Power", 1, 100, 0.01, value ?? 5);
        break;
      case "Circular":
        set("Power", 1, 100, 0.01, value ?? 2);
        break;
      case "Atan":
        set("Value", 1, 100, 0.1, value ?? 10);
        break;
      default:
        console.error("Unsupported easing function");
    }
}

function set_footer() {
    let enabled = (api.getSelectedKeyframeIds().length != 0);

    btn_reset.setEnabled(enabled);
    btn_apply.setEnabled(enabled);
}

function Callbacks() { 
    this.onKeySelectionChanged = function () {
        set_footer();
    }
}

/* draw ui */

function ui_label(txt) {
    let btn = new ui.Label(txt);
        btn.setTextColor(color_text);
    return btn;
}

function ui_select(txt) {
    let btn = new ui.DropDown();
        btn.setSize(166, 16);
        btn.setToolTip(txt);
    return btn;
}

function ui_wrap(btn) { /* round corners */
    let sub = new ui.HLayout();
        sub.setMargins(3, 0, 3, 0);
        sub.add(btn);
    let box = new ui.Container();
        box.setBackgroundColor(color_numeric_field);
        box.setRadius(2, 2, 2, 2);
        box.setSize(80, 16);
        box.setLayout(sub);
    return box;
}

function ui_spacer() {
    let box = new ui.Container();
        box.setSize(80, 16);
    return box;
}

/* function */
let txt_function = ui_label("Function");
let btn_function = ui_select("Set the base easing function");
    btn_function.onValueChanged = function () {
        set_option();
        apply();
    };
    btn_function.addEntry("Back");
    btn_function.addEntry("Elastic");
    btn_function.addEntry("Bounce");
    btn_function.addEntry("Polynomial");
    btn_function.addEntry("Circular");
    btn_function.addEntry("Atan");
let row_function = new ui.HLayout();
    row_function.add(txt_function, btn_function);

/* type */
let txt_type = ui_label("Type");
let btn_type = ui_select("Set the easing type");
    btn_type.onValueChanged = function () {
        apply();
    };
    btn_type.addEntry("Ease In");
    btn_type.addEntry("Ease Out");
    btn_type.addEntry("Ease In & Out");
let row_type = new ui.HLayout();
    row_type.add(txt_type, btn_type);

/* option */
let txt_option = ui_label("Value");
let btn_option = new ui.NumericField(0);
    btn_option.setToolTip("Set the variable function parameter");
    btn_option.setType(1);
    btn_option.onValueChanged = function () {
        save_settings();
        apply();
    };
let box_option = ui_wrap(btn_option);
let box_spacer = ui_spacer(); /* place for second button */
let row_option = new ui.HLayout();
    row_option.setSpaceBetween(6); /* space between double field */
    row_option.add(txt_option, box_option, box_spacer);

    set_option(); /* set default values */

/* buttons */
let btn_reset = new ui.Button("Reset");
    btn_reset.setToolTip("Clear the selected keyframes easing");
    btn_reset.onClick = function () {
        reset();
    };
let btn_apply = new ui.Button("Apply");
    btn_apply.setToolTip("Set easing to selected keyframes");
    btn_apply.onClick = function () {
        apply();
    };
let row_footer = new ui.HLayout();
    row_footer.add(btn_reset, btn_apply);

    set_footer(); /* set default enable state */

/* root */
let layout = new ui.VLayout();
    layout.setSpaceBetween(0);
    layout.add(row_function, row_type, row_option, row_footer);
    layout.addStretch();

ui.add(layout);
ui.addCallbackObject(new Callbacks);
ui.setTitle("Easing+");
ui.show();

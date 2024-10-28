/* {cavalry script} */

/*
    Built-in Easing Functions
    Sets the built-in easings for selected keyframes.
*/

const color_text = ui.getThemeColor("Text");
const color_numeric_field = ui.getThemeColor("Window");

const easings = [
    {"type": "None", "id": 0},
    {"type": "Quadratic", "id": 1},
    {"type": "Cubic", "id": 4},
    {"type": "Quartic", "id": 7},
    {"type": "Quintic", "id": 10},
    {"type": "Sine", "id": 13},
    {"type": "Circular", "id": 16},
    {"type": "Exponential", "id": 19},
    {"type": "Back", "id": 28},
    {"type": "Elastic", "id": 22},
    {"type": "Small Elastic", "id": 25},
    {"type": "Bounce", "id": 31},
    {"type": "Custom", "id": 34}
];

function apply() {
    let base = btn_function.getValue();
    let baseId = easings[base].id;

    let type = (baseId == 0 || baseId == 34) ? 0 : btn_type.getValue();
    let typeId = baseId + type;

    let selKeys = api.getSelectedKeyframeIds();

    selKeys.forEach((keyId) => {
        let keyData = api.get(keyId, "data");

        keyData.easing = typeId; /* set magic easing type */

        if (typeId == 34) { /* set custom easing expression */
            let expr = btn_custom.getText();

            if (expr) {
                keyData.exprEasing = expr;
            } else {
                btn_custom.setText(keyData.exprEasing ?? '');
            }
        }

        api.set(keyId, {"data": keyData});
    });
}

function reset() {
    btn_function.setValue(0);

    btn_type.setValue(0);
    btn_type.setEnabled(false);
    btn_custom.clear();

    row_type.setHidden(false);
    row_custom.setHidden(true);

    let selKeys = api.getSelectedKeyframeIds();

    selKeys.forEach((keyId) => {
        let keyData = api.get(keyId, "data");

        keyData.easing = 0;
        keyData.exprEasing = "";

        api.set(keyId, {"data": keyData});
    });
}

function getFunction(id) {
    switch (id) {
        case "None":
            return ``;
        case "Quadratic Ease In":
            return `t ^ 2;`;
        case "Quadratic Ease Out":
            return `1 - pow(1 - t, 2);`;
        case "Quadratic Ease In & Out":
            return `t < 0.5 ? 2 * t ^ 2 : 1 - 2 * pow(1 - t, 2);`;
        case "Cubic Ease In":
            return `t ^ 3;`;
        case "Cubic Ease Out":
            return `1 - pow(1 - t, 3);`;
        case "Cubic Ease In & Out":
            return `t < 0.5 ? 4 * t ^ 3 : 1 - 4 * pow(1 - t, 3);`;
        case "Quartic Ease In":
            return `t ^ 4;`;
        case "Quartic Ease Out":
            return `1 - pow(1 - t, 4);`;
        case "Quartic Ease In & Out":
            return `t < 0.5 ? 8 * t ^ 4 : 1 - 8 * pow(t - 1, 4);`;
        case "Quintic Ease In":
            return `t ^ 5;`;
        case "Quintic Ease Out":
            return `1 - pow(1 - t, 5);`;
        case "Quintic Ease In & Out":
            return `t < 0.5 ? 16 * t ^ 5 : 1 - 16 * pow(1 - t, 5);`;
        case "Sine Ease In":
            return `1 - cos(t * pi / 2);`;
        case "Sine Ease Out":
            return `sin(t * pi / 2);`;
        case "Sine Ease In & Out":
            return `(1 - cos(t * pi)) / 2;`;
        case "Circular Ease In":
            return `1 - sqrt(1 - t ^ 2);`;
        case "Circular Ease Out":
            return `sqrt(1 - pow(1 - t, 2));`;
        case "Circular Ease In & Out":
            return `t < 0.5
  ? (1 - sqrt(1 - 4 * t ^ 2)) / 2
  : (1 + sqrt(1 - 4 * pow(1 - t, 2))) / 2;`;
        case "Exponential Ease In":
            return `pow(2, 10 * t - 10);`;
        case "Exponential Ease Out":
            return `1 - pow(2, -10 * t);`;
        case "Exponential Ease In & Out":
            return `t < 0.5
  ? pow(2, 20 * t - 10) / 2
  : (2 - pow(2, -20 * t + 10)) / 2;`;
        case "Back Ease In":
            return `t ^ 3 - t * sin(t * pi);`;
        case "Back Ease Out":
            return `var f := (1 - t);
1 - (f ^ 3 - f * sin(f * pi));`;
        case "Back Ease In & Out":
            return `if (t < 0.5) {
    var f := (2 * t);
    (f ^ 3 - f * sin(f * pi)) / 2;
} else {
    var f := 2 * (1 - t);
    1 - (f ^ 3 - f * sin(f * pi)) / 2;
}`;
        case "Elastic Ease In":
            return `sin(13 * pi / 2 * t) * pow(2, 10 * (t - 1));`;
        case "Elastic Ease Out":
            return `1 - sin(13 * pi / 2 * (t + 1)) * pow(2, -10 * t);`;
        case "Elastic Ease In & Out":
            return `t < 0.5
  ? sin(13 * pi * t) * pow(2, 20 * t - 10) / 2
  : 1 - sin(13 * pi * t) * pow(2, -20 * t + 10) / 2;`;
        case "Small Elastic Ease In":
            return `sin(13 * pi / 2 * t) * pow(3.375, 10 * (t - 1));`;
        case "Small Elastic Ease Out":
            return `1 - sin(13 * pi / 2 * (t + 1)) * pow(3.375, -10 * t);`;
        case "Small Elastic Ease In & Out":
            return `t < 0.5
  ? sin(13 * pi * t) * pow(3.375, 20 * t - 10) / 2
  : 1 - sin(13 * pi * t) * pow(3.375, -20 * t + 10) / 2;`;
        case "Bounce Ease In":
            return `var f := (1 - t);
if (f < 4 / 11) {
    1 - (121 * f * f) / 16;
} else if (f < 8 / 11) {
    1 - (363 / 40 * f * f) + (99 / 10 * f) - 17 / 5;
} else if (f < 9 / 10) {
    1 - (4356 / 361 * f * f) + (35442 / 1805 * f) - 16061 / 1805;
} else {
    1 - (54 / 5 * f * f) + (513 / 25 * f) - 268 / 25;
}`;
        case "Bounce Ease Out":
            return `if (t < 4 / 11) {
    (121 * t * t) / 16;
} else if (t < 8 / 11) {
    (363 / 40 * t * t) - (99 / 10 * t) + 17 / 5;
} else if (t < 9 / 10) {
    (4356 / 361 * t * t) - (35442 / 1805 * t) + 16061 / 1805;
} else {
    (54 / 5 * t * t) - (513 / 25 * t) + 268 / 25;
}`;
        case "Bounce Ease In & Out":
            return `if (t < 0.5) {
    var f := (1 - 2 * t);
    if (f < 4 / 11) {
        (1 - (121 * f * f) / 16) / 2;
    } else if (f < 8 / 11) {
        (1 - (363 / 40 * f * f) + (99 / 10 * f) - 17 / 5) / 2;
    } else if (f < 9 / 10) {
        (1 - (4356 / 361 * f * f) + (35442 / 1805 * f) - 16061 / 1805) / 2;
    } else {
        (1 - (54 / 5 * f * f) + (513 / 25 * f) - 268 / 25) / 2;
    }
} else {
    var f := (t * 2 - 1);
    if (f < 4 / 11) {
        (1 + ((121 * f * f) / 16)) / 2;
    } else if (f < 8 / 11) {
        (1 + ((363 / 40 * f * f) - (99 / 10 * f) + 17 / 5)) / 2;
    } else if (f < 9 / 10) {
        (1 + ((4356 / 361 * f * f) - (35442 / 1805 * f) + 16061 / 1805)) / 2;
    } else {
        (1 + ((54 / 5 * f * f) - (513 / 25 * f) + 268 / 25)) / 2;
    }
}`;
        case "Custom":
            return ``;
        default:
            console.error("Easing function not found");
    }
}

function setCustom() {
    let base = btn_function.getValue();
    let baseId = easings[base].id;

    if (baseId == 0 || baseId == 34) {
        return;
    }

    let id = btn_function.getText() + " " + btn_type.getText();
    let expr = getFunction(id);

    btn_custom.setText(expr);
    btn_function.setText("Custom");
}

/* update ui */

function set_enabled() {
    let base = btn_function.getValue();
    let baseId = easings[base].id;

    let is_none = (baseId == 0);
    let is_custom = (baseId == 34);

    btn_type.setEnabled(!is_none);

    row_custom.setHidden(!is_custom);
    row_type.setHidden(is_custom);
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

/* function */
let txt_function = ui_label("Function");
let btn_function = ui_select("Set the base easing function");
    btn_function.onValueChanged = function () {
        set_enabled();
        apply();
    };
    easings.forEach((easing) => {
        btn_function.addEntry(easing.type);
    });
let row_function = new ui.HLayout();
    row_function.add(txt_function, btn_function);

/* type */
let txt_type = ui_label("Type");
let btn_type = ui_select("Set the easing type");
    btn_type.setEnabled(false);
    btn_type.onValueChanged = function () {
        apply();
    };
    btn_type.addEntry("Ease In");
    btn_type.addEntry("Ease Out");
    btn_type.addEntry("Ease In & Out");
let sub_type = new ui.HLayout();
    sub_type.add(txt_type, btn_type);
let row_type = new ui.Container(); /* wrap to hide content */
    row_type.setLayout(sub_type);

/* custom */
let btn_custom = new ui.MultiLineEdit();
    btn_custom.setToolTip("Custom easing expression");
    btn_custom.setPlaceholder("1 - pow(1 - t, 3);");
    btn_custom.setBackgroundColor("#00292929");
    btn_custom.setFixedHeight(55); /* height = 15 * n + 10 */
let sub_custom = new ui.HLayout();
    sub_custom.setMargins(0, 0, 0, 0);
    sub_custom.add(btn_custom);
let row_custom = new ui.Container();
    row_custom.setBackgroundColor(color_numeric_field);
    row_custom.setContentsMargins(3, 3, 3, 3);
    row_custom.setFixedHeight(61); /* content height + margins */
    row_custom.setRadius(2, 2, 2, 2);
    row_custom.setLayout(sub_custom);
    row_custom.setHidden(true);

/* buttons */
let btn_reset = new ui.Button("Reset");
    btn_reset.setToolTip("Clear the selected keyframes easing");
    btn_reset.onClick = function () {
        reset();
    };
let btn_apply = new ui.Button("Apply");
    btn_apply.setToolTip("Set easing to selected keyframes\n" +
        "Hold Alt/Option to convert built-in easing to a custom expression");
    btn_apply.onClick = function () {
        const convert = api.isAltHeld();
        if (convert) {
            setCustom();
        }
        apply();
    };
let row_footer = new ui.HLayout();
    row_footer.add(btn_reset, btn_apply);

    set_footer(); /* set default enable state */

/* root */
let layout = new ui.VLayout();
    layout.setSpaceBetween(0);
    layout.add(row_function, row_type, row_custom, row_footer);
    layout.addStretch();

ui.add(layout);
ui.addCallbackObject(new Callbacks);
ui.setTitle("Easing");
ui.show();

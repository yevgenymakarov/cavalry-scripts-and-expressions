/* {cavalry script} */

/*
    Magic Easing Functions
    Sets the easings for selected keyframes.
*/

const color_text = ui.getThemeColor("Text");
const color_numeric_field = ui.getThemeColor("Window");

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

function tab_view_layout_built() {
    let easings = [
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

    set_footer_built = set_footer;
    return layout;
}

function tab_view_layout_custom() {
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

    set_footer_custom = set_footer;
    return layout;
}

function Callbacks() {
    this.onKeySelectionChanged = function () {
        set_footer_built();
        set_footer_custom();
    }
}

let set_footer_built; /* reference to the function */
let set_footer_custom;

let tabView = new ui.TabView();
    tabView.add("Basic", tab_view_layout_built());
    tabView.add("Advanced", tab_view_layout_custom());

ui.add(tabView);
ui.addCallbackObject(new Callbacks);
ui.setTitle("Easing");
ui.show();

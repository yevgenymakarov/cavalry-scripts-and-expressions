/* {cavalry script} */

/*
    Move & Duplicate Shapes
    Moves the selected shapes by the specified distance and angle.
*/

const color_text = ui.getThemeColor("Text");
const color_numeric_field = ui.getThemeColor("Window");
const color_sub_background = ui.getThemeColor("SubUIBackground");

let settings = {"copies": 1}; /* store user settings */

function apply() {
    let dx = btn_horizontal.getValue();
    let dy = btn_vertical.getValue();

    let angle = btn_rotation.getValue();
    let size = btn_scale.getValue();

    let duplicate = btn_duplicate.getValue();
    let copies = btn_copies.getValue();

    let moveScaleRotate = (layer) => {
        let position = api.get(layer, "position");
        let rotation = api.get(layer, "rotation");
        let scale = api.get(layer, "scale");

        api.set(layer, {
            "position": [position.x + dx, position.y + dy],
            "rotation.z": rotation.z + angle,
            "scale": [scale.x * size, scale.y * size]
        });
    }

    let selection = api.getSelection();
    let select = [];

    let parents = selection.filter((layer) => {
        let parent = api.getParent(layer);
        return (parent === "" || !selection.includes(parent));
    });

    let shapes = parents.filter((layer) => {
        return api.isTransform(layer);
    });

    if (shapes.length === 0) {
        console.warn("No shape layer is selected.");
        return;
    }

    shapes.forEach((layer) => {
        if (duplicate) {
            for (let i = 0; i < copies; i++) {
                layer = api.duplicate(layer, false);
                moveScaleRotate(layer);
            }
        } else {
            moveScaleRotate(layer);
        }

        select.push(layer);
    });

    api.select(select);
}

/* update ui */

function reset() {
    btn_horizontal.setValue(0);
    btn_vertical.setValue(0);

    btn_distance.setValue(0);
    btn_angle.setValue(0);

    btn_rotation.setValue(0);
    btn_scale.setValue(1);

    btn_duplicate.setValue(false);
    btn_copies.setValue(0);

    settings.copies = 1;
}

function set_multiple(from, to) {
    let is_alt = api.isAltHeld();

    if (is_alt) {
        let value = from.getValue();
        to.setValue(value);
    }
}

function set_distance_angle() {
    let dx = btn_horizontal.getValue();
    let dy = btn_vertical.getValue();

    let distance = Math.sqrt(dx * dx + dy * dy);
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;

    btn_distance.setValue(distance);
    btn_angle.setValue(angle);
}

function set_horizontal_vertical() {
    let distance = btn_distance.getValue();
    let angle = btn_angle.getValue() * Math.PI / 180;

    let dx = distance * Math.cos(angle);
    let dy = distance * Math.sin(angle);

    btn_horizontal.setValue(dx);
    btn_vertical.setValue(dy);
}

function set_copies() {
    let duplicate = btn_duplicate.getValue();

    if (duplicate) {
        btn_copies.setMin(1);
        btn_copies.setValue(settings.copies);
        btn_copies.setEnabled(true);
    } else {
        btn_copies.setMin(0);
        btn_copies.setValue(0);
        btn_copies.setEnabled(false);
    }
}

function set_enabled() {
    let dx = btn_horizontal.getValue();
    let dy = btn_vertical.getValue();

    let rotation = btn_rotation.getValue();
    let scale = btn_scale.getValue();

    let duplicate = btn_duplicate.getValue();

    let enable = (dx != 0 || dy != 0 || rotation != 0 || scale != 1 || duplicate);

    btn_reset.setEnabled(enable);
    btn_apply.setEnabled(enable);
}

/* draw ui */

function ui_label(txt) {
    let btn = new ui.Label(txt);
        btn.setTextColor(color_text);
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

function ui_wrap_checkbox(btn) {
    let sub = new ui.HLayout(); /* align checkbox to left */
        sub.setMargins(0, 0, 0, 0);
        sub.add(btn);
        sub.addStretch();
    let box = new ui.Container(); /* set fixed width */
        box.setFixedWidth(80);
        box.setLayout(sub);
    return box;
}

function ui_group(row_a, row_b) { /* group box */
    let sub = new ui.VLayout();
        sub.setSpaceBetween(0);
        sub.add(row_a, row_b);
    let box = new ui.Container();
        box.setBackgroundColor(color_sub_background);
        box.setRadius(3, 3, 3, 3);
        box.setLayout(sub);
    return box;
}

/* horizontal */
let txt_horizontal = ui_label("Horizontal");
let btn_horizontal = new ui.NumericField(0);
    btn_horizontal.setType(1);
    btn_horizontal.setValue(0);
    btn_horizontal.onValueChanged = function() {
        set_multiple(btn_horizontal, btn_vertical);
        set_distance_angle();
        set_enabled();
    }
let box_horizontal = ui_wrap(btn_horizontal);
let row_horizontal = new ui.HLayout();
    row_horizontal.add(txt_horizontal, box_horizontal);

/* vertical */
let txt_vertical = ui_label("Vertical");
let btn_vertical = new ui.NumericField(0);
    btn_vertical.setType(1);
    btn_vertical.setValue(0);
    btn_vertical.onValueChanged = function() {
        set_multiple(btn_vertical, btn_horizontal);
        set_distance_angle();
        set_enabled();
    }
let box_vertical = ui_wrap(btn_vertical);
let row_vertical = new ui.HLayout();
    row_vertical.add(txt_vertical, box_vertical);

/* distance */
let txt_distance = ui_label("Distance");
let btn_distance = new ui.NumericField(0);
    btn_distance.setType(1);
    btn_distance.setValue(0);
    btn_distance.onValueChanged = function() {
        set_horizontal_vertical();
        set_enabled();
    }
let box_distance = ui_wrap(btn_distance);
let row_distance = new ui.HLayout();
    row_distance.add(txt_distance, box_distance);

/* angle */
let txt_angle = ui_label("Angle");
let btn_angle = new ui.NumericField(0);
    btn_angle.setType(1);
    btn_angle.setValue(0);
    btn_angle.setMin(-180);
    btn_angle.setMax(180);
    btn_angle.onValueChanged = function() {
        set_horizontal_vertical();
        set_enabled();
    }
let box_angle = ui_wrap(btn_angle);
let row_angle = new ui.HLayout();
    row_angle.add(txt_angle, box_angle);

/* rotation */
let txt_rotation = ui_label("Rotation");
let btn_rotation = new ui.NumericField(0);
    btn_rotation.setType(1);
    btn_rotation.setValue(0);
    btn_rotation.setMin(-360);
    btn_rotation.setMax(360);
    btn_rotation.onValueChanged = function() {
        set_enabled();
    }
let box_rotation = ui_wrap(btn_rotation);
let row_rotation = new ui.HLayout();
    row_rotation.add(txt_rotation, box_rotation);

/* scale */
let txt_scale = ui_label("Scale");
let btn_scale = new ui.NumericField(1);
    btn_scale.setType(1);
    btn_scale.setValue(1);
    btn_scale.setStep(0.01);
    btn_scale.onValueChanged = function() {
        set_enabled();
    }
let box_scale = ui_wrap(btn_scale);
let row_scale = new ui.HLayout();
    row_scale.add(txt_scale, box_scale);

/* duplicate */
let txt_duplicate = ui_label("Duplicate");
let btn_duplicate = new ui.Checkbox(false);
    btn_duplicate.onValueChanged = function() {
        set_copies();
        set_enabled();
    }
let box_duplicate = ui_wrap_checkbox(btn_duplicate);
let row_duplicate = new ui.HLayout();
    row_duplicate.add(txt_duplicate, box_duplicate);

/* copies */
let txt_copies = ui_label("Number of Copies");
let btn_copies = new ui.NumericField(0);
    btn_copies.setEnabled(false);
    btn_copies.onValueChanged = function() {
        settings.copies = btn_copies.getValue();
    }
let box_copies = ui_wrap(btn_copies);
let row_copies = new ui.HLayout();
    row_copies.add(txt_copies, box_copies);

/* buttons */
let btn_reset = new ui.Button("Reset");
    btn_reset.setEnabled(false);
    btn_reset.onClick = function () {
        reset();
        set_enabled();
    }
let btn_apply = new ui.Button("Apply");
    btn_apply.setEnabled(false);
    btn_apply.onClick = function () {
        apply();
    }
let row_footer = new ui.HLayout();
    row_footer.add(btn_reset, btn_apply);

/* groups */
let box_horizontal_vertical = ui_group(row_horizontal, row_vertical);
let box_distance_angle = ui_group(row_distance, row_angle);
let box_duplicate_copies = ui_group(row_duplicate, row_copies);
let box_rotation_scale = ui_group(row_rotation, row_scale);

/* root */
let layout = new ui.VLayout();
    layout.add(box_horizontal_vertical, box_distance_angle);
    layout.add(box_rotation_scale, box_duplicate_copies, row_footer);
    layout.addStretch();

ui.add(layout);
ui.setTitle("Move & Duplicate");
ui.show();

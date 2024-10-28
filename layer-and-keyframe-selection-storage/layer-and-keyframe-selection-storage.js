/* {cavalry script} */

/*
    Selection Storage
    Stores the selection of layers and keyframes.
*/

let slots = 4;

let btnLayers = [];
let btnKeyframes = [];

let storeLayers = [];
let storeKeyframes = [];

function addLayersRow(id) {
    let btnSave = new ui.Button("Save");
        btnSave.setToolTip("Save the current layer selection");
        btnSave.onClick = function () {
            storeLayers[id] = api.getSelection();
            btnSave.setText("Replace");
            btnLoad.setEnabled(true);
        };
    let btnLoad = new ui.Button("Load");
        btnLoad.setToolTip("Restore the layer selection\n" +
            "Hold Cmd/Ctrl to add to the current selection");
        btnLoad.onClick = function () {
            let add = api.isControlHeld();
            let store = storeLayers[id];
            let layers = add ? api.getSelection().concat(store) : store;
            api.select(layers);
        };
        btnLoad.setEnabled(false);
    let row = new ui.HLayout();
        row.setMargins(3, 1, 3, 1);
        row.add(btnSave, btnLoad);

    btnLayers.push([btnSave, btnLoad]);
    return row;
}

function addKeyframesRow(id) {
    let btnSave = new ui.Button("Save");
        btnSave.setToolTip("Save the current keyframe selection");
        btnSave.onClick = function () {
            storeKeyframes[id] = api.getSelectedKeyframeIds();
            btnSave.setText("Replace");
            btnLoad.setEnabled(true);
        };
    let btnLoad = new ui.Button("Load");
        btnLoad.setToolTip("Restore the keyframe selection\n" +
            "Hold Cmd/Ctrl to add to the current selection");
        btnLoad.onClick = function () {
            let add = api.isControlHeld();
            let store = storeKeyframes[id];
            let keys = add ? api.getSelectedKeyframeIds().concat(store) : store;
            api.setSelectedKeyframeIds(keys);
        };
        btnLoad.setEnabled(false);
    let row = new ui.HLayout();
        row.setMargins(3, 1, 3, 1);
        row.add(btnSave, btnLoad);

    btnKeyframes.push([btnSave, btnLoad]);
    return row;
}

let tabLayers = new ui.VLayout();
    tabLayers.setSpaceBetween(0);

    for (let i = 0; i < slots; i++) {
        let row = addLayersRow(i);
        tabLayers.add(row);
    }

let tabKeyframes = new ui.VLayout();
    tabKeyframes.setSpaceBetween(0);

    for (let i = 0; i < slots; i++) {
        let row = addKeyframesRow(i);
        tabKeyframes.add(row);
    }

let tabView = new ui.TabView();
    tabView.add("Layers", tabLayers);
    tabView.add("Keyframes", tabKeyframes);

function setEnabledLayers() {
    let enabled = (api.getSelection().length != 0);
    btnLayers.forEach((btn) => {
        btn[0].setEnabled(enabled);
    });
}

function setEnabledKeyframes() {
    let enabled = (api.getSelectedKeyframeIds().length != 0);
    btnKeyframes.forEach((btn) => {
        btn[0].setEnabled(enabled);
    });
}

function Callbacks() {
    this.onSelectionChanged = setEnabledLayers;
    this.onKeySelectionChanged = setEnabledKeyframes;
}

setEnabledLayers();
setEnabledKeyframes();

ui.addMenuItem({
    name: "Clear All Layer Slots",
    onMouseRelease: function () {
        storeLayers = [];
        btnLayers.forEach((btn) => {
            btn[0].setText("Save");
            btn[1].setEnabled(false);
        });
    }
});
ui.addMenuItem({
    name: "Clear All Keyframe Slots",
    onMouseRelease: function () {
        storeKeyframes = [];
        btnKeyframes.forEach((btn) => {
            btn[0].setText("Save");
            btn[1].setEnabled(false);
        });
    }
});
ui.addMenuItem({
    name: ""
});
ui.addMenuItem({
    name: "Add Storage Slots",
    onMouseRelease: function () {
        let rowLayer = addLayersRow(btnLayers.length);
        tabLayers.add(rowLayer);

        let rowKeyframe = addKeyframesRow(btnKeyframes.length);
        tabKeyframes.add(rowKeyframe);

        setEnabledLayers();
        setEnabledKeyframes();
    }
});

ui.add(tabView);
ui.addStretch();
ui.showContextMenuOnRightClick();
ui.addCallbackObject(new Callbacks);
ui.setTitle("Storage");
ui.show();

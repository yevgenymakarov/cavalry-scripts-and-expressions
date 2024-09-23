/* {cavalry script} */

/*
  Basic OBJ File Parser
  Extracts a list of vertices and edge information from an obj file.

  https://en.wikipedia.org/wiki/Wavefront_.obj_file
*/

let object_name = "";
let points = [], edges = [], faces = [];

function parseObj(text) {
  /* join backslash separated lines */
  text = text.replace(/\r\n/g, '\n').replace(/\\\n/g, '');

  text.split('\n').forEach((line) => {
    let data = line.trim().split(/\s+/);

    switch (data[0]) {
      case 'v':
        points.push([
          parseFloat(data[1]),
          parseFloat(data[2]),
          parseFloat(data[3])
        ]);
        break;
      case 'l':
        data.shift();
        data.forEach((e, i, a) => {
          a[i] = parseInt(e);
        });
        edges.push(data);
        break;
      case 'f':
        data.shift();
        data.forEach((e, i, a) => {
          a[i] = parseInt(e);
        });
        faces.push(data);
        break;
      case 'o':
        object_name = line.slice(1).trim();
        break;
    }
  });
}

const color_sub_background = ui.getThemeColor("SubUIBackground");
const color_numeric_field = ui.getThemeColor("Window");
const color_message_text = ui.getThemeColor("BrightText");

function ui_wrap(btn) {
  let sub = new ui.HLayout();
      sub.setMargins(3, 0, 1, 0);
      sub.add(btn);
  let box = new ui.Container();
      box.setBackgroundColor(color_numeric_field);
      box.setRadius(4, 4, 4, 4);
      box.setFixedHeight(18)
      box.setLayout(sub);
  return box;
}

function ui_group(row_a, row_b) {
  let sub = new ui.VLayout();
      sub.setSpaceBetween(0);
      sub.add(row_a, row_b);
  let box = new ui.Container();
      box.setBackgroundColor(color_sub_background);
      box.setRadius(4, 4, 4, 4);
      box.setLayout(sub);
  return box;
}

function ui_reload() {
  let path = btn_filepath.getFilePath();

  if (api.filePathExists(path)) {
    points = [], edges = [], faces = [];
    parseObj(api.readFromFile(path));

    btn_filepath.setOpenLocation(path);
    btn_message.setText("found " + points.length + " points");
    btn_message.setToolTip(api.getFileNameFromPath(path, true));
    btn_reload.setEnabled(true);
    btn_apply.setEnabled(points.length > 0);
  } else {
    btn_message.setText("file not found");
    btn_message.setToolTip("");
    btn_reload.setEnabled(false);
    btn_apply.setEnabled(false);
  }
}

function ui_copy() {
  let path = btn_filepath.getFilePath();
  let filename = api.getFileNameFromPath(path, true);

  /* in .obj file the point numbering starts from 1 */
  let r = p => p.map(v => --v);

  let string = "// " + filename + "\n" +
    "points = " + JSON.stringify(points) + ";\n" +
    "edges = " + JSON.stringify(edges.map(r)) + ";\n" +
    "faces = " + JSON.stringify(faces.map(r)) + ";";

  api.setClipboardText(string);
  console.info("Copied to the clipboard");
}

let txt_filepath = new ui.Label("Filepath");
let btn_filepath = new ui.FilePath();
    btn_filepath.setMode("OpenFile");
    btn_filepath.setFilter("*.txt *.obj");
    btn_filepath.setOpenLocation(api.getAssetPath());
    btn_filepath.onValueChanged = ui_reload;
let box_filepath = ui_wrap(btn_filepath);
    box_filepath.setToolTip("The path to the Wavefront .obj file");

let btn_reload = new ui.Button("");
    btn_reload.setToolTip("Reload");
    btn_reload.setImage(api.getAppAssetsPath() + "/icons/reload.png");
    btn_reload.setSize(24, 18);
    btn_reload.setEnabled(false);
    btn_reload.onClick = ui_reload;

let row_filepath = new ui.HLayout();
    row_filepath.setSpaceBetween(6);
    row_filepath.add(txt_filepath, box_filepath, btn_reload);

let btn_message = new ui.Label("file not found");
    btn_message.setTextColor(color_message_text);
let row_message = new ui.HLayout();
    row_message.add(btn_message);

let box_group = ui_group(row_filepath, row_message);

let btn_apply = new ui.Button("Copy");
    btn_apply.setToolTip("Copy the data to the clipboard");
    btn_apply.setEnabled(false);
    btn_apply.onClick = ui_copy;
let row_footer = new ui.HLayout();
    row_footer.add(btn_apply);

let root = new ui.VLayout();
    root.add(box_group, row_footer);
    root.addStretch();

ui.add(root);
ui.setTitle("Parser");
ui.show();

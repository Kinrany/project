use wasm_bindgen::JsCast;

pub fn get() -> web_sys::HtmlCanvasElement {
  let document = web_sys::window().unwrap().document().unwrap();
  let canvas = document.get_element_by_id("canvas").unwrap();
  canvas
    .dyn_into::<web_sys::HtmlCanvasElement>()
    .map_err(|_| ())
    .unwrap()
}

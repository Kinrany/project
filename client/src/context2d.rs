use wasm_bindgen::JsCast;

pub type Context2d = web_sys::CanvasRenderingContext2d;

pub fn new(canvas: web_sys::HtmlCanvasElement) -> Context2d {
  canvas
    .get_context("2d")
    .unwrap()
    .unwrap()
    .dyn_into::<Context2d>()
    .unwrap()
}

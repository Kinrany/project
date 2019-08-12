pub mod canvas;
pub mod context2d;
#[macro_use]
pub mod log;
pub mod websocket;
mod face;

use wasm_bindgen::JsCast;
use wasm_bindgen::prelude::*;
use web_sys::HtmlElement;
use context2d::Draw;

fn set_onclick(cvs: &HtmlElement, f: Box<FnMut()>) {
  let onclick_handler = Closure::wrap(f as Box<dyn FnMut()>);

  cvs.set_onclick(Some(onclick_handler.as_ref().unchecked_ref()));

  onclick_handler.forget();
}

#[wasm_bindgen(start)]
pub fn start() -> Result<(), JsValue> {
  log!("start");

  let cvs = canvas::get();
  let ctx = context2d::new(&cvs);

  let ws = websocket::create();

  set_onclick(&cvs, Box::new(move || {
    ws.send_with_str("Click!").unwrap();
  }));

  face::face().draw(&ctx)?;

  Ok(())
}

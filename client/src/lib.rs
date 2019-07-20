pub mod canvas;
pub mod context2d;
pub mod log;
pub mod websocket;
mod face;

use wasm_bindgen::prelude::*;

macro_rules! log {
  ($($t:tt)*) => (log::log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen(start)]
pub fn start() -> Result<(), JsValue> {
  log!("start");

  let cvs = canvas::get();
  let ctx = context2d::new(cvs);

  face::draw(ctx);

  let _ws = websocket::create();

  Ok(())
}

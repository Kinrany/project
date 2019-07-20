pub mod canvas;
pub mod context2d;
#[macro_use]
pub mod log;
pub mod websocket;
mod face;

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn start() -> Result<(), JsValue> {
  log!("start");

  let cvs = canvas::get();
  let ctx = context2d::new(cvs);

  face::draw(ctx);

  let _ws = websocket::create();

  Ok(())
}

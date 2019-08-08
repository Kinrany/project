pub mod canvas;
pub mod context2d;
#[macro_use]
pub mod log;
pub mod websocket;
mod face;

use wasm_bindgen::prelude::*;
use context2d::Draw;

#[wasm_bindgen(start)]
pub fn start() -> Result<(), JsValue> {
  log!("start");

  let cvs = canvas::get();
  let ctx = context2d::new(cvs);

  face::face().draw(&ctx)?;

  let _ws = websocket::create();

  Ok(())
}

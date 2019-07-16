pub mod canvas;
pub mod context2d;
mod face;

use {
  game::Outcome,
  wasm_bindgen::prelude::*,
};

#[wasm_bindgen]
extern "C" {
  #[wasm_bindgen(js_namespace = console)]
  fn log(s: &str);
}

#[wasm_bindgen(start)]
pub fn start() -> Result<(), JsValue> {
  let cvs = canvas::get();
  let ctx = context2d::new(cvs);

  face::draw(ctx);

  Ok(())
}

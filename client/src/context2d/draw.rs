use wasm_bindgen::JsValue;
use super::Context2d;

pub trait Draw {
  fn draw(&self, ctx: &Context2d) -> Result<(), JsValue>;
}

impl<D, I> Draw for I where D: Draw, I: Iterator<Item = D> + Clone {
  fn draw(&self, ctx: &Context2d) -> Result<(), JsValue> {
    for item in self.clone() {
      item.draw(ctx)?;
    }
    Ok(())
  }
}

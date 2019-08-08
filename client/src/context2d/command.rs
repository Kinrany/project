use wasm_bindgen::JsValue;
use super::Context2d;
use super::draw::Draw;

pub enum Command {
  Arc(f64, f64, f64, f64, f64),
  MoveTo(f64, f64),
}

use Command::*;

impl Draw for Command {
  fn draw(&self, ctx: &Context2d) -> Result<(), JsValue> {
    match *self {
      Arc(x, y, radius, start_angle, end_angle) => ctx.arc(x, y, radius, start_angle, end_angle),
      MoveTo(x, y) => Ok(ctx.move_to(x, y)),
    }
  }
}

pub struct Path<'a>(pub &'a [&'a Command]);

impl<'a> Draw for Path<'a> {
  fn draw(&self, ctx: &Context2d) -> Result<(), JsValue> {
    ctx.begin_path();
    for command in self.0 {
      command.draw(ctx)?;
    }
    ctx.stroke();
    Ok(())
  }
}

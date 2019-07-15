use {
  game::Outcome,
  std::f64,
  wasm_bindgen::{
    prelude::*,
    JsCast,
  },
};

type Context2d = web_sys::CanvasRenderingContext2d;

#[wasm_bindgen]
extern "C" {
  #[wasm_bindgen(js_namespace = console)]
  fn log(s: &str);
}

fn canvas() -> web_sys::HtmlCanvasElement {
  let document = web_sys::window().unwrap().document().unwrap();
  let canvas = document.get_element_by_id("canvas").unwrap();
  canvas
    .dyn_into::<web_sys::HtmlCanvasElement>()
    .map_err(|_| ())
    .unwrap()
}

fn context(canvas: web_sys::HtmlCanvasElement) -> Context2d {
  canvas
    .get_context("2d")
    .unwrap()
    .unwrap()
    .dyn_into::<Context2d>()
    .unwrap()
}

fn draw_face(ctx: Context2d) {
  ctx.begin_path();

  ctx
    .arc(75.0, 75.0, 50.0, 0.0, f64::consts::PI * 2.0)
    .unwrap();

  // Draw the mouth.
  ctx.move_to(110.0, 75.0);
  ctx.arc(75.0, 75.0, 35.0, 0.0, f64::consts::PI).unwrap();

  // Draw the left eye.
  ctx.move_to(65.0, 65.0);
  ctx
    .arc(60.0, 65.0, 5.0, 0.0, f64::consts::PI * 2.0)
    .unwrap();

  // Draw the right eye.
  ctx.move_to(95.0, 65.0);
  ctx
    .arc(90.0, 65.0, 5.0, 0.0, f64::consts::PI * 2.0)
    .unwrap();

  ctx.stroke();
}

#[wasm_bindgen(start)]
pub fn start() -> Result<(), JsValue> {
  let cvs = canvas();
  let ctx = context(cvs);

  draw_face(ctx);

  Ok(())
}

use {
  crate::context2d::Context2d,
  std::f64::consts::PI,
};

pub fn draw(ctx: Context2d) {
  ctx.begin_path();

  ctx
    .arc(75.0, 75.0, 50.0, 0.0, PI * 2.0)
    .unwrap();

  // Draw the mouth.
  ctx.move_to(110.0, 75.0);
  ctx.arc(75.0, 75.0, 35.0, 0.0, PI).unwrap();

  // Draw the left eye.
  ctx.move_to(65.0, 65.0);
  ctx
    .arc(60.0, 65.0, 5.0, 0.0, PI * 2.0)
    .unwrap();

  // Draw the right eye.
  ctx.move_to(95.0, 65.0);
  ctx
    .arc(90.0, 65.0, 5.0, 0.0, PI * 2.0)
    .unwrap();

  ctx.stroke();
}

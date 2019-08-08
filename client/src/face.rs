use {
  crate::context2d::{
    Command::*,
    Draw,
    Path,
  },
  std::f64::consts::PI,
};

pub fn face() -> impl Draw {
  Path(&[
    &Arc(75.0, 75.0, 50.0, 0.0, PI * 2.0),
    &MoveTo(110.0, 75.0),
    &Arc(75.0, 75.0, 35.0, 0.0, PI),
    &MoveTo(65.0, 65.0),
    &Arc(60.0, 65.0, 5.0, 0.0, PI * 2.0),
    &MoveTo(95.0, 65.0),
    &Arc(90.0, 65.0, 5.0, 0.0, PI * 2.0),
  ])
}

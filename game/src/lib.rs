pub enum Outcome {
  Win,
  Fail,
  Undecided,
}

impl Outcome {
  pub fn start() -> Outcome {
    Outcome::Undecided
  }

  pub fn won(self) -> Result<Outcome, &'static str> {
    match self {
      Outcome::Undecided => Ok(Outcome::Win),
      _ => Err("can only win while playing"),
    }
  }

  pub fn failed(self) -> Result<Outcome, &'static str> {
    match self {
      Outcome::Undecided => Ok(Outcome::Fail),
      _ => Err("can only lose while playing"),
    }
  }
}

use rand::{rngs::StdRng, Rng, RngCore, SeedableRng};

pub struct Position {
  x: u32,
  y: u32,
}

trait CanMove {
  fn mov(&mut self, dx: u32, dy: u32);
  fn mov_random(&mut self, rng: &mut RngCore);
}

impl CanMove for Position {
  fn mov(&mut self, dx: u32, dy: u32) {
    self.x += dx;
    self.y += dy;
  }

  fn mov_random(&mut self, rng: &mut RngCore) {
    let dx: u32 = rng.gen();
    let dy: u32 = rng.gen();
    self.mov(dx, dy);
  }
}

pub struct Character(Position);

pub struct Game {
  rng: StdRng,
  characters: Vec<Character>,
}

impl Game {
  pub fn new(rng_seed: u64) -> Game {
    Game {
      rng: StdRng::seed_from_u64(rng_seed),
      characters: Vec::new(),
    }
  }
}

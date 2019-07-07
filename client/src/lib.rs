use wasm_bindgen::prelude::*;
use game::Outcome;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    log("Hello, client!");
    let outcome = Outcome::start();
    let outcome = outcome.failed().unwrap();
    log("We failed :(");
    outcome.won().unwrap();
    log("We succeeded! :D");
    Ok(())
}

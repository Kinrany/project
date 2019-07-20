use {
  crate::log,
  wasm_bindgen::{
    prelude::*,
    JsCast,
  },
  web_sys::{ErrorEvent, MessageEvent, WebSocket},
};

macro_rules! log {
  ($($t:tt)*) => (log::log(&format_args!($($t)*).to_string()))
}

pub fn create() -> WebSocket {
  let ws = WebSocket::new("ws://localhost:8080/ws").unwrap();
  log!("websocket created");

  // create callback
  let onmessage_callback = Closure::wrap(Box::new(move |e: MessageEvent| {
    // handle message
    let response = e
      .data()
      .as_string()
      .expect("Can't convert received data to a string");
    log!("message event, received data: {:?}", response);
  }) as Box<dyn FnMut(MessageEvent)>);
  // set message event handler on WebSocket
  ws.set_onmessage(Some(onmessage_callback.as_ref().unchecked_ref()));
  // forget the callback to keep it alive
  onmessage_callback.forget();

  let onerror_callback = Closure::wrap(Box::new(move |e: ErrorEvent| {
    log!("error event: {:?}", e);
  }) as Box<dyn FnMut(ErrorEvent)>);
  ws.set_onerror(Some(onerror_callback.as_ref().unchecked_ref()));
  onerror_callback.forget();

  let cloned_ws = ws.clone();
  let onopen_callback = Closure::wrap(Box::new(move |_| {
    log!("socket opened");
    match cloned_ws.send_with_str("ping") {
      Ok(_) => log!("message successfully sent"),
      Err(err) => log!("error sending message: {:?}", err),
    }
  }) as Box<dyn FnMut(JsValue)>);
  ws.set_onopen(Some(onopen_callback.as_ref().unchecked_ref()));
  onopen_callback.forget();

  ws
}

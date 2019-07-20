use {
  actix::{Actor, StreamHandler},
  actix_files as fs,
  actix_web::{
    web,
    App,
    HttpRequest,
    HttpServer,
  },
  actix_web_actors::ws,
};

#[derive(Clone, Copy)]
struct MyWebSocket(());

impl MyWebSocket {
  fn new() -> Self {
    Self(())
  }
}

impl Actor for MyWebSocket {
  type Context = ws::WebsocketContext<Self>;

  fn started(&mut self, _ctx: &mut Self::Context) {}
}

impl StreamHandler<ws::Message, ws::ProtocolError> for MyWebSocket {
  fn handle(&mut self, msg: ws::Message, ctx: &mut Self::Context) {
    println!("WS: {:?}", msg);
    match msg {
      ws::Message::Text(text) => ctx.text(text),
      _ => {},
    };
  }
}

fn main() {
  println!("Hello, server!");

  let _game = game::Game::new(12345678);

  let websocket = MyWebSocket::new();
  let websocket_handler = move |r: HttpRequest, stream: web::Payload| ws::start(websocket, &r, stream);

  let addr = "127.0.0.1:8080";
  HttpServer::new(move || App::new()
    .service(fs::Files::new("/static", "server/static").show_files_listing())
    .service(fs::Files::new("/wasm", "client/pkg").show_files_listing())
    .service(web::resource("/ws").route(web::get().to(websocket_handler)))
  )
  .bind(addr)
  .expect(&("Failed to bind to ".to_string() + addr))
  .run()
  .expect("Failed to run");
}

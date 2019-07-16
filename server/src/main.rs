use {
  actix::{Actor, StreamHandler},
  actix_files as fs,
  actix_web::{
    web,
    App,
    Error,
    HttpRequest,
    HttpResponse,
    HttpServer,
  },
  actix_web_actors::ws,
  game::Outcome,
};

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
  fn handle(&mut self, msg: ws::Message, _ctx: &mut Self::Context) {
    println!("WS: {:?}", msg);
  }
}

fn websocket_index(r: HttpRequest, stream: web::Payload) -> Result<HttpResponse, Error> {
  ws::start(MyWebSocket::new(), &r, stream)
}

fn main() {
  println!("Hello, server!");
  let addr = "127.0.0.1:8080";
  HttpServer::new(|| {
    App::new()
      .service(fs::Files::new("/static", "server/static").show_files_listing())
      .service(fs::Files::new("/wasm", "client/pkg").show_files_listing())
      .service(web::resource("/ws").route(web::get().to(websocket_index)))
  })
  .bind(addr)
  .expect(&("Failed to bind to ".to_string() + addr))
  .run()
  .expect("Failed to run");
}

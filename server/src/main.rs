use {
  actix_files as fs,
  actix_web::{
    App,
    HttpServer,
  },
  std::thread,
  ws,
};

fn main() {
  println!("Hello, server!");

  let _game = game::Game::new(12345678);

  let static_services = thread::spawn(|| {
    let addr = "127.0.0.1:8080";
    HttpServer::new(move || App::new()
      .service(fs::Files::new("/static", "server/static").show_files_listing())
      .service(fs::Files::new("/wasm", "client/pkg").show_files_listing())
    )
    .bind(addr)
    .expect(&("Failed to bind to ".to_string() + addr))
    .run()
    .expect("Failed to run");
  });

  let ws_service = thread::spawn(|| {
    use ws::Message::*;

    ws::listen("127.0.0.1:8081", |out| {
      move |msg| {
        out.send(match msg {
          Text(text) => text,
          Binary(_) => String::from("Error: can't handle binary"),
        })
      }
    }).unwrap();
  });

  ws_service.join().unwrap();
  static_services.join().unwrap();
}

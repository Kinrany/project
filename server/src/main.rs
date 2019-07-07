use {
    actix_files as fs,
    actix_web::{App, HttpServer},
    game::Outcome,
};

fn main() {
    println!("Hello, server!");
    let addr = "127.0.0.1:8080";
    HttpServer::new(|| {
        App::new()
        .service(fs::Files::new("/", "./static").show_files_listing())
    })
    .bind(addr)
    .expect(&("Failed to bind to ".to_string() + addr))
    .run()
    .expect("Failed to run");
}

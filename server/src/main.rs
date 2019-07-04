use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use game::Outcome;

fn index() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

fn index2() -> impl Responder {
    HttpResponse::Ok().body("Hello world again!")
}

fn main() {
    println!("Hello, server!");
    let addr = "127.0.0.1:8080";
    HttpServer::new(|| {
        App::new()
        .route("/", web::get().to(index))
        .route("/again", web::get().to(index2))
    })
    .bind(addr)
    .expect(&("Failed to bind to ".to_string() + addr))
    .run()
    .expect("Failed to run");
}

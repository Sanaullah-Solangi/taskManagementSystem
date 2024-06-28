//!========= getting elements =========
let header = document.querySelector(".header");
let toggleBtns = document.querySelector(".toggle-btns");
let anchors = document.querySelectorAll(".navbar a");

//!========= navbar responsivenes =========
toggleBtns.addEventListener("click", () => {
  header.classList.toggle("show");
});

anchors.forEach((val) => {
  val.addEventListener("click", () => {
    header.classList.remove("show");
  });
});

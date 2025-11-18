//  Thanh menu 
const navLinks = document.querySelectorAll(".nav-links a");
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

//  Nút search - hiển thị ô tìm kiếm tạm thời
const searchIcon = document.querySelector(".fa-search");
searchIcon.addEventListener("click", () => {
  const searchBox = document.createElement("input");
  searchBox.type = "text";
  searchBox.placeholder = "Search food...";
  searchBox.classList.add("search-box");

  // Nếu đã có ô search thì không thêm nữa
  if (!document.querySelector(".search-box")) {
    document.querySelector(".nav-icons").prepend(searchBox);

    // Tự động focus
    searchBox.focus();

    // Ẩn khi nhấn Enter hoặc mất focus
    searchBox.addEventListener("keypress", e => {
      if (e.key === "Enter") searchBox.remove();
    });
    searchBox.addEventListener("blur", () => searchBox.remove());
  }
});

//  Nút Sign in
const signInBtn = document.querySelector(".btn-signin");
const signUpBtn = document.querySelector(".btn-signup");

function showPopup(type) {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  overlay.innerHTML = `
    <div class="popup">
      <h2>${type === "signin" ? "Sign In" : "Sign Up"}</h2>
      <input type="text" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button class="popup-btn">${type === "signin" ? "Login" : "Login"}</button>
      <span class="close-btn">&times;</span>
    </div>
  `;
  document.body.appendChild(overlay);
  // Đóng popup
  overlay.querySelector(".close-btn").addEventListener("click", () => overlay.remove());
}
signInBtn.addEventListener("click", () => showPopup("signin"));
signUpBtn.addEventListener("click", () => showPopup("signup"));

// Nút "Get Started" chuyển đến phần menu
document.querySelector(".btn-started").addEventListener("click", () => {
  document.querySelector(".menu").scrollIntoView({ behavior: "smooth" });
});

// Chức năng nhấn tim yêu thích
document.querySelectorAll(".menu-info i").forEach((icon) => {
  icon.addEventListener("click", () => {
    icon.classList.toggle("fas");
    icon.classList.toggle("far");
    icon.classList.toggle("active");
  });
});

// nút More Menu
const moreBtn = document.querySelector(".btn-more");
const menuContainer = document.querySelector(".menu-cards");
let isExpanded = false; // trạng thái mở rộng hay không

const newItems = [
  { name: "Pho Bo", img: "./img/bun.png", price: "$25.5" },
  { name: "Sushi", img: "./img/ca.png", price: "$30.0" },
  { name: "Banh Mi", img: "./img/sandwich.png", price: "$15.0" }
];

moreBtn.addEventListener("click", () => {
  if (!isExpanded) {
    // thu gọn khi không đã xem được món cần tìm 
    newItems.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("menu-item", "extra-item"); // đánh dấu món thêm
      div.innerHTML = `
        <div class="menu-img">
          <img src="${item.img}" alt="${item.name}" />
        </div>
        <div class="card-bottom">
          <h3>${item.name}</h3>
          <p>lorem ipsum</p>
          <div class="menu-info">
            <span>${item.price}</span>
            <i class="far fa-heart"></i>
          </div>
        </div>
      `;
      menuContainer.appendChild(div);
    });
    moreBtn.innerText = "Thu gọn";
    isExpanded = true;
  } else {
    // xem thêm món
    const addedItems = document.querySelectorAll(".extra-item");
    addedItems.forEach(item => item.remove());
    moreBtn.innerText = "More Menu";
    isExpanded = false;
  }
});

// BANNER KHUYẾN MÃI
document.querySelector(".btn-signup").addEventListener("click", () => {
  const name = prompt("Nhập tên của bạn để nhận ưu đãi 50%:");
  if (name && name.trim() !== "") {
    alert(`Cảm ơn ${name}! Ưu đãi của bạn đã được gửi qua email.`);
  }
});

// Click mạng xã hội
document.querySelectorAll(".social-icons a").forEach((icon) => {
  icon.addEventListener("click", (e) => {
    e.preventDefault();
    alert(`Bạn sắp mở trang ${icon.querySelector("i").classList[1].replace("fa-", "")}`);
  });
});

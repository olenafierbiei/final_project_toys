document.addEventListener("click", function (e) {
  // Перевіряємо, чи натиснута кнопка + або -
  if (e.target.classList.contains("qty-btn")) {
    const container = e.target.closest(".quantity");
    const input = container.querySelector("input");
    const currentValue = parseInt(input.value) || 1;

    if (e.target.innerText === "+") {
      input.value = currentValue + 1;
    } else if (e.target.innerText === "-") {
      if (currentValue > 1) {
        // Не даємо опуститися нижче 1
        input.value = currentValue - 1;
      }
    }
  }
});

document.addEventListener("click", function (e) {
  // Шукаємо клік по картинці всередині кнопки wishlist
  if (e.target.closest(".wishlist-btn img")) {
    const heartIcon = e.target.closest(".wishlist-btn img");

    // Перемикаємо клас "active"
    heartIcon.classList.toggle("active");

    // Додамо невеличку анімацію пульсації
    if (heartIcon.classList.contains("active")) {
      console.log("Додано в обране");
    }
  }
});
document.addEventListener("click", function (e) {
  // Шукаємо клік по кнопці wishlist або її вмісту
  const wishlistBtn = e.target.closest(".wishlist-btn");

  if (wishlistBtn) {
    // Перемикаємо клас "active" на всьому блоці
    wishlistBtn.classList.toggle("active");

    const isAdded = wishlistBtn.classList.contains("active");
    console.log(
      isAdded ? "Додано в обране (коричневе)" : "Видалено з обраного",
    );

    // Тут можна додати анімацію пульсації для Wow-ефекту
    if (isAdded) {
      wishlistBtn.style.animation = "pulse 0.3s ease-in-out";
      setTimeout(() => (wishlistBtn.style.animation = ""), 300);
    }
  }
});

/*додавання продуктів у кошик*/
function updateCartUI() {
  const cartCountElement = document.getElementById("cart-count");

  // ПЕРЕВІРКА: Якщо елемента немає на сторінці, просто виходимо з функції
  if (!cartCountElement) {
    console.warn("Елемент #cart-count не знайдено на цій сторінці.");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("userCart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Тепер помилки не буде
  cartCountElement.innerText = totalItems;

  if (totalItems > 0) {
    cartCountElement.style.display = "flex"; // Показуємо коло
  } else {
    cartCountElement.style.display = "none"; // Ховаємо, якщо порожньо
  }
}

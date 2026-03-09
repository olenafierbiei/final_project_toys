document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.getElementById("cart-items-container");
  const totalPriceElement = document.getElementById("cart-total-price");

  // --- 1. ГОЛОВНА ФУНКЦІЯ МАЛЮВАННЯ КОШИКА ---
  function renderCart() {
    // Отримуємо дані з Local Storage (запит від 2026-02-23)
    let cart = JSON.parse(localStorage.getItem("userCart")) || [];

    if (!cartContainer) return; // Захист від помилок, якщо елемента немає

    // Якщо кошик порожній, показуємо повідомлення
    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div style="text-align:center; padding: 40px;">
          <p style="font-size: 1.2rem; color: #8c6a4a;">Ваш кошик порожній 🧸</p>
          <a href="index.html" style="color: #8c6a4a; text-decoration: underline;">Повернутися до покупок</a>
        </div>`;
      if (totalPriceElement) totalPriceElement.innerText = "0";
      return;
    }

    let total = 0;

    // Створюємо HTML для кожного товару в кошику
    cartContainer.innerHTML = cart
      .map((item, index) => {
        const priceNum = parseInt(item.price) || 0;
        const qty = parseInt(item.quantity) || 1;
        const subtotal = priceNum * qty;
        total += subtotal;

        return `
          <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #efe5db; padding-left: 50px; padding-right: 50px; ">
            <div class="cart-item-info">
              <h4 style="margin: 0; color: #5a4033;">${item.name}</h4>
              <p style="margin: 5px 0; color: #8c6a4a;">
                ${priceNum} грн x ${qty} = <b>${subtotal} грн</b>
              </p>
            </div>
            <div class="cart-item-controls" style="display: flex; align-items: center; gap: 15px; ">
              <div class="qty-control" style="display: flex; align-items: center; gap: 10px; background: #fdfaf7; padding: 5px 10px; border-radius: 20px; margin: 20px;">
                <button onclick="changeQty(${index}, -1)" style="border: none; background: none; cursor: pointer; font-weight: bold; color: #8c6a4a;">-</button>
                <span style="font-weight: bold;">${qty}</span>
                <button onclick="changeQty(${index}, 1)" style="border: none; background: none; cursor: pointer; font-weight: bold; color: #8c6a4a;">+</button>
              </div>
              <button class="delete-item" onclick="removeItem(${index})" style="background: #8c6a4a; color: #8c6a4a; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">&times;</button>
            </div>
          </div>
        `;
      })
      .join("");

    // Оновлюємо загальну суму замовлення
    if (totalPriceElement) {
      totalPriceElement.innerText = total;
    }
  }

  // --- 2. ЗМІНА КІЛЬКОСТІ (+/-) ---
  window.changeQty = function (index, delta) {
    let cart = JSON.parse(localStorage.getItem("userCart")) || [];

    if (cart[index]) {
      cart[index].quantity = (parseInt(cart[index].quantity) || 1) + delta;

      // Забороняємо кількість менше 1
      if (cart[index].quantity < 1) cart[index].quantity = 1;

      localStorage.setItem("userCart", JSON.stringify(cart));
      renderCart(); // Перемальовуємо кошик

      // Оновлюємо лічильник у хедері (якщо функція підключена)
      if (typeof updateCartUI === "function") updateCartUI();
    }
  };

  // --- 3. ВИДАЛЕННЯ ТОВАРУ ---
  window.removeItem = function (index) {
    let cart = JSON.parse(localStorage.getItem("userCart")) || [];

    cart.splice(index, 1); // Видаляємо елемент з масиву

    localStorage.setItem("userCart", JSON.stringify(cart));
    renderCart();

    if (typeof updateCartUI === "function") updateCartUI();
  };

  // Запуск логіки при відкритті сторінки
  renderCart();
});




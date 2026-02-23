document.addEventListener("DOMContentLoaded", function () {
  const showFormBtn = document.getElementById("show-form-btn");
  const reviewsForm = document.getElementById("reviews-form");
  const addReviewForm = document.getElementById("add-review-form");
  const reviewContainer = document.querySelector(".reviews-container");

  // ПЕРЕВІРКА: якщо контейнера немає, зупиняємо скрипт, щоб не було помилок
  if (!reviewContainer) {
    console.warn("Контейнер .reviews-container не знайдено на цій сторінці.");
    return;
  }

  // --- 1. СТВОРЕННЯ ЗІРОК У ФОРМІ БЕЗ ЗМІНИ HTML ---
  if (addReviewForm) {
    const starContainer = document.createElement("div");
    starContainer.className = "star-rating";
    for (let i = 5; i >= 1; i--) {
      starContainer.innerHTML += `
                <input type="radio" name="stars" value="${i}" id="star-${i}" ${i === 5 ? "checked" : ""}>
                <label for="star-${i}">★</label>
            `;
    }
    addReviewForm.prepend(starContainer); // Додаємо на початок форми
  }

  // --- 2. ФУНКЦІЯ ВІДОБРАЖЕННЯ КАРТКИ ---
  function renderReview(name, comment, stars, isNew = true) {
    const div = document.createElement("div");
    div.className = "review-card";

    // Додаємо кнопку видалення (хрестик)
    div.innerHTML = `
        <button class="delete-btn" style="float: right; cursor: pointer; background: none; border: none; color: red;">&times;</button>
        <h4>${name}</h4>
        <div>${"⭐".repeat(stars)}</div>
        <p>${comment}</p>
    `;

    // Додаємо подію для кнопки видалення
    div.querySelector(".delete-btn").onclick = function () {
      if (confirm("Видалити цей відгук?")) {
        deleteReviewFromStorage(name, comment); // Видаляємо з пам'яті
        div.remove(); // Видаляємо з екрана
      }
    };

    isNew ? reviewContainer.prepend(div) : reviewContainer.appendChild(div);
  }

  // --- 3. ЗАВАНТАЖЕННЯ З ПАМ'ЯТІ (LocalStorage) ---
  function loadReviews() {
    const saved = JSON.parse(localStorage.getItem("userReviews")) || [];
    saved.forEach((r) => renderReview(r.name, r.comment, r.stars || 5, false));
  }

  // --- 4. ПОКАЗ ФОРМИ ---
  if (showFormBtn && reviewsForm) {
    showFormBtn.addEventListener("click", () => {
      reviewsForm.classList.toggle("show");
      showFormBtn.textContent = reviewsForm.classList.contains("show")
        ? "Закрити"
        : "Залишити відгук";
    });
  }

  // --- 5. ВІДПРАВКА ФОРМИ ---
  if (addReviewForm) {
    addReviewForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = addReviewForm.querySelector('input[name="name"]').value;
      const comment = addReviewForm.querySelector(
        'textarea[name="comment"]',
      ).value;
      const stars = parseInt(
        addReviewForm.querySelector('input[name="stars"]:checked').value,
      );

      renderReview(name, comment, stars);

      // Зберігаємо у масив
      const saved = JSON.parse(localStorage.getItem("userReviews")) || [];
      saved.unshift({ name, comment, stars });
      localStorage.setItem("userReviews", JSON.stringify(saved));

      addReviewForm.reset();
      reviewsForm.classList.remove("show");
      showFormBtn.textContent = "Залишити відгук";
    });
  }

  loadReviews(); // Запускаємо при старті
});
function deleteReviewFromStorage(name, comment) {
  // 1. Отримуємо всі відгуки
  let saved = JSON.parse(localStorage.getItem("userReviews")) || [];

  // 2. Фільтруємо масив: залишаємо всі відгуки, крім того, що ми видаляємо
  // (порівнюємо ім'я та текст коментаря)
  saved = saved.filter((r) => r.name !== name || r.comment !== comment);

  // 3. Зберігаємо оновлений список назад
  localStorage.setItem("userReviews", JSON.stringify(saved));
}

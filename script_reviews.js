window.addEventListener("load", function () {
  const showFormBtn = document.getElementById("show-form-btn");
  const reviewsForm = document.getElementById("reviews-form");
  const addReviewForm = document.getElementById("add-review-form");
  const reviewContainer = document.querySelector(".reviews-container");

  if (!reviewContainer) return; // Захист від помилок

  // --- 1. ФУНКЦІЯ ВІДОБРАЖЕННЯ КАРТКИ НА ЕКРАНІ ---
  function renderReview(name, comment, stars, isNew = true) {
    const div = document.createElement("div");
    div.className = "review-card";
    div.innerHTML = `
            <button class="delete-btn" title="Видалити" style="float:right; cursor:pointer; border:none; background:none; color:red; font-size:20px;">&times;</button>
            <div class="user-info">
                <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" class="user-avatar" style="width:50px; border-radius:50%;" />
                <div>
                    <h4 class="user-name" style="margin:0;">${name}</h4>
                    <div class="rating">${"⭐".repeat(stars)}</div>
                </div>
            </div>
            <p class="review-text" style="margin-top:10px;">«${comment}»</p>
        `;

    // Логіка видалення
    div.querySelector(".delete-btn").onclick = function () {
      if (confirm("Видалити цей відгук?")) {
        removeReviewFromStorage(name, comment);
        div.remove();
      }
    };

    // Якщо новий — додаємо вгору, якщо завантажений — вниз
    if (isNew) {
      reviewContainer.prepend(div);
    } else {
      reviewContainer.appendChild(div);
    }
  }

  // --- 2. ЗАВАНТАЖЕННЯ З ПАМ'ЯТІ ПРИ ВІДКРИТТІ СТОРІНКИ ---
  function loadReviewsFromStorage() {
    const savedData = localStorage.getItem("userReviews");
    if (savedData) {
      const reviews = JSON.parse(savedData);
      reviews.forEach((rev) => {
        // Виводимо кожен збережений відгук
        renderReview(rev.name, rev.comment, rev.stars, false);
      });
    }
  }

  // --- 3. ВИДАЛЕННЯ З ПАМ'ЯТІ ---
  function removeReviewFromStorage(name, comment) {
    let reviews = JSON.parse(localStorage.getItem("userReviews")) || [];
    // Залишаємо всі, крім того, який видаляємо
    reviews = reviews.filter((r) => r.name !== name || r.comment !== comment);
    localStorage.setItem("userReviews", JSON.stringify(reviews));
  }

  // --- 4. КНОПКА ПОКАЗУ ФОРМИ ---
  if (showFormBtn && reviewsForm) {
    showFormBtn.onclick = function () {
      const isHidden =
        reviewsForm.style.display === "none" ||
        reviewsForm.style.display === "";
      reviewsForm.style.display = isHidden ? "block" : "none";
      showFormBtn.textContent = isHidden ? "Закрити" : "Залишити відгук";
    };
  }

  // --- 5. ВІДПРАВКА ФОРМИ ТА ЗБЕРЕЖЕННЯ ---
  if (addReviewForm) {
    addReviewForm.onsubmit = function (e) {
      e.preventDefault();

      const name = addReviewForm.querySelector('[name="name"]').value;
      const comment = addReviewForm.querySelector('[name="comment"]').value;
      // Шукаємо обрану зірочку, якщо їх немає — ставимо 5
      const starsInput = addReviewForm.querySelector('[name="stars"]:checked');
      const stars = starsInput ? parseInt(starsInput.value) : 5;

      // 1. Малюємо на екрані
      renderReview(name, comment, stars, true);

      // 2. Додаємо в LocalStorage
      const reviews = JSON.parse(localStorage.getItem("userReviews")) || [];
      reviews.unshift({ name, comment, stars });
      localStorage.setItem("userReviews", JSON.stringify(reviews));

      // 3. Очищуємо форму
      addReviewForm.reset();
      reviewsForm.style.display = "none";
      showFormBtn.textContent = "Залишити відгук";
    };
  }

  // ЗАПУСК: як тільки сторінка готова — вантажимо старі відгуки
  loadReviewsFromStorage();
});

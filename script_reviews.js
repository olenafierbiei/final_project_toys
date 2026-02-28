window.addEventListener("load", function () {
  const showFormBtn = document.getElementById("show-form-btn");
  const reviewsForm = document.getElementById("reviews-form");
  const addReviewForm = document.getElementById("add-review-form");
  const reviewContainer = document.querySelector(".reviews-container");

  if (!reviewContainer) return;

  // --- 1. СТВОРЕННЯ ЗІРОЧОК У ФОРМІ (якщо їх там немає) ---
  function setupFormStars() {
    if (!addReviewForm) return;

    // Перевіряємо, чи ми вже додали зірочки раніше
    if (addReviewForm.querySelector(".star-rating")) return;

    const starContainer = document.createElement("div");
    starContainer.className = "star-rating";
    for (let i = 1; i <= 5; i++) {
      starContainer.innerHTML += `
                <input type="radio" name="stars" value="${i}" id="star-${i}" ${i === 5 ? "checked" : ""}>
                <label for="star-${i}">★</label>
            `;
    }
    // Вставляємо зірочки в самий початок форми
    addReviewForm.prepend(starContainer);
  }

  // --- 2. ФУНКЦІЯ МАЛЮВАННЯ КАРТКИ ---
  function renderReview(name, comment, stars, isNew = true) {
    // Перетворюємо stars на число, якщо воно прийшло як рядок
    const count = parseInt(stars) || 5;
    const div = document.createElement("div");
    div.className = "review-card";

    div.innerHTML = `
            <button class="delete-btn" title="Видалити">&times;</button>
            <div class="user-info">
                <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" class="user-avatar" />
                <div>
                    <h4 class="user-name">${name}</h4>
                    <div class="rating">${"⭐".repeat(count)}</div>
                </div>
            </div>
            <p class="review-text">«${comment}»</p>
        `;

    // Кнопка видалення (буде прихована вашим CSS, поки ви не введете пароль)
    div.querySelector(".delete-btn").onclick = function () {
      if (document.body.classList.contains("admin-mode")) {
        if (confirm("Видалити цей відгук?")) {
          removeReviewFromStorage(name, comment);
          div.remove();
        }
      } else {
        alert("Тільки адміністратор може видаляти відгуки.");
      }
    };

    isNew ? reviewContainer.prepend(div) : reviewContainer.appendChild(div);
  }

  // --- 3. ЗБЕРЕЖЕННЯ ТА ЗАВАНТАЖЕННЯ ---
  function loadReviewsFromStorage() {
    const savedData = localStorage.getItem("userReviews");
    if (savedData) {
      const reviews = JSON.parse(savedData);
      reviews.forEach((rev) => {
        // Передаємо збережену кількість зірок
        renderReview(rev.name, rev.comment, rev.stars, false);
      });
    }
  }

  function removeReviewFromStorage(name, comment) {
    let reviews = JSON.parse(localStorage.getItem("userReviews")) || [];
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

  // --- 5. ВІДПРАВКА ФОРМИ ---
  if (addReviewForm) {
    addReviewForm.onsubmit = function (e) {
      e.preventDefault();

      const name = addReviewForm.querySelector('[name="name"]').value;
      const comment = addReviewForm.querySelector('[name="comment"]').value;
      const starsInput = addReviewForm.querySelector('[name="stars"]:checked');
      const stars = starsInput ? parseInt(starsInput.value) : 5;

      // Малюємо
      renderReview(name, comment, stars, true);

      // Зберігаємо
      const reviews = JSON.parse(localStorage.getItem("userReviews")) || [];
      reviews.unshift({ name, comment, stars });
      localStorage.setItem("userReviews", JSON.stringify(reviews));

      addReviewForm.reset();
      reviewsForm.style.display = "none";
      showFormBtn.textContent = "Залишити відгук";
    };
  }

  // ПАРОЛЬ АДМІНІСТРАТОРА (Ctrl + Shift + A)
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.shiftKey && e.code === "KeyA") {
      const pass = prompt("Введіть пароль для видалення:");
      if (pass === "1234") {
        // Встановіть свій пароль тут
        document.body.classList.add("admin-mode");
        alert("Режим адміна увімкнено. Тепер кнопки видалення працюють.");
      }
    }
  });

  // Запуск усього
  setupFormStars();
  loadReviewsFromStorage();
});

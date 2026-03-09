window.addEventListener("load", function () {
  const showFormBtn = document.getElementById("show-form-btn");
  const reviewsForm = document.getElementById("reviews-form");
  const addReviewForm = document.getElementById("add-review-form");
  const reviewContainer = document.querySelector(".reviews-container");

  if (!reviewContainer) return;

  // --- 1. СТВОРЕННЯ ЗІРОЧОК ---
  function setupFormStars() {
    if (!addReviewForm || addReviewForm.querySelector(".star-rating")) return;

    const starContainer = document.createElement("div");
    starContainer.className = "star-rating";
    // Створюємо від 5 до 1 для коректної роботи CSS-фільтрів
    for (let i = 1; i <= 5; i++) {
      starContainer.innerHTML += `
        <input type="radio" name="stars" value="${i}" id="star-${i}" ${i === 5 ? "checked" : ""}>
        <label for="star-${i}">★</label>
      `;
    }
    addReviewForm.prepend(starContainer);
  }

  // --- 2. МАЛЮВАННЯ КАРТКИ ТА ПРОКРУТКА ---
  function renderReview(name, comment, stars, isNew = true) {
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

    // Видалення
    div.querySelector(".delete-btn").onclick = function () {
      const password = prompt("Введіть пароль адміністратора для видалення:");

      // Замініть "1234" на свій секретний пароль
      if (password === "1234") {
        if (confirm("Видалити цей відгук?")) {
          removeReviewFromStorage(name, comment);
          div.remove();
          alert("Відгук видалено.");
        }
      } else {
        alert("Невірний пароль! Доступ заборонено.");
      }
    };


    function renderReviews() {
      const container = document.getElementById("reviews-container");
      const reviews = JSON.parse(localStorage.getItem("userReviews")) || [];
      container.innerHTML = "";

      reviews.forEach((rev, index) => {
        const div = document.createElement("div");
        div.className = "review-card";

        // Додаємо HTML картки
        div.innerHTML = `
      <div class="review-header">
        <strong>${rev.name}</strong>
        <div class="stars">${"★".repeat(rev.rating)}${"☆".repeat(5 - rev.rating)}</div>
      </div>
      <p>"${rev.comment}"</p>
      
      <button class="admin-delete-btn" onclick="deleteSpecificReview(${index})">&times;</button>
    `;

        container.appendChild(div);
      });
    }
    window.deleteSpecificReview = function (index) {
      if (confirm("Ви впевнені, що хочете видалити саме цей відгук?")) {
        let reviews = JSON.parse(localStorage.getItem("userReviews")) || [];

        // Видаляємо 1 елемент за вказаним індексом
        reviews.splice(index, 1);

        // Зберігаємо оновлений масив назад у LocalStorage
        localStorage.setItem("userReviews", JSON.stringify(reviews));

        // Перемальовуємо відгуки, щоб видалений зник зі сторінки
        renderReviews();
      }
    };

    // Додаємо картку
    if (isNew) {
      reviewContainer.prepend(div);
      // ПРОКРУТКА ДО НОВОГО ВІДГУКУ
      reviewContainer.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      reviewContainer.appendChild(div);
    }
  }

  // --- 3. LOCAL STORAGE ---
  function loadReviewsFromStorage() {
    const saved = JSON.parse(localStorage.getItem("userReviews")) || [];
    // Використовуємо reverse, щоб при послідовному додаванні через append зберегти порядок
    saved
      .reverse()
      .forEach((rev) => renderReview(rev.name, rev.comment, rev.stars, false));
  }

  function removeReviewFromStorage(name, comment) {
    let reviews = JSON.parse(localStorage.getItem("userReviews")) || [];
    reviews = reviews.filter((r) => r.name !== name || r.comment !== comment);
    localStorage.setItem("userReviews", JSON.stringify(reviews));
  }

  // --- 4. УПРАВЛІННЯ ФОРМОЮ ---
  if (showFormBtn && reviewsForm) {
    showFormBtn.onclick = function () {
      const isHidden =
        reviewsForm.style.display === "none" || !reviewsForm.style.display;
      reviewsForm.style.display = isHidden ? "block" : "none";
      showFormBtn.textContent = isHidden ? "Закрити" : "Залишити відгук";
    };
  }

  if (addReviewForm) {
    addReviewForm.onsubmit = function (e) {
      e.preventDefault();
      const name = addReviewForm.querySelector('[name="name"]').value;
      const comment = addReviewForm.querySelector('[name="comment"]').value;
      const stars =
        addReviewForm.querySelector('[name="stars"]:checked')?.value || 5;

      renderReview(name, comment, stars, true);

      const reviews = JSON.parse(localStorage.getItem("userReviews")) || [];
      reviews.unshift({ name, comment, stars });
      localStorage.setItem("userReviews", JSON.stringify(reviews));

      addReviewForm.reset();
      reviewsForm.style.display = "none";
      showFormBtn.textContent = "Залишити відгук";
    };
  }

  // --- 5. АДМІН-РЕЖИМ (Ctrl + Shift + A) ---
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.shiftKey && e.code === "KeyA") {
      if (prompt("Пароль:") === "1234") {
        document.body.classList.toggle("admin-mode");
        alert("Режим адміністратора змінено.");
      }
    }
  });

  setupFormStars();
  loadReviewsFromStorage();
});

// --- 6. РУЧНА ПРОКРУТКА КНОПКАМИ ---

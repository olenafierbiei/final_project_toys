window.addEventListener("load", function () {
  console.log("Сайт завантажено, запускаю слайдер...");

  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let index = 0;

  if (slides.length === 0) {
    console.error("Слайди не знайдено! Перевір HTML-класи.");
    return;
  }

  // Функція, яка тільки ОНОВЛЮЕ вигляд (класи)
  function updateDisplay() {
    slides.forEach((s) => s.classList.remove("active"));
    dots.forEach((d) => d.classList.remove("active"));

    slides[index].classList.add("active");
    dots[index].classList.add("active");
    console.log("Показано слайд №" + (index + 1));
  }

  // Функція, яка перемикає на НАСТУПНИЙ слайд (для таймера)
  function changaSlide() {
    index++;
    if (index >= slides.length) {
      index = 0;
    }
    updateDisplay();
  }

  // Кліки по крапочках
  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", function () {
      index = dotIndex; // Міняємо номер на той, по якому клікнули
      updateDisplay();

      // Скидаємо і заново запускаємо таймер
      clearInterval(timer);
      timer = setInterval(changaSlide, 5000);
    });
  });

  // Запускаємо автоматичне перемикання
  let timer = setInterval(changaSlide, 5000);
});

/* Код для адаптивності header */
/* Код для адаптивного меню (зверху-вниз) */
function initBurgerMenu() {
  const burger = document.getElementById("burger-menu");
  const navLinks = document.getElementById("nav-links");

  if (burger && navLinks) {
    // Очищуємо старі події перед додаванням нової
    burger.onclick = function (e) {
      e.stopPropagation(); // Щоб клік не "пролітав" далі
      navLinks.classList.toggle("active");
      burger.classList.toggle("open");
    };

    // Закриваємо меню при кліку на посилання
    navLinks.querySelectorAll("a").forEach((link) => {
      link.onclick = function () {
        navLinks.classList.remove("active");
        burger.classList.remove("open");
      };
    });

    // Закриваємо, якщо клікнули повз меню
    document.onclick = function (e) {
      if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("active");
        burger.classList.remove("open");
      }
    };
    console.log("Меню успішно ініціалізовано!");
  }
}
/*код для модального вікна*/
function initAuthModal() {
  const profileBtn = document.getElementById("profile-btn");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("close-modal"); // Нова кнопка
  const loginForm = document.getElementById("login-form");
  const regForm = document.getElementById("reg-form");
  const regLink = loginForm.querySelector("a");
  const loginLink = regForm.querySelector("a");

  // Відкриття модалки
  profileBtn.addEventListener("click", function () {
    modal.showModal();
  });

  // ЗАКРИТТЯ модалки
  closeModal.addEventListener("click", function () {
    modal.close();
  });

  // Перемикання на реєстрацію
  regLink.addEventListener("click", function (e) {
    e.preventDefault();
    regForm.hidden = false;
    loginForm.hidden = true;
  });

  // Перемикання на вхід
  loginLink.addEventListener("click", function (e) {
    e.preventDefault();
    loginForm.hidden = false;
    regForm.hidden = true;
  });

  // Закриття при кліку на фон (бекдроп)
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });
}
// Запускаємо перевірку кожну секунду, поки меню не з'явиться (для include.js)
let checkExist = setInterval(function () {
  if (document.getElementById("burger-menu")) {
    initBurgerMenu();
    initAuthModal();
    clearInterval(checkExist);
  }
}, 500);



/* обробник для пошуку */
document.addEventListener("click", function (e) {
  const searchContainer = document.getElementById("search-container");
  const searchInput = document.getElementById("search-input");

  // 1. Відкриття пошуку при кліку на іконку
  if (e.target.id === "search-icon" || e.target.closest("#search-icon")) {
    if (searchContainer) {
      searchContainer.style.setProperty("display", "block", "important");
      if (searchInput) searchInput.focus();
      console.log("Пошук відкритий");
    }
  }

  // 2. Закриття пошуку при кліку на хрестик
  if (e.target.id === "search-close") {
    if (searchContainer) {
      searchContainer.style.display = "none";
      if (searchInput) searchInput.value = "";
      document.getElementById("search-results").innerHTML = "";
    }
  }
});

// 3. Логіка самого пошуку
document.addEventListener("input", function (e) {
  if (e.target.id === "search-input") {
    const query = e.target.value.toLowerCase().trim();
    const resultsContainer = document.getElementById("search-results");

    // База даних товарів по файлах
    const allProducts = [
      // Пледи (blanket.html)
      { name: 'Плед "Ведмедик"', url: "blanket.html" },
      { name: 'Плед "Серце"', url: "blanket.html" },
      { name: 'Дитячий плед "Хмаринка"', url: "blanket.html" },

      // Іграшки для малюків (toys_for_baby.html)
      { name: "Брязкальце Зайка з бантиком", url: "toys_for_baby.html" },
      { name: "Брязкальце Ведмедик", url: "toys_for_baby.html" },
      { name: "Набір Ведмедик + Зайченя", url: "toys_for_baby.html" },

      // Іграшки (toys.html)
      { name: "В’язаний Зайчик", url: "toys.html" },
      { name: "Ведмедик амігурумі", url: "toys.html" },
      { name: "Лялька ручної роботи", url: "toys.html" },
    ];

    if (query.length > 1) {
      const filtered = allProducts.filter((p) =>
        p.name.toLowerCase().includes(query),
      );

      resultsContainer.innerHTML = filtered
        .map(
          (p) => `
                <div class="search-item" onclick="window.location.href='${p.url}'">
                    ${p.name}
                </div>
            `,
        )
        .join("");

      resultsContainer.style.display = filtered.length ? "block" : "none";
    } else {
      resultsContainer.innerHTML = "";
    }
  }
});

document.addEventListener("input", function (e) {
  if (e.target.id === "search-input") {
    const query = e.target.value.toLowerCase().trim();
    const resultsContainer = document.getElementById("search-results");

    const allProducts = [
      // Пледи
      {
        name: 'Плед "Ведмедик"',
        url: "blanket.html",
        image: "img/blanket_for_children/img4.png",
      },
      {
        name: 'Плед "Серце"',
        url: "blanket.html",
        image: "img/blanket_for_children/img5.png",
      },

      {
        name: `Плед "Мережево"`,
        url: "blanket.html",
        image: "img/blanket_for_children/img6.png",
      },
      // Іграшки для малюків
      {
        name: "Брязкальце Зайка",
        url: "toys_for_baby.html",
        image: "img/toys_for_babies/for_baby5.png",
      },
      {
        name: "Брязкальце Ведмедик",
        url: "toys_for_baby.html",
        image: "img/toys_for_babies/for_baby3.png",
      },
      {
        name: 'Набір "Ведмедик + Зайченя"',
        url: "toys_for_baby.html",
        image: "img/toys_for_babies/for_baby7.png",
      },
      {
        name: 'Іграшка-брязкальце "Зайка з бантиком"',
        url: "toys_for_baby.html",
        image: "img/toys_for_babies/for_baby5.png",
      },
      //Іграшки
      {
        name: 'Іграшка "Совушка"',
        url: "toys.html",
        image: "img/toys/toy2.png",
      },
      {
        name: 'Іграшка-брелок "Міньйон"',
        url: "toys.html",
        image: "img/toys/toy4.png",
      },
      {
        name: 'Іграшка "Зайка"',
        url: "toys.html",
        image: "img/toys/toy5.png",
      },
      {
        name: 'Іграшка "Мішка"',
        url: "toys.html",
        image: "img/toys/toy7.png",
      },
      {
        name: 'Іграшка "Зайка з шапочкою"',
        url: "toys.html",
        image: "img/toys/toy9.png",
      },
      {
        name: 'Іграшка-лялька "Червоний капелюшок"',
        url: "toys.html",
        image: "img/toys/toy8.png",
      },
      {
        name: 'Іграшка "Печенька"',
        url: "toys.html",
        image: "img/toys/toy1.png",
      },
    ];

    if (query.length > 1) {
      const filtered = allProducts.filter((p) =>
        p.name.toLowerCase().includes(query),
      );

      resultsContainer.innerHTML = filtered
        .map(
          (p) => `
                <div class="search-item" onclick="window.location.href='${p.url}'">
                    <img src="${p.image}" alt="${p.name}" class="search-img-preview">
                    <div class="search-info">
                        <span class="search-name">${p.name}</span>
                    </div>
                </div>
            `,
        )
        .join("");

      resultsContainer.style.display = filtered.length ? "block" : "none";
    } else {
      resultsContainer.innerHTML = "";
    }
  }
});

// Функція оновлення лічильника в хедері (має бути в script.js)
function updateCartUI() {
  const cartCountElement = document.getElementById("cart-count");
  if (!cartCountElement) return;
  const cart = JSON.parse(localStorage.getItem("userCart")) || [];
  const totalItems = cart.reduce(
    (sum, item) => sum + (parseInt(item.quantity) || 0),
    0,
  );
  cartCountElement.innerText = totalItems;
  cartCountElement.style.display = totalItems > 0 ? "flex" : "none";
}

document.addEventListener("click", function (e) {
  // Шукаємо клік по кнопці "Замовити"
  if (e.target.classList.contains("button_product")) {
    const card = e.target.closest(".info_product");
    if (!card) return;

    const name = card.querySelector("h4").innerText;
    // Отримуємо ціну і залишаємо ТІЛЬКИ цифри (наприклад, "500 грн" -> 500)
    const rawPrice = card.querySelector("p").innerText;
    const priceNum = parseInt(rawPrice.replace(/\D/g, "")) || 0;

    const qtyInput = card.querySelector(".quantity input");
    const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

    let cart = JSON.parse(localStorage.getItem("userCart")) || [];

    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // Зберігаємо вже чисте числове значення ціни
      cart.push({ name, price: priceNum, quantity });
    }

    localStorage.setItem("userCart", JSON.stringify(cart));
    updateCartUI();
  }
});

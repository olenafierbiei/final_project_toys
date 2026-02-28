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

// Запускаємо перевірку кожну секунду, поки меню не з'явиться (для include.js)
let checkExist = setInterval(function () {
  if (document.getElementById("burger-menu")) {
    initBurgerMenu();
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
        image: "img/blankets/bear_blanket.png",
      },
      {
        name: 'Плед "Серце"',
        url: "blanket.html",
        image: "img/blankets/heart_blanket.png",
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
        name: 'Іграшка-брязкальце "Зайка з бантиком"',
        url: "toys_for_baby.html",
        image: "img/toys_for_babies/for_baby5.png",
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

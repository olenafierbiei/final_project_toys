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

/* Універсальний обробник для пошуку */
document.addEventListener("click", function (e) {
  const searchContainer = document.getElementById("search-container");
  const searchIcon = document.getElementById("search-icon");
  const searchInput = document.getElementById("search-input");

  // 1. Якщо натиснули на іконку пошуку — відкриваємо/закриваємо
  if (e.target.id === "search-icon" || e.target.closest("#search-icon")) {
    searchContainer.classList.toggle("active");
    if (searchContainer.classList.contains("active")) {
      searchInput.focus();
    }
  }
  // 2. Якщо натиснули на кнопку закриття (X)
  else if (e.target.id === "search-close") {
    searchContainer.classList.remove("active");
  }
  // 3. Якщо натиснули будь-де поза пошуком — закриваємо табличку
  else if (searchContainer && !searchContainer.contains(e.target)) {
    searchContainer.classList.remove("active");
  }
});

// Обробка Enter у полі пошуку
document.addEventListener("keypress", function (e) {
  const searchInput = document.getElementById("search-input");
  if (e.key === "Enter" && document.activeElement === searchInput) {
    const query = searchInput.value.trim();
    if (query) {
      alert("Ви шукаєте: " + query);
      // Тут можна додати логіку фільтрації товарів
    }
  }
});

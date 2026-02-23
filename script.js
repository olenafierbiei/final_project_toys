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

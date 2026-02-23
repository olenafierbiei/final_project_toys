function includeHTML() {
  // Шукаємо місце для шапки
  const headerPlace = document.getElementById("header-placeholder");
  if (headerPlace) {
    fetch("header.html")
      .then((response) => response.text())
      .then((data) => {
        headerPlace.innerHTML = data;
      });
  }

  // Шукаємо місце для футера
  const footerPlace = document.getElementById("footer-placeholder");
  if (footerPlace) {
    fetch("footer.html")
      .then((response) => response.text())
      .then((data) => {
        footerPlace.innerHTML = data;
      });
  }
}

// Запускаємо функцію
includeHTML();

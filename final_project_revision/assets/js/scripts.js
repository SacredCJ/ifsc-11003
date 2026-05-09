/* ---------- Theme toggle setup ---------- */

const themeToggle = document.querySelector("#theme-toggle");
const savedTheme = localStorage.getItem("theme");

/* Applies saved light mode when the page loads */
if (savedTheme === "light") {
  document.body.classList.add("light-mode");
}

/* Changes the theme button text and saves the selected theme */
if (themeToggle) {
  if (document.body.classList.contains("light-mode")) {
    themeToggle.textContent = "Dark Mode";
  } else {
    themeToggle.textContent = "Light Mode";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
      localStorage.setItem("theme", "light");
      themeToggle.textContent = "Dark Mode";
    } else {
      localStorage.setItem("theme", "dark");
      themeToggle.textContent = "Light Mode";
    }
  });
}

/* ---------- Comparison table filter ---------- */

const filterButtons = document.querySelectorAll(".comparison-controls button");
const comparisonRows = document.querySelectorAll(".comparison-table tbody tr");

/* Shows only the selected console generation in the comparison table */
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    comparisonRows.forEach((row) => {
      if (filter === "all" || row.dataset.generation === filter) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
});
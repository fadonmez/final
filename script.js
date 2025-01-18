document.addEventListener("DOMContentLoaded", () => {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const hamburgerIcon = hamburgerBtn.querySelector(".hamburger-icon");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const desktopLinks = document.querySelectorAll(".nav-link");

  hamburgerBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    hamburgerIcon.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active")
      ? "hidden"
      : "auto";
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const currentPage =
        window.location.pathname.split("/").pop() || "index.html";
      const targetPage = link.getAttribute("href");

      if (currentPage === targetPage) {
        e.preventDefault();
        mobileMenu.classList.remove("active");
        hamburgerIcon.classList.remove("active");
        document.body.style.overflow = "auto";
        return;
      }
    });
  });

  desktopLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const currentPage =
        window.location.pathname.split("/").pop() || "index.html";
      const targetPage = link.getAttribute("href");

      if (currentPage === targetPage) {
        e.preventDefault();
      }
    });
  });

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  desktopLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  mobileLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  document.addEventListener("click", (e) => {
    if (
      mobileMenu.classList.contains("active") &&
      !mobileMenu.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      mobileMenu.classList.remove("active");
      hamburgerIcon.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  const addCoffeeForm = document.getElementById("addCoffeeForm");
  const saveCoffeeBtn = document.getElementById("saveCoffeeBtn");
  const addCoffeeModal = new bootstrap.Modal(
    document.getElementById("addCoffeeModal")
  );
  const alertContainer = document.getElementById("alertContainer");

  loadSavedCoffees();

  if (saveCoffeeBtn) {
    saveCoffeeBtn.addEventListener("click", () => {
      const name = document.getElementById("coffeeName").value.trim();
      const description = document
        .getElementById("coffeeDescription")
        .value.trim();
      const category = document.getElementById("coffeeCategory").value;

      if (!name || !description || !category) {
        showAlert("Lütfen tüm alanları doldurun!", "danger");
        return;
      }
      const newCoffee = createCoffeeCard(name, description);

      const categoryContainer =
        category === "espresso"
          ? document.querySelector(".col-md-6:first-child")
          : document.querySelector(".col-md-6:last-child");

      if (categoryContainer) {
        categoryContainer.appendChild(newCoffee);

        saveCoffee({
          name,
          description,
          category,
        });

        showAlert("Kahve başarıyla eklendi!", "success");
        addCoffeeForm.reset();
        addCoffeeModal.hide();
      }
    });
  }

  function saveCoffee(coffee) {
    let coffees = JSON.parse(localStorage.getItem("coffees") || "[]");
    coffees.push(coffee);
    localStorage.setItem("coffees", JSON.stringify(coffees));
  }

  function loadSavedCoffees() {
    const coffees = JSON.parse(localStorage.getItem("coffees") || "[]");

    coffees.forEach((coffee) => {
      const newCoffee = createCoffeeCard(coffee.name, coffee.description);
      const categoryContainer =
        coffee.category === "espresso"
          ? document.querySelector(".col-md-6:first-child")
          : document.querySelector(".col-md-6:last-child");

      if (categoryContainer) {
        categoryContainer.appendChild(newCoffee);
      }
    });
  }

  function createCoffeeCard(name, description) {
    const cardWrapper = document.createElement("div");
    cardWrapper.className = "coffee-card-wrapper mt-3";

    const card = document.createElement("div");
    card.className = "card bg-dark text-light border-secondary";
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <p class="card-text">${description}</p>
      </div>
    `;

    cardWrapper.appendChild(card);
    return cardWrapper;
  }

  function showAlert(message, type) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertContainer.innerHTML = "";
    alertContainer.appendChild(alert);

    setTimeout(() => {
      alert.classList.remove("show");
      setTimeout(() => alert.remove(), 150);
    }, 3000);
  }
});

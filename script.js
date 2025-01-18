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

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const name = document.getElementById("name").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!email || !name || !subject || !message) {
        showAlert(
          "Lütfen tüm alanları doldurunuz.",
          "danger",
          "contactAlertContainer"
        );
        return;
      }

      showAlert(
        `Sayın ${name}, mesajınız başarıyla gönderildi! En kısa sürede ${email} adresinden size ulaşacağız.`,
        "success",
        "contactAlertContainer"
      );

      this.reset();
    });
  }

  const addCoffeeForm = document.getElementById("addCoffeeForm");
  const saveCoffeeBtn = document.getElementById("saveCoffeeBtn");
  const addCoffeeModal = document.getElementById("addCoffeeModal")
    ? new bootstrap.Modal(document.getElementById("addCoffeeModal"))
    : null;

  if (saveCoffeeBtn) {
    saveCoffeeBtn.addEventListener("click", () => {
      const name = document.getElementById("coffeeName").value.trim();
      const description = document
        .getElementById("coffeeDescription")
        .value.trim();
      const category = document.getElementById("coffeeCategory").value;

      if (!name || !description || !category) {
        showAlert("Lütfen tüm alanları doldurun!", "danger", "alertContainer");
        return;
      }

      const coffee = { name, description, category };
      const id = saveCoffee(coffee);
      const newCoffee = createCoffeeCard(name, description, id);

      const categoryContainer =
        category === "espresso"
          ? document.querySelector(".col-md-6:first-child")
          : document.querySelector(".col-md-6:last-child");

      if (categoryContainer) {
        categoryContainer.appendChild(newCoffee);
        showAlert("Kahve başarıyla eklendi!", "success", "alertContainer");
        addCoffeeForm.reset();
        addCoffeeModal.hide();
      }
    });
  }

  function showAlert(message, type, containerId) {
    const alertContainer = document.getElementById(containerId);
    if (!alertContainer) return;

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
    }, 5000);
  }

  function createCoffeeCard(name, description, id, category) {
    const cardWrapper = document.createElement("div");
    cardWrapper.className = "coffee-card-wrapper mt-3";
    cardWrapper.dataset.id = id;

    const card = document.createElement("div");
    card.className = "card bg-dark text-light border-secondary";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const titleRow = document.createElement("div");
    titleRow.className =
      "d-flex justify-content-between align-items-start mb-2";

    const title = document.createElement("h5");
    title.className = "card-title mb-0";
    title.textContent = name;

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "btn-group ms-2";

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-outline-primary btn-sm";
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.onclick = () => showUpdateModal(id);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-outline-danger btn-sm";
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.onclick = () => showDeleteConfirmation(id);

    buttonGroup.appendChild(editBtn);
    buttonGroup.appendChild(deleteBtn);

    titleRow.appendChild(title);
    titleRow.appendChild(buttonGroup);

    const description_p = document.createElement("p");
    description_p.className = "card-text";
    description_p.textContent = description;

    cardBody.appendChild(titleRow);
    cardBody.appendChild(description_p);
    card.appendChild(cardBody);
    cardWrapper.appendChild(card);

    return cardWrapper;
  }

  function saveCoffee(coffee) {
    let coffees = JSON.parse(localStorage.getItem("coffees") || "[]");
    coffee.id = Date.now().toString();
    coffees.push(coffee);
    localStorage.setItem("coffees", JSON.stringify(coffees));
    return coffee.id;
  }

  function updateCoffee(id, updatedData) {
    let coffees = JSON.parse(localStorage.getItem("coffees") || "[]");
    const index = coffees.findIndex((coffee) => coffee.id === id);

    if (index !== -1) {
      coffees[index] = { ...coffees[index], ...updatedData };
      localStorage.setItem("coffees", JSON.stringify(coffees));
      return true;
    }
    return false;
  }

  function getCoffeeById(id) {
    const coffees = JSON.parse(localStorage.getItem("coffees") || "[]");
    return coffees.find((coffee) => coffee.id === id);
  }

  let updateModalInstance = null;

  function showUpdateModal(id) {
    const coffee = getCoffeeById(id);
    if (!coffee) return;

    // Modal instance'ı temizle ve yeniden oluştur
    if (updateModalInstance) {
      updateModalInstance.dispose();
    }
    updateModalInstance = new bootstrap.Modal(
      document.getElementById("updateCoffeeModal")
    );

    // Form alanlarını doldur
    document.getElementById("updateCoffeeId").value = coffee.id;
    document.getElementById("updateCoffeeName").value = coffee.name;
    document.getElementById("updateCoffeeDescription").value =
      coffee.description;
    document.getElementById("updateCoffeeCategory").value = coffee.category;

    // Güncelleme butonuna event listener ekle
    const updateBtn = document.getElementById("updateCoffeeBtn");
    const handleUpdate = () => {
      const updatedData = {
        name: document.getElementById("updateCoffeeName").value.trim(),
        description: document
          .getElementById("updateCoffeeDescription")
          .value.trim(),
        category: document.getElementById("updateCoffeeCategory").value,
      };

      if (
        !updatedData.name ||
        !updatedData.description ||
        !updatedData.category
      ) {
        showAlert("Lütfen tüm alanları doldurun!", "danger", "alertContainer");
        return;
      }

      const success = updateCoffee(coffee.id, updatedData);
      if (success) {
        // Mevcut kartı bul ve güncelle
        const oldCard = document.querySelector(`[data-id="${coffee.id}"]`);
        if (oldCard) {
          const newCard = createCoffeeCard(
            updatedData.name,
            updatedData.description,
            coffee.id,
            updatedData.category
          );

          // Kategori değiştiyse, kartı yeni kategoriye taşı
          const targetContainer =
            updatedData.category === "espresso"
              ? document.querySelector(".col-md-6:first-child")
              : document.querySelector(".col-md-6:last-child");

          if (targetContainer) {
            if (oldCard.parentElement === targetContainer) {
              oldCard.replaceWith(newCard);
            } else {
              oldCard.remove();
              targetContainer.appendChild(newCard);
            }
          }
        }

        showAlert("Kahve başarıyla güncellendi!", "success", "alertContainer");
        updateModalInstance.hide();
      }
    };

    // Önceki event listener'ları temizle ve yenisini ekle
    updateBtn.removeEventListener("click", handleUpdate);
    updateBtn.addEventListener("click", handleUpdate);

    updateModalInstance.show();
  }

  function deleteCoffee(id) {
    let coffees = JSON.parse(localStorage.getItem("coffees") || "[]");
    const updatedCoffees = coffees.filter((coffee) => coffee.id !== id);
    localStorage.setItem("coffees", JSON.stringify(updatedCoffees));
    return updatedCoffees.length !== coffees.length;
  }

  let deleteModalInstance = null;
  let currentDeleteHandler = null;

  function showDeleteConfirmation(id) {
    if (deleteModalInstance) {
      deleteModalInstance.dispose();
    }

    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    if (currentDeleteHandler) {
      confirmDeleteBtn.removeEventListener("click", currentDeleteHandler);
    }

    deleteModalInstance = new bootstrap.Modal(
      document.getElementById("deleteConfirmModal")
    );

    currentDeleteHandler = () => {
      const success = deleteCoffee(id);
      if (success) {
        const element = document.querySelector(`[data-id="${id}"]`);
        if (element) {
          element.remove();
          showAlert("Kahve başarıyla silindi!", "success", "alertContainer");
        }
      }
      deleteModalInstance.hide();
    };

    confirmDeleteBtn.addEventListener("click", currentDeleteHandler);
    deleteModalInstance.show();
  }

  if (currentPage === "menu.html") {
    const coffees = JSON.parse(localStorage.getItem("coffees") || "[]");
    coffees.forEach((coffee) => {
      const newCoffee = createCoffeeCard(
        coffee.name,
        coffee.description,
        coffee.id,
        coffee.category
      );
      const categoryContainer =
        coffee.category === "espresso"
          ? document.querySelector(".col-md-6:first-child")
          : document.querySelector(".col-md-6:last-child");

      if (categoryContainer) {
        categoryContainer.appendChild(newCoffee);
      }
    });
  }

  // Counter Animation
  const counters = document.querySelectorAll(".counter");
  const speed = 200; // Animasyon hızı (ms)

  const animateCounter = (counter) => {
    const target = +counter.getAttribute("data-target");
    let count = 0;

    const updateCount = () => {
      const increment = target / speed;

      if (count < target) {
        count = Math.ceil(count + increment);
        counter.innerText = count.toLocaleString();
        setTimeout(updateCount, 1);
      } else {
        counter.innerText = target.toLocaleString();
      }
    };

    updateCount();
  };

  // Intersection Observer for counter animation
  const observerOptions = {
    root: null,
    threshold: 0.1,
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  counters.forEach((counter) => {
    observer.observe(counter);
  });

  // Gallery Functionality
  const filterButtons = document.querySelectorAll(".filter-buttons .btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (filterButtons.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        // Add active class to clicked button
        button.classList.add("active");

        const filter = button.getAttribute("data-filter");

        galleryItems.forEach((item) => {
          const category = item.getAttribute("data-category");

          if (filter === "all" || filter === category) {
            item.classList.remove("hidden");
          } else {
            item.classList.add("hidden");
          }
        });
      });
    });
  }

  // Initialize Lightbox
  if (typeof lightbox !== "undefined") {
    lightbox.option({
      resizeDuration: 200,
      wrapAround: true,
      albumLabel: "Fotoğraf %1 / %2",
      fadeDuration: 300,
    });
  }

  // Timeline Animation
  const timelineItems = document.querySelectorAll(".timeline-item");
  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          timelineObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  timelineItems.forEach((item) => {
    timelineObserver.observe(item);
  });

  // Skill Bars Animation
  const skillBars = document.querySelectorAll(".skill-bar");
  const skillBarObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const percentage = entry.target.getAttribute("data-percentage");
          const fill = entry.target.querySelector(".skill-bar-fill");
          fill.style.width = `${percentage}%`;
          skillBarObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  skillBars.forEach((bar) => {
    skillBarObserver.observe(bar);
  });
});

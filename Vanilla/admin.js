const adminState = {
  currentEdit: null,
  searchTerm: ""
};

const products = [
  { id: 1, name: "Classic Shirt", category: "Shirts", startingPrice: 499, deliveryTime: "5 days", featured: true, image: "assets/images/shirt.svg" },
  { id: 2, name: "Executive Blazer", category: "Blazers", startingPrice: 1999, deliveryTime: "7 days", featured: true, image: "assets/images/blazer.svg" },
  { id: 3, name: "Wedding Sherwani", category: "Sherwani", startingPrice: 2999, deliveryTime: "10 days", featured: false, image: "assets/images/sherwani.svg" }
];

const styles = [
  { id: 1, name: "Formal Suit", category: "Formal", occasion: "Business", image: "assets/images/blazer.svg" },
  { id: 2, name: "Casual Shirt", category: "Casual", occasion: "Daily Wear", image: "assets/images/shirt.svg" }
];

const categories = [
  { id: 1, name: "Shirts", description: "Formal and casual shirts tailored to your measurements." },
  { id: 2, name: "Blazers", description: "Stylish blazers for events, meetings, and celebrations." },
  { id: 3, name: "Sherwani", description: "Traditional sherwani designs for weddings and ceremonies." }
];

const testimonials = [
  { id: 1, customerName: "Sachin Patil", quote: "The fit was excellent and the service was fast.", rating: 5 },
  { id: 2, customerName: "Rohit Deshmukh", quote: "High quality tailoring at an honest price.", rating: 5 }
];

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const loginScreen = document.getElementById("login-screen");
const adminApp = document.getElementById("admin-app");
const logoutButton = document.getElementById("logout-button");
const adminSearch = document.getElementById("admin-search");

function updateCounts() {
  document.getElementById("products-count").textContent = products.length;
  document.getElementById("styles-count").textContent = styles.length;
  document.getElementById("categories-count").textContent = categories.length;
  document.getElementById("testimonials-count").textContent = testimonials.length;
}

function createActionCell(type, id) {
  return `
    <td>
      <div class="admin-actions">
        <button class="small-btn" data-action="edit" data-type="${type}" data-id="${id}">Edit</button>
        <button class="small-btn danger" data-action="delete" data-type="${type}" data-id="${id}">Delete</button>
      </div>
    </td>
  `;
}

function renderTable(type) {
  const tableBody = document.getElementById(`${type}-table-body`);
  const term = adminState.searchTerm.trim().toLowerCase();
  let items = [];

  if (type === "products") items = products;
  if (type === "styles") items = styles;
  if (type === "categories") items = categories;
  if (type === "testimonials") items = testimonials;

  if (term) {
    items = items.filter((item) => Object.values(item).some((value) => String(value).toLowerCase().includes(term)));
  }

  const rows = items.map((item) => {
    if (type === "products") {
      return `
        <tr>
          <td>${item.name}</td>
          <td>${item.category}</td>
          <td>₹${item.startingPrice}</td>
          <td>${item.deliveryTime}</td>
          <td>${item.featured ? "Yes" : "No"}</td>
          ${createActionCell(type, item.id)}
        </tr>
      `;
    }
    if (type === "styles") {
      return `
        <tr>
          <td>${item.name}</td>
          <td>${item.category}</td>
          <td>${item.occasion}</td>
          ${createActionCell(type, item.id)}
        </tr>
      `;
    }
    if (type === "categories") {
      return `
        <tr>
          <td>${item.name}</td>
          <td>${item.description}</td>
          ${createActionCell(type, item.id)}
        </tr>
      `;
    }
    if (type === "testimonials") {
      return `
        <tr>
          <td>${item.customerName}</td>
          <td>${item.quote}</td>
          <td>${"★".repeat(item.rating)}</td>
          ${createActionCell(type, item.id)}
        </tr>
      `;
    }
    return "";
  });

  tableBody.innerHTML = rows.join("") || `
    <tr><td colspan="6" style="color: var(--text-soft); padding:1.5rem;">No matching ${type} found.</td></tr>
  `;
}

function renderAllTables() {
  renderTable("products");
  renderTable("styles");
  renderTable("categories");
  renderTable("testimonials");
  updateCounts();
}

function resetEditState() {
  adminState.currentEdit = null;
  document.getElementById("product-form-title").textContent = "Add Product";
  document.getElementById("style-form-title").textContent = "Add Style";
  document.getElementById("category-form-title").textContent = "Add Category";
  document.getElementById("testimonial-form-title").textContent = "Add Testimonial";
}

function clearMessages() {
  ["product-form-message", "style-form-message", "category-form-message", "testimonial-form-message"].forEach((id) => {
    document.getElementById(id).textContent = "";
  });
}

function displayFormMessage(type, message) {
  document.getElementById(`${type}-form-message`).textContent = message;
}

function handleActionClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const type = button.dataset.type;
  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "edit") {
    setEdit(type, id);
  }
  if (action === "delete") {
    deleteItem(type, id);
  }
}

function findItem(type, id) {
  const map = { products, styles, categories, testimonials };
  return map[type].find((item) => item.id === id);
}

function setEdit(type, id) {
  const item = findItem(type, id);
  if (!item) return;
  adminState.currentEdit = { type, id };
  clearMessages();

  if (type === "products") {
    document.getElementById("product-form-title").textContent = "Edit Product";
    document.getElementById("product-name").value = item.name;
    document.getElementById("product-category").value = item.category;
    document.getElementById("product-price").value = item.startingPrice;
    document.getElementById("product-delivery").value = item.deliveryTime;
    document.getElementById("product-image").value = item.image;
    document.getElementById("product-featured").checked = item.featured;
  }
  if (type === "styles") {
    document.getElementById("style-form-title").textContent = "Edit Style";
    document.getElementById("style-name").value = item.name;
    document.getElementById("style-category").value = item.category;
    document.getElementById("style-occasion").value = item.occasion;
    document.getElementById("style-image").value = item.image;
  }
  if (type === "categories") {
    document.getElementById("category-form-title").textContent = "Edit Category";
    document.getElementById("category-name").value = item.name;
    document.getElementById("category-description").value = item.description;
  }
  if (type === "testimonials") {
    document.getElementById("testimonial-form-title").textContent = "Edit Testimonial";
    document.getElementById("testimonial-name").value = item.customerName;
    document.getElementById("testimonial-quote").value = item.quote;
    document.getElementById("testimonial-rating").value = item.rating;
  }
}

function deleteItem(type, id) {
  if (!confirm("Remove this item from the dashboard?")) return;
  if (type === "products") {
    const index = products.findIndex((item) => item.id === id);
    if (index >= 0) products.splice(index, 1);
  }
  if (type === "styles") {
    const index = styles.findIndex((item) => item.id === id);
    if (index >= 0) styles.splice(index, 1);
  }
  if (type === "categories") {
    const index = categories.findIndex((item) => item.id === id);
    if (index >= 0) categories.splice(index, 1);
  }
  if (type === "testimonials") {
    const index = testimonials.findIndex((item) => item.id === id);
    if (index >= 0) testimonials.splice(index, 1);
  }
  renderAllTables();
}

function submitProduct(event) {
  event.preventDefault();
  const name = document.getElementById("product-name").value.trim();
  const category = document.getElementById("product-category").value.trim();
  const startingPrice = Number(document.getElementById("product-price").value);
  const deliveryTime = document.getElementById("product-delivery").value.trim();
  const image = document.getElementById("product-image").value.trim() || "assets/images/shirt.svg";
  const featured = document.getElementById("product-featured").checked;
  if (!name || !category || !deliveryTime) {
    displayFormMessage("product", "Please complete the required fields.");
    return;
  }
  if (adminState.currentEdit?.type === "products") {
    const product = findItem("products", adminState.currentEdit.id);
    Object.assign(product, { name, category, startingPrice, deliveryTime, image, featured });
    displayFormMessage("product", "Product updated successfully.");
  } else {
    products.push({ id: Date.now(), name, category, startingPrice, deliveryTime, image, featured });
    displayFormMessage("product", "Product added successfully.");
  }
  event.target.reset();
  resetEditState();
  renderAllTables();
}

function submitStyle(event) {
  event.preventDefault();
  const name = document.getElementById("style-name").value.trim();
  const category = document.getElementById("style-category").value.trim();
  const occasion = document.getElementById("style-occasion").value.trim();
  const image = document.getElementById("style-image").value.trim() || "assets/images/blazer.svg";
  if (!name || !category || !occasion) {
    displayFormMessage("style", "Please complete the required fields.");
    return;
  }
  if (adminState.currentEdit?.type === "styles") {
    const style = findItem("styles", adminState.currentEdit.id);
    Object.assign(style, { name, category, occasion, image });
    displayFormMessage("style", "Style updated successfully.");
  } else {
    styles.push({ id: Date.now(), name, category, occasion, image });
    displayFormMessage("style", "Style added successfully.");
  }
  event.target.reset();
  resetEditState();
  renderAllTables();
}

function submitCategory(event) {
  event.preventDefault();
  const name = document.getElementById("category-name").value.trim();
  const description = document.getElementById("category-description").value.trim();
  if (!name || !description) {
    displayFormMessage("category", "Please complete the required fields.");
    return;
  }
  if (adminState.currentEdit?.type === "categories") {
    const category = findItem("categories", adminState.currentEdit.id);
    Object.assign(category, { name, description });
    displayFormMessage("category", "Category updated successfully.");
  } else {
    categories.push({ id: Date.now(), name, description });
    displayFormMessage("category", "Category added successfully.");
  }
  event.target.reset();
  resetEditState();
  renderAllTables();
}

function submitTestimonial(event) {
  event.preventDefault();
  const customerName = document.getElementById("testimonial-name").value.trim();
  const quote = document.getElementById("testimonial-quote").value.trim();
  const rating = Number(document.getElementById("testimonial-rating").value);
  if (!customerName || !quote || !rating) {
    displayFormMessage("testimonial", "Please complete the required fields.");
    return;
  }
  if (adminState.currentEdit?.type === "testimonials") {
    const item = findItem("testimonials", adminState.currentEdit.id);
    Object.assign(item, { customerName, quote, rating });
    displayFormMessage("testimonial", "Testimonial updated successfully.");
  } else {
    testimonials.push({ id: Date.now(), customerName, quote, rating });
    displayFormMessage("testimonial", "Testimonial added successfully.");
  }
  event.target.reset();
  resetEditState();
  renderAllTables();
}

function handleSearch(event) {
  adminState.searchTerm = event.target.value;
  renderAllTables();
}

function initAdmin() {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("admin-user").value.trim();
    const password = document.getElementById("admin-pass").value.trim();
    if (username === "admin" && password === "tailor123") {
      loginScreen.classList.add("hidden");
      adminApp.classList.remove("hidden");
      loginMessage.textContent = "";
      renderAllTables();
    } else {
      loginMessage.textContent = "Invalid credentials. Use admin / tailor123.";
    }
  });

  logoutButton.addEventListener("click", () => {
    adminApp.classList.add("hidden");
    loginScreen.classList.remove("hidden");
  });

  document.getElementById("products-table-body").addEventListener("click", handleActionClick);
  document.getElementById("styles-table-body").addEventListener("click", handleActionClick);
  document.getElementById("categories-table-body").addEventListener("click", handleActionClick);
  document.getElementById("testimonials-table-body").addEventListener("click", handleActionClick);

  document.getElementById("product-form").addEventListener("submit", submitProduct);
  document.getElementById("style-form").addEventListener("submit", submitStyle);
  document.getElementById("category-form").addEventListener("submit", submitCategory);
  document.getElementById("testimonial-form").addEventListener("submit", submitTestimonial);
  adminSearch.addEventListener("input", handleSearch);
}

document.addEventListener("DOMContentLoaded", initAdmin);

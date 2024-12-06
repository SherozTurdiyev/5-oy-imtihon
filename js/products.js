// console.log("products");
let products_list = document.querySelector("#products_list");
let pagination = document.querySelector("#pagination");
let badge = document.querySelector("#badge");
let categories_list = document.querySelector(".categories");
let store_box = document.querySelector("#store");

async function getProducts() {
  let res = await fetch(`https://fakestoreapi.com/products`, {
    method: "GET",
  });
  res = await res.json();
  render(res);
}
getProducts();

function render(kutuv) {
  products_list.innerHTML = "";
  let fragment = document.createDocumentFragment();
  kutuv?.forEach((product) => {
    let card = document.createElement("div");
    card.classList.add("col-span-1", "border", "py-3", "px-6", "rounded-xl");

    let product_img = document.createElement("img");
    product_img.src = product?.image;
    product_img.alt = product?.title;
    product_img.classList.add(
      "w-full",
      "object-cover",
      "h-[250px]",
      "rounded-xl"
    );

    let title = document.createElement("p");
    title.textContent = product?.title;
    title.classList.add("text-white");

    let add_to_store = document.createElement("button");
    add_to_store.textContent = "Add to card";
    add_to_store.classList.add(
      "rounded",
      "bg-bg_btn",
      "py-2",
      "px-3",
      "text-white",
      "my-3"
    );
    add_to_store.setAttribute("onclick", `addToStore(${product.id})`);

    card.appendChild(product_img);
    card.appendChild(title);
    card.appendChild(add_to_store);
    fragment.appendChild(card);
  });
  products_list.appendChild(fragment);
}

let store_list = [];

async function addToStore(params) {
  let res = await fetch(`https://fakestoreapi.com/products/${params}`);
  res = await res.json();
  store_list.push({ ...res, count: 1 });
  badge.textContent = store_list.length;
  renderStore(store_list);
}

async function getAllCategories() {
  try {
    let res = await fetch("https://fakestoreapi.com/products/categories", {
      method: "GET",
    });
    res = await res?.json();

    renderCategories(res);
  } catch (error) {
    alert(error?.message);
  }
}

function renderCategories(categories) {
  let fragment = document.createDocumentFragment();
  categories = ["all", ...categories];
  categories?.forEach((element) => {
    let btn_category = document.createElement("button");
    btn_category.classList.add(
      "rounded",
      "bg-bg_btn",
      "py-2",
      "px-3",
      "text-white",
      "my-3",
      "active:bg-bg_btn/70"
    );
    btn_category.textContent = element;

    btn_category.setAttribute("onclick", `filterByCategory("${element}")`);
    fragment.appendChild(btn_category);
  });
  categories_list.appendChild(fragment);
}
getAllCategories();

const filterByCategory = async (category) => {
  try {
    if (category === "all") {
      getProducts();
    } else {
      let res = await fetch(
        `https://fakestoreapi.com/products/category/${category}`
      );
      res = await res?.json();
      render(res);
    }
  } catch (error) {
    alert(error?.message);
  }
};

const showStore = () => {
  store?.classList.toggle("translate-x-[1000px]");
};

function renderStore(store_list) {
  store_box.innerHTML = "";
  let fragment = document.createDocumentFragment();
  store_list?.forEach((product) => {
    let card = document.createElement("div");
    card.classList.add("text-white", "flex", "justify-between", "items-center");

    let left_card = document.createElement("div");
    left_card.classList.add("flex", "items-center", "gap-4");

    let left_card_img = document.createElement("img");
    left_card_img.src = product?.image;
    left_card_img.alt = product?.title;
    left_card_img.classList.add("w-20", "h-20", "rounded-lg");

    let text_box = document.createElement("div");
    let title = document.createElement("p");
    title.textContent = product.title;

    let price = document.createElement("p");
    price.textContent = "$ " + product.price;
    text_box.appendChild(title);
    text_box.appendChild(price);
    left_card.appendChild(left_card_img);
    left_card.appendChild(text_box);

    let right_card = document.createElement("div");
    right_card.classList.add("flex", "items-center", "gap-2");
    let remove_btn = document.createElement("button");
    remove_btn.textContent = "Remove";
    remove_btn.classList.add("bg-bg_btn", "py-2", "px-4", "rounded-lg");

    let minus = document.createElement("button");
    minus.classList.add("bg-bg_btn", "py-2", "px-4", "rounded-lg");
    minus.textContent = "-";
    minus.setAttribute("onclick", `decrement(${product.id})`);

    let count = document.createElement("span");
    count.textContent = product.count;

    let plus = document.createElement("button");
    plus.textContent = "+";
    plus.classList.add("bg-bg_btn", "py-2", "px-4", "rounded-lg");
    plus.setAttribute("onclick", `increment(${product.id})`);

    right_card.appendChild(remove_btn);
    right_card.appendChild(minus);
    right_card.appendChild(count);
    right_card.appendChild(plus);

    card.appendChild(left_card);
    card.appendChild(right_card);

    fragment.appendChild(card);
  });
  store_box.appendChild(fragment);
}

function increment(id) {
  let find_product = store_list.find((product) => {
    return product.id == id;
  });
  if (find_product.rating.count > find_product.count) {
    find_product.count++;
    renderStore(store_list);
  }
}

function decrement(id) {
  let find_product = store_list.find((product) => {
    return product.id == id;
  });
  if (find_product.count > 1) {
    find_product.count--;
    renderStore(store_list);
  }
}

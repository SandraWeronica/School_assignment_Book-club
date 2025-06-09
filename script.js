/* please use this with . notation rather than making new DOM requests for performance */
// intellisense won't be displayed on the children but you can use the parent element if you want to still access to it and then swap in the children
const body = document.body;

const goUpButton = body.querySelector("#goUp");
const switchTheme = body.querySelector("#switchTheme");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".closeBtn");
const reviewButtom = document.getElementById("reviewButtom");
const reviewButton = document.getElementById("reviewButton");
const reviewForm = document.querySelector(".hideReviewForm");
const submitReview = document.getElementById("submitReview");
const deleteBookButton = document.getElementById("deleteBook");
const userAddedBook = document.querySelector("#userAddedBook");

const form = document.querySelector("#bookForm");
const books = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const book = addBook();
  window.alert("book added");
  form.reset();
  updateBookList(book);
  userAddedBook.scrollIntoView({ behavior: 'smooth' });
  
  
});

// listens to the userAddedBooks div area and finds elements with the chosen class
userAddedBook.addEventListener("click", (event) => {
  if (event.target.matches(".modalBtn")) {
    showModalContent(event.target.id);
  }
});

closeBtn.addEventListener("click", () => {
  modal.close();
});

switchTheme.addEventListener("click", () => {
  body.classList.toggle("darkmode");
  switchTheme.classList.toggle("close");
  if (body.classList.contains("darkmode")) {
    localStorage.setItem("state", "darkmode");
  } else {
    localStorage.setItem("state", "");
  }
});

//  secret dark mode
// discuss with group a potential fun way to implement it so that it's not as much of a secret?
window.addEventListener("keydown", (e) => {
  if (e.key === "c" && e.ctrlKey && e.altKey) {
    body.classList.toggle("darkmode");
    switchTheme.classList.toggle("close");
    if (body.classList.contains("darkmode")) {
      localStorage.setItem("state", "darkmode");
    } else {
      localStorage.setItem("state", "");
    }
  }
});

//  retrieving state from localstorage
if (localStorage.getItem("state") === "darkmode") {
  body.classList.add("darkmode");
  switchTheme.classList.add("close");
}

goUpButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

const addBook = () => {
  const yourBook = document.querySelector("#yourBook").value;
  const author = document.querySelector("#author").value;
  const picture = document.querySelector("#picture").value;
  const description = document.querySelector("#bookDescription").value;
  const book = {
    title: yourBook,
    author: author,
    picture: picture,
    description: description,
    review: [],
  };
  books.push(book);
  return book;
};
const faultyPic = "Images/bild-saknas.png";
const updateBookList = (book) => {
  const userAddedBook = document.querySelector("#userAddedBook");
  const article = document.createElement("article");
  const h3 = document.createElement("h3");
  const h4 = document.createElement("h4");
  const p = document.createElement("p");
  const image = document.createElement("img");
  const button = document.createElement("button");

  article.setAttribute("data-title", book.title);
  h3.innerText = book.title;
  h4.innerText = book.author;
  p.innerText = book.review;
  image.addEventListener("error", (e) => {
    console.log(e);
    book.picture = faultyPic;
    image.src = book.picture;
  });
  if (image.src !== faultyPic) {
    image.src = book.picture;
  }
  // bild inom modalen ska ha http länk osv (fråga Rebecka??)
  console.log("image src" + image.src);

  button.innerText = "Öppna modal";
  button.className = "modalBtn";
  button.id = book.title;

  userAddedBook.appendChild(article);
  article.id = h3;
  article.appendChild(image);

  article.appendChild(h3);
  article.appendChild(h4);
  article.appendChild(p);
  article.appendChild(button);

  /* article.appendChild(h3);
  article.appendChild(h4);
  article.appendChild(p);
  article.appendChild(button); */
};

const showModalContent = (id) => {
  modal.showModal();
  const book = books.find((book) => book.title === id);

  const modalTitle = document.querySelector("#modalTitle");
  const modalAuthor = document.querySelector("#modalAuthor");
  const modalDescription = document.querySelector("#modalDescription");
  const modalImage = document.querySelector("#modalImage");

  modalTitle.textContent = book.title;
  modalAuthor.textContent = book.author;
  modalDescription.textContent = book.description;
  modalImage.src = book.picture;

  reviewButton.addEventListener("click", () => {
    reviewForm.classList.toggle("hideReviewForm");
  });

  submitReview.addEventListener("click", () => {
    reviewForm.addEventListener("submit", (e) => {
      addReview(e, book);
    });
  });

  deleteBookButton.addEventListener("click", () => {
    removeBook(book);
  });
};

const addReview = (e, book) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const review = data.get("review");

  if (!book.review.includes(review)) {
    book.review.push(review);
    const reviewList = document.getElementById("modalReviews");
    const newListItem = document.createElement("li");
    newListItem.textContent = review;
    reviewList.appendChild(newListItem);
    reviewForm.reset();
  } else {
    console.log("Review already exists.");
  }
  reviewForm.classList.toggle("hideReviewForm");
};

const removeBook = (book) => {
  console.log("book", book);
  const bookIndex = books.findIndex((b) => b.title === book.title);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    console.log(`Book with id ${book.title} removed.`);

    const bookElement = document.querySelector(`[data-title="${book.title}"]`);
    if (bookElement) {
      bookElement.remove();
    }
  } else {
    console.log(`Book with id ${book.title} not found.`);
  }
  modal.close();
  console.log(books);
};

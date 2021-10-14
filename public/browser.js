function makeListItem(item) {
  return `
    <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
      <span class="item-text">${item.text}</span>
      <div>
        <button class="edit-me btn btn-secondary btn-sm mr-1" data-id="${item._id}">Edit</button>
        <button class="delete-me btn btn-danger btn-sm" data-id="${item._id}">Delete</button>
      </div>
    </li>
  `;
}

function createTodoList() {
  return items.map(makeListItem).join("");
}

document
  .getElementById("item-list")
  .insertAdjacentHTML("beforeend", createTodoList());

document
  .getElementById("create-form")
  .addEventListener("submit", handleFormSubmit);

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-me")) {
    handleEditTodo(e.target);
  }

  if (e.target.classList.contains("delete-me")) {
    handleDeleteTodo(e.target);
  }
});

function handleEditTodo(eventTarget) {
  const itemTextElem = eventTarget
    .closest(".list-group-item")
    .querySelector(".item-text");

  const newText = prompt(
    "Enter your desired new text",
    itemTextElem.textContent
  );

  if (newText) {
    const todoId = eventTarget.dataset.id;
    axios
      .post("/update-item", { text: newText, id: todoId })
      .then((response) => {
        itemTextElem.textContent = newText;
      })
      .catch((err) => {
        console.log("Something went wrong. Try again later");
      });
  }
}

function handleDeleteTodo(eventTarget) {
  const deleteConfirmed = confirm("Are you sure you want to delete?");

  if (deleteConfirmed) {
    const todoId = eventTarget.dataset.id;
    axios
      .post("/delete-item", { id: todoId })
      .then(() => {
        eventTarget.closest(".list-group-item").remove();
      })
      .catch((err) => {
        console.log("Something went wrong. Try again later");
      });
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  const todoInput = document.getElementById("create-field");
  const todoInputText = todoInput.value.trim();

  if (todoInputText) {
    axios
      .post("/create-item", { text: todoInputText })
      .then((response) => {
        const { data } = response;

        document
          .getElementById("item-list")
          .insertAdjacentHTML("beforeend", makeListItem(data));

        todoInput.value = "";
        todoInput.focus();
      })
      .catch((err) => {
        console.log("Something went wrong. Try again later");
      });
  }
}

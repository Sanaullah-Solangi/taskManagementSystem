let modalContent = document.querySelector(".modalContent");
let modalHeading = document.querySelector(".modalHeading"); // MODAL HEADING
let modalStatus = document.querySelector("#modalStatus"); // STATUS INPUT IN MODAL
var flagForUl = "";
//! FUNCTION TO CHANGE COLOR BASED ON PRIORITY LEVEL
function showPriorityLevel() {
  var priorityLevel = document.querySelectorAll(".taskPriority > select");
  for (let selectedLeverl of priorityLevel) {
    if (selectedLeverl.value == "medium") {
      selectedLeverl.classList.add("blue");
      selectedLeverl.classList.remove("low", "red");
    } else if (selectedLeverl.value == "low") {
      selectedLeverl.classList.add("green");
      selectedLeverl.classList.remove("red", "blue");
    } else if (selectedLeverl.value == "heigh") {
      selectedLeverl.classList.add("red");
      selectedLeverl.classList.remove("blue", "green");
    }
    selectedLeverl.blur();
  }
}
showPriorityLevel();

// OPEN MODAL ON ADDTODO BUTTON CLICK TO COLLECT TODO DETAILS AND CREATE TODO CARD

//! FUNCTION TO ENABLE DRAG AND DROP FUNCTIONALITY FOR TODO ITEMS
function dragStart(event) {
  event.dataTransfer.setData("text", event.target.id);
  event.target.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
  event.target.style.opacity = "0";
  event.target.style.border = "2px solid var(--mainColor1)";
}

function dragEnd(event) {
  event.dataTransfer.setData("text", event.target.id);
  event.target.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
  event.target.style.opacity = "1";
  event.target.style.border = "2px solid transparent";
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  var dataId = event.dataTransfer.getData("text");
  var dragAbbleItem = document.getElementById(dataId);
  var dropTarget;
  if (event.target !== "ul") {
    dropTarget = event.target.closest("ul");
    if ((dropTarget.innerHTML = "add new task")) {
      dropTarget.innerHTML = "";
    }
  }
  dropTarget.appendChild(dragAbbleItem);
  updateStatus();
}

//! FUNCTION TO UPDATE THE STATUS OF A TASK BASED ON ITS UL LOCATION
function updateStatus() {
  //UPDATING STATUS
  let statusCards = document.querySelectorAll(".taskStatus");
  for (let i = 0; i < statusCards.length; i++) {
    if (statusCards[i].closest(".inProgress")) {
      let status = statusCards[i].querySelector(".status");
      status.innerHTML = "in progress";
    } else if (statusCards[i].closest(".completed")) {
      let status = statusCards[i].querySelector(".status");
      status.innerHTML = "completed";
    } else if (statusCards[i].closest(".toDos")) {
      let status = statusCards[i].querySelector(".status");
      status.innerHTML = "todo";
    }
  }
}
//! FUNCTION TO ADJUST THE HEIGHT AND WIDTH OF EMPTY UL ELEMENTS
function resizeUl() {
  // RESIZING UL
  let todosParents = document.querySelectorAll(".taskCardList");
  for (let ul of todosParents) {
    if (ul.children.length == 0) {
      ul.classList.add("heightWidth");
      ul.innerHTML = "add new task";
    } else {
      ul.classList.remove("heightWidth");
    }
  }
}
resizeUl();

//! FUNCTION TO SHOW THE MODAL AND HIDE THE UL ELEMENTS
function showModalAndHideUls(event) {
  let container = event.target.closest(".todoProjectsContainer"); // MODAL CONTAINER
  let ul = container.querySelector("ul"); // PARENT UL OF CLICKED BTN

  if (ul.classList.contains("toDos")) {
    modalHeading.innerHTML = "Add A New Task";
    modalStatus.selectedIndex = 0;
  } else if (ul.classList.contains("inProgress")) {
    modalHeading.innerHTML = "Add In progress task";
    modalStatus.selectedIndex = 1;
  } else if (ul.classList.contains("completed")) {
    modalHeading.innerHTML = "Add A completed task";
    modalStatus.selectedIndex = 2;
  }

  let modalContainer = document.querySelector(".modalContainer");
  let taskCardList = document.querySelectorAll(".taskCardList");
  for (let ul of taskCardList) {
    ul.classList.replace("d-flex", "d-none");
  }
  modalContainer.classList.replace("d-none", "d-flex");
  modalContent.classList.replace("animate__bounceOut", "animate__bounceIn");
  flagForUl = ul;
}

//! FUNCTION TO HIDE THE MODAL AND SHOW THE UL ELEMENTS
function hideModalAndShowUls() {
  let modalContainer = document.querySelector(".modalContainer");
  let taskCardList = document.querySelectorAll(".taskCardList");
  modalContent.classList.replace("animate__bounceIn", "animate__bounceOut");

  setTimeout(() => {
    for (let ul of taskCardList) {
      ul.classList.replace("d-none", "d-flex");
    }
    modalContainer.classList.replace("d-flex", "d-none");
  }, 700);
}

//! FUNCTION TO GET INPUT VALUES FROM MODAL AND CREATE A TASK/TODO CARD
function createTodoCardFromModal() {
  let modalTitle = document.querySelector("#modalTitle").value;
  let modalDeadLine = document.querySelector("#modalDeadLine").value;
  let modalStatus = document.querySelector("#modalStatus").value;
  let modalPriority = document.querySelector("#modalPriority").value;
  let modalDescription = document.querySelector("#modalDescription").value;
  let taskId = Math.round(Math.random() * 100000);
  let inputs = document.querySelectorAll(".modalContent input,textarea");
  let inputsAreFilled = true;
  let data = ` <li
  id="${taskId}"
  class="task w-100 transition-1ms"
  draggable="true"
  ondragstart="dragStart(event)"
  ondragend="dragEnd(event)"
>
  <p class="taskTitle">${modalTitle || "Not Mentioned"} </p>
  <p class="taskDescription">
    ${modalDescription || "Not Mentioned"} 
  </p>
  <p class="taskDeadLine d-flex jc-between">
    <strong>dead line :</strong> ${modalDeadLine || "Not Mentioned"} 
  </p>
  <p class="taskStatus d-flex jc-between">
    <strong>status :</strong><span class="status">${
      modalStatus || "Not Mentioned"
    } </span>
  </p>

  <p class="taskPriority d-flex jc-between al-center">
    <strong>priority :</strong>
    <select
      onchange="showPriorityLevel()"
      class="pointer"
      name="priority"
      id="priority"
    >
      <option value="heigh">heigh</option>
      <option value="medium">medium</option>
      <option value="low">low</option>
    </select>
  </p>
</li>`;
  for (input of inputs) {
    if (input.value == "") {
      inputsAreFilled = false;
    }
  }
  if (inputsAreFilled) {
    if ((flagForUl.innerHTML = "")) {
      flagForUl.innerHTML = data;
    } else {
      flagForUl.innerHTML += data;
    }
    showPriorityLevel();
    hideModalAndShowUls();
    inputs.forEach((item) => {
      item.value = "";
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Incomplete Form",
      text: "Please fill in all the fields before submitting.",
    });

    inputsAreFilled = true;
  }
}

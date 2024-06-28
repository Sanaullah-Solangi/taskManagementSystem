//! FUNCTION TO CHANGE COLOR BASED ON PRIORITY LEVEL
function showPriorityLevel() {
  var priorityLevel = document.querySelectorAll(".cardPriority > select");
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
  event.target.style.border = "2px solid var(--mainColor1)";
}

function dragEnd(event) {
  event.dataTransfer.setData("text", event.target.id);
  event.target.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
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
  }
  dropTarget.appendChild(dragAbbleItem);
  setHeightWidthOfUl();
}

function setHeightWidthOfUl() {
  let statusCards = document.querySelectorAll(".cardStatus");
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
  let todosParents = document.querySelectorAll(".todoCardList");
  for (let ul of todosParents) {
    if (ul.children.length == 0) {
      ul.classList.add("heightWidth");
    } else {
      ul.classList.remove("heightWidth");
    }
  }
}

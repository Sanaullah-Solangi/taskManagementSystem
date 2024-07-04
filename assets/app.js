//* GETTING ELEMENTS
var navLogInBtn = document.querySelector(".navLogInBtn");
var navLogOutBtn = document.querySelector(".navLogOutBtn");
var navDelAllBtn = document.querySelector(".navDelAllBtn");
var formLogInBtn = document.querySelector(".formLogInBtn");
var navSignUpBtn = document.querySelector(".navSignUpBtn");
var navLogo = document.querySelector(".logo");
var formSignUpBtn = document.querySelector(".formSignUpBtn");
var todId;
let toDosList = document.querySelector(".toDos");
let inProgressList = document.querySelector(".inProgress");
let completedList = document.querySelector(".completed");
let modalContent = document.querySelector(".modalContent");
let modalHeading = document.querySelector(".modalHeading"); // MODAL HEADING
let modalStatus = document.querySelector("#modalStatus"); // STATUS INPUT IN MODAL
let taskToDrop;
var flagForUl = "";
var formDataCompleted = true; // FLAG TO CHECK EMPTY INPUT

//! ==============================================
//! SIGN-IN AND LOG-IN FUNCTIONALITIES
//! ==============================================

//*PROGRAME TO CHECK PASSWORD STRENGTH LEVEL IN SIGNUP FORM
var capitalLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var smallLetters = "abcdefghijklmnopqrstuvwxyz";
var numbers = "0123456789";
var symbols = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
var storPassword = "";
function checkPasswordStatus() {
  var newPassword = document.querySelector("#newPassword");
  storPassword = newPassword.value;
  var smallLettersFlag = false;
  var capitalLettersFlag = false;
  var numbersFlag = false;
  var symbolsFlag = false;
  for (var i = 0; i < storPassword.length; i++) {
    char = storPassword[i];
    if (capitalLetters.includes(char)) capitalLettersFlag = true;
    if (smallLetters.includes(char)) smallLettersFlag = true;
    if (numbers.includes(char)) numbersFlag = true;
    if (symbols.includes(char)) symbolsFlag = true;
  }
  showPasswordStatus(
    capitalLettersFlag,
    smallLettersFlag,
    numbersFlag,
    symbolsFlag
  );
}
//* FUNCTION TO SHOW STRENTH OF PASSWORD IN SINGUP FORM
function showPasswordStatus(capsFlag, smallsFlag, numsFlag, symsFlag) {
  var newPassword = document.querySelector("#newPassword");
  var strength = capsFlag + smallsFlag + numsFlag + symsFlag;
  //? conditional statements
  if (strength === 4) {
    newPassword.style.border = "2px solid green";
  } else if (strength === 3) {
    newPassword.style.border = "2px solid yellow";
  } else if (strength === 2) {
    newPassword.style.border = "2px solid orange";
  } else if (strength === 1) {
    newPassword.style.border = "2px solid red";
  } else {
    newPassword.style.border = "none";
  }
}

//* FUNCTION TO ENSURE PASSWORD WILL CONTAIN MINIMUM 8 CHARACTERS IN SIGN UP FORM
function validateLengthOfPassword() {
  var newPassword = document.querySelector("#newPassword");
  if (newPassword.value.length < 8) {
    Swal.fire({
      customClass: {
        container: "sweatContainer",
        popup: "sweatPopup",
        title: "sweatTitle",
        htmlContainer: "sweatPara",
        confirmButton: "sweatBtn",
        cancelButton: "sweatBtn",
      },
      icon: "warning",
      title: "sorry...",
      text: "please enter minimam 8 characters!",
    });
  }
}

//* FUNCTION TO SIGN UP
function signUpAndStoreUserData() {
  //*  SIGNUP ELEMENTS
  var signUpContainer = document.querySelector(".signUpContainer");
  var inputs = signUpContainer.querySelectorAll("input");
  var signingUserName = signUpContainer.querySelector("#signingUserName");
  var signingEmail = signUpContainer.querySelector("#signingEmail");
  var newPassword = signUpContainer.querySelector("#newPassword");
  var confirmPassword = signUpContainer.querySelector("#confirmPassword");
  var signingAddress = signUpContainer.querySelector("#signingAddress");
  //* ENSURES NO INPUT FIELD IS EMPTY BEFORE PROCEEDING.
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].value == "") {
      formDataCompleted = false;
    }
  }
  //* IF NO INPUT IS EMPTY CODE WILL BE EXECUTED
  if (formDataCompleted) {
    var usersData = getData(); // GETTING COMPLETE DATA OF USERS
    // COLLECTION OF USER DATA'S OBJECTS / ARRAY OF OBJECTS
    //* ENSURES THE SAME EMAIL CANNOT BE USED MORE THAN ONCE.
    for (var i = 0; i < usersData.length; i++) {
      if (usersData[i].email == signingEmail.value) {
        Swal.fire({
          customClass: {
            container: "sweatContainer",
            popup: "sweatPopup",
            title: "sweatTitle",
            htmlContainer: "sweatPara",
            confirmButton: "sweatBtn",
            cancelButton: "sweatBtn",
          },
          icon: "error",
          title: "Oops...",
          text: "The email already exist!",
        });
        return false;
      }
    }
    //* ENSURES THE NEW PASSWORD AND CONFIRM PASSWORD FEILDS MATCHS.
    if (newPassword.value != confirmPassword.value) {
      Swal.fire({
        customClass: {
          container: "sweatContainer",
          popup: "sweatPopup",
          title: "sweatTitle",
          htmlContainer: "sweatPara",
          confirmButton: "sweatBtn",
          cancelButton: "sweatBtn",
        },
        icon: "error",
        title: "Oops...",
        text: "password is not correct!",
      });
      return false;
    }

    //* COLLECTING USER SIGN-UP DATA AND EMAILS, STORING THEM IN ARRAYS, AND SAVING TO LOCAL STORAGE
    // COMPLETE DATA
    var signUpData = {
      userName: signingUserName.value,
      email: signingEmail.value,
      userNewPassword: newPassword.value,
      userConfirmPassword: confirmPassword.value,
      userSigningAddress: signingAddress.value,
      todos: [],
      inProgress: [],
      completed: [],
    };
    // JUST EMAIL
    var currentUserEmail = signingEmail.value;
    usersData.push(signUpData);
    setDataCollection(usersData);
    setLoggedUserEmail(currentUserEmail);

    //* EMPTY ALL INPUTS
    inputs.forEach((val) => {
      val.value = "";
    });
    //* SHOWING ALERT FOR SUCCESSFULLY SIGNING UP
    Swal.fire({
      customClass: {
        container: "sweatContainer",
        popup: "sweatPopup",
        title: "sweatTitle",
        htmlContainer: "sweatPara",
        confirmButton: "sweatBtn",
        cancelButton: "sweatBtn",
      },
      title: "Thank You!",
      text: "You have Signed Up!",
      icon: "success",
    });
    setTimeout(() => {
      location.href = "../logIn.html";
    }, 1000);
    showLogOutBtn();
  }

  //* IF ANY INUT IS EMPTY WARNING WILL BE GIVEN TO THE USER
  else {
    Swal.fire({
      customClass: {
        container: "sweatContainer",
        popup: "sweatPopup",
        title: "sweatTitle",
        htmlContainer: "sweatPara",
        confirmButton: "sweatBtn",
        cancelButton: "sweatBtn",
      },
      icon: "warning",
      title: "sorry...",
      text: "please enter complete detail!",
    });
    formDataCompleted = true;
  }
}

//* FUNCTION TO LOG IN
function logIn() {
  //*  LOGIN ELEMENTS
  var logInContainer = document.querySelector(".logInContainer");
  var inputs = logInContainer.querySelectorAll("input");
  var logInEmail = logInContainer.querySelector("#logInEmail").value;
  var logInPassword = logInContainer.querySelector("#logInPassword").value;
  // var logInAddress = logInContainer.querySelector("#logInAddress").value;
  //* ENSURES NO INPUT FIELD IS EMPTY BEFORE PROCEEDING.
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].value == "") {
      formDataCompleted = false;
    }
  }
  //* IF NO INPUT IS EMPTY CODE WILL BE EXECUTED
  if (formDataCompleted) {
    var usersData = getData();
    var emailFlag = false;
    var passwordFlag = false;

    for (var i = 0; i < usersData.length; i++) {
      if (usersData[i].email == logInEmail) {
        emailFlag = true;
        if (usersData[i].userConfirmPassword == logInPassword) {
          passwordFlag = true;
          break;
        }
        break;
      }
    }
    if (emailFlag && passwordFlag) {
      inputs.forEach((val) => {
        val.value = "";
      });
      Swal.fire({
        customClass: {
          container: "sweatContainer",
          popup: "sweatPopup",
          title: "sweatTitle",
          htmlContainer: "sweatPara",
          confirmButton: "sweatBtn",
          cancelButton: "sweatBtn",
        },
        title: "congratulation!",
        text: "You are loged In!",
        icon: "success",
      });
      var currentUserEmail = logInEmail;
      setLoggedUserEmail(currentUserEmail);

      setTimeout(() => {
        location.href = "../board.html";
      }, 1400);
    } else if (emailFlag && !passwordFlag) {
      Swal.fire({
        customClass: {
          container: "sweatContainer",
          popup: "sweatPopup",
          title: "sweatTitle",
          htmlContainer: "sweatPara",
          confirmButton: "sweatBtn",
          cancelButton: "sweatBtn",
        },
        title: "sorry!",
        text: "The password is incorrect",
        icon: "error",
      });
    } else if (!emailFlag) {
      Swal.fire({
        customClass: {
          container: "sweatContainer",
          popup: "sweatPopup",
          title: "sweatTitle",
          htmlContainer: "sweatPara",
          confirmButton: "sweatBtn",
          cancelButton: "sweatBtn",
        },
        title: "sorry!",
        text: "The user is not found",
        icon: "error",
      });
    }
  } //* IF ANY INUT IS EMPTY WARNING WILL BE GIVEN TO THE USER
  else {
    Swal.fire({
      customClass: {
        container: "sweatContainer",
        popup: "sweatPopup",
        title: "sweatTitle",
        htmlContainer: "sweatPara",
        confirmButton: "sweatBtn",
        cancelButton: "sweatBtn",
      },
      icon: "error",
      title: "Incomplete Form",
      text: "Please fill in all the fields before submitting.",
    });
    formDataCompleted = true;
  }
}

//* FUNCTION TO LOG OUT
function logOut() {
  Swal.fire({
    customClass: {
      container: "sweatContainer",
      popup: "sweatPopup",
      title: "sweatTitle",
      htmlContainer: "sweatPara",
      confirmButton: "sweatBtn",
      cancelButton: "sweatBtn",
    },
    title: "Are you sure?",
    text: "You will be logged out!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, log out!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        customClass: {
          container: "sweatContainer",
          popup: "sweatPopup",
          title: "sweatTitle",
          htmlContainer: "sweatPara",
          confirmButton: "sweatBtn",
          cancelButton: "sweatBtn",
        },
        title: "Logged Out!",
        text: "You have been logged out successfully.",
        icon: "success",
      }).then(() => {
        localStorage.removeItem("loggedInUserEmail"); // Remove the email of the logged-in user from local storage
        showLogOutBtn();
        location.href = "../logIn.html";
      });
    }
  });
}

//! ==============================================
//! LOCAL STORAGE MANAGEMENT
//! ==============================================

//* FUNCTION TO COLLECT DATA FROM MODAL AND SAVE TO LOCAL STORAGE
function saveDataToLocalStorageFromModal() {
  let modalTitle = document.querySelector("#modalTitle").value;
  let modalDeadLine = document.querySelector("#modalDeadLine").value;
  let modalStatus = document.querySelector("#modalStatus").value;
  let modalPriority = document.querySelector("#modalPriority").value;
  let modalDescription = document.querySelector("#modalDescription").value;
  let taskId = Math.round(Math.random() * 100000);
  let inputs = document.querySelectorAll(".modalContent input,textarea");
  let inputsAreFilled = true;

  for (input of inputs) {
    if (input.value == "") {
      inputsAreFilled = false;
    }
  }
  if (inputsAreFilled) {
    var usersData = getData();
    var currentUserEmail = getLoggedUser();
    var userObj;
    var userObjIndex;

    if (!currentUserEmail) {
      Swal.fire({
        customClass: {
          container: "sweatContainer",
          popup: "sweatPopup",
          title: "sweatTitle",
          htmlContainer: "sweatPara",
          confirmButton: "sweatBtn",
          cancelButton: "sweatBtn",
        },
        icon: "error",
        title: "Access Denied",
        text: "Please log in before adding a task.",
      });
      hideModalAndShowUls();
      return false;
    }
    usersData.forEach((user, index) => {
      if (user.email == currentUserEmail) {
        userObj = user;
        userObjIndex = index;
      }
    });

    var todoData = {
      todoTaskId: taskId,
      taskTitle: modalTitle,
      taskDescription: modalDescription,
      taskDeaLine: modalDeadLine,
      taskStatus: modalStatus,
      taskPriority: modalPriority,
      taskPriorityId: `ID${taskId}`,
    };
    if (flagForUl.classList.contains("toDos")) {
      userObj.todos.push(todoData);
      usersData[userObjIndex].userObj;
      setDataCollection(usersData);
    } else if (flagForUl.classList.contains("inProgress")) {
      userObj.inProgress.push(todoData);
      usersData[userObjIndex].userObj;
      setDataCollection(usersData);
    } else if (flagForUl.classList.contains("completed")) {
      userObj.completed.push(todoData);
      usersData[userObjIndex].userObj;
      setDataCollection(usersData);
    }
    hideModalAndShowUls();
    inputs.forEach((item) => {
      item.value = "";
    });
  } else {
    Swal.fire({
      customClass: {
        container: "sweatContainer",
        popup: "sweatPopup",
        title: "sweatTitle",
        htmlContainer: "sweatPara",
        confirmButton: "sweatBtn",
        cancelButton: "sweatBtn",
      },
      icon: "error",
      title: "Incomplete Form",
      text: "Please fill in all the fields before submitting.",
    });
    inputsAreFilled = true;
  }
}

//* FUNCTION TO RETRIEVE DATA FROM LOCAL STORAGE FOR GLOBAL USE
function getData() {
  var userDataCollection =
    JSON.parse(localStorage.getItem("dataCollection")) ?? []; // COLLECTION OF USER DATA'S OBJECTS / ARRAY OF OBJECTS
  return userDataCollection;
}

function getLoggedUser() {
  var currentUserEmail = localStorage.getItem("loggedInUserEmail");
  return currentUserEmail;
}
function extractUserData() {
  var userData = JSON.parse(localStorage.getItem("dataCollection")) ?? []; // COLLECTION OF USER DATA'S OBJECTS / ARRAY OF OBJECTS
  let userTodos = [];
  for (user of userData) {
    if (user.email == getLoggedUser()) {
      for (arrayOfObject in user) {
        if (Array.isArray(user[arrayOfObject])) {
          userTodos.push(user[arrayOfObject]);
        }
      }
    }
  }
  return userTodos;
}

//* FUNCTION TO SET DATA TO LOCAL STORAGE
function setDataCollection(usersData) {
  localStorage.setItem("dataCollection", JSON.stringify(usersData));
}

function setLoggedUserEmail(currentUserEmail) {
  localStorage.setItem("loggedInUserEmail", currentUserEmail);
}

//* FUNCTION TO DELETE ALL TASKS
function deleteAllTasks() {
  Swal.fire({
    customClass: {
      container: "sweatContainer",
      popup: "sweatPopup",
      title: "sweatTitle",
      htmlContainer: "sweatPara",
      confirmButton: "sweatBtn",
      cancelButton: "sweatBtn",
    },
    title: "Are you sure?",
    text: "This will delete all your tasks!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete all!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        customClass: {
          container: "sweatContainer",
          popup: "sweatPopup",
          title: "sweatTitle",
          htmlContainer: "sweatPara",
          confirmButton: "sweatBtn",
          cancelButton: "sweatBtn",
        },
        title: "Deleted!",
        text: "All your tasks have been deleted.",
        icon: "success",
      }).then(() => {
        let usersData = getData();
        let currentUserEmail = getLoggedUser();
        for (user of usersData) {
          if (user.email == currentUserEmail) {
            for (arrayOfObject in user) {
              if (typeof user[arrayOfObject] == "object") {
                user[arrayOfObject] = [];
                setDataCollection(usersData);
              }
            }
          }
        }
        displayUserTasks();
      });
    }
  });
}

//* FUNCTION TO DELET TARGETD TASK
function deleteTask(event) {
  let cancelBtn = event.target;
  let cardId = cancelBtn.closest("li").id;
  let usersData = getData();
  let currentUserEmail = getLoggedUser();
  for (user of usersData) {
    if (user.email == currentUserEmail) {
      for (arrayOfObject in user) {
        if (typeof user[arrayOfObject] == "object") {
          user[arrayOfObject].forEach((obj, index) => {
            if (obj.todoTaskId == cardId) {
              console.log(obj.todoTaskId, index);
              user[arrayOfObject].splice(index, index + 1);
            }
          });
        }
      }
    }
  }
  setDataCollection(usersData);
  displayUserTasks();
}

//! ==============================================
//! DRAG-AND-DROP TASK MANAGEMENT
//! ==============================================

//* Function to Handle Drag Start Event
function dragStart(event) {
  let cardId = event.target.id;
  let usersData = getData();
  let currentUserEmail = getLoggedUser();
  for (user of usersData) {
    if (user.email == currentUserEmail) {
      for (arrayOfObject in user) {
        if (typeof user[arrayOfObject] == "object") {
          user[arrayOfObject].forEach((objs, index) => {
            if (objs.todoTaskId == cardId) {
              taskToDrop = user[arrayOfObject].splice(index, index + 1);
            }
          });
        }
      }
      break;
    }
  }
  setDataCollection(usersData);
  event.target.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
  event.target.style.opacity = "0";
  event.target.style.border = "2px solid var(--mainColor1)";
}

//* Function to Handle Drag End Event
function dragEnd(event) {
  event.dataTransfer.setData("text", event.target.id);
  event.target.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
  event.target.style.opacity = "1";
  event.target.style.border = "2px solid transparent";
}

//* Function to Handle Drag Over Event
function dragOver(event) {
  event.preventDefault();
}

//* Function to Handle Drop Event
function drop(event) {
  event.preventDefault();
  let target = event.target;
  let targetedUl;
  if (!target.classList.contains("taskCardList")) {
    targetedUl = target.closest("ul");
  } else {
    targetedUl = target;
  }
  let usersData = getData();
  let currentUserEmail = getLoggedUser();
  for (user of usersData) {
    if (user.email == currentUserEmail) {
      if (targetedUl.classList.contains("toDos")) {
        user.todos.push(taskToDrop[0]);
      } else if (targetedUl.classList.contains("inProgress")) {
        user.inProgress.push(taskToDrop[0]);
      } else if (targetedUl.classList.contains("completed")) {
        user.completed.push(taskToDrop[0]);
      }
      setDataCollection(usersData);
      break;
    }
  }

  displayUserTasks();
}

//! ==============================================
//! TASK DISPLAY AND MANAGEMENT
//! ==============================================

//* FUNCTION TO UPDATE THE STATUS OF A TASK BASED ON ITS UL LOCATION
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

//* FUNCTION TO UPDATE TASK PRIORITY
function updateTaskPriority(event) {
  let selectedPriorityId = event.target.id;
  let selectedPriority = event.target.value;
  let usersData = getData();
  let currentUserEmail = getLoggedUser();
  for (user of usersData) {
    if (user.email == currentUserEmail) {
      for (arrayOfObject in user) {
        if (typeof user[arrayOfObject] == "object") {
          user[arrayOfObject].forEach((obj, index) => {
            if (obj.taskPriorityId == selectedPriorityId) {
              obj.taskPriority = selectedPriority;
            }
          });
        }
      }
    }
  }
  setDataCollection(usersData);
  console.log(event.target.value);
  console.log(selectedPriorityId);
  showPriorityLevel();
}
//* FUNCTION TO CHANGE COLOR BASED ON PRIORITY LEVEL
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

//* FUNCTION TO ADJUST THE HEIGHT AND WIDTH OF EMPTY UL ELEMENTS
function resizeUl() {
  // RESIZING UL
  let usersData = getData();
  let currentUserEmail = getLoggedUser();
  for (user of usersData) {
    if (user.email == currentUserEmail) {
      for (arrayOfObject in user) {
        if (typeof user[arrayOfObject] == "object") {
          //todo====== todos ======
          if (arrayOfObject == "todos" && user.todos.length == 0) {
            toDosList.classList.add("heightWidth");
            toDosList.innerHTML = "<p class='d-flex'>add new task</p>";
          } else if (arrayOfObject == "todos" && user.todos.length !== 0) {
            toDosList.classList.remove("heightWidth");
            toDosList.innerHTML = "<p class='d-none'>add new task</p>";
          }

          //todo====== in progress ======
          if (arrayOfObject == "inProgress" && user.inProgress.length == 0) {
            inProgressList.classList.add("heightWidth");
            inProgressList.innerHTML = "<p class='d-flex'>add new task</p>";
          } else if (
            arrayOfObject == "inProgress" &&
            user.inProgress.length !== 0
          ) {
            inProgressList.classList.remove("heightWidth");
            inProgressList.innerHTML = "<p class='d-none'>add new task</p>";
          }

          //todo====== completed ======
          if (arrayOfObject == "completed" && user.completed.length == 0) {
            completedList.classList.add("heightWidth");
            completedList.innerHTML = "<p class='d-flex'>add new task</p>";
          } else {
            completedList.classList.remove("heightWidth");
            completedList.innerHTML = "<p class='d-none'>add new task</p>";
          }
        }
      }
    }
  }
}
resizeUl();
//!
//* FUNCTION TO RETRIEVE DATA FROM LOCAL STORAGE, CHECK THE LOGGED-IN USER'S ID, AND DISPLAY THEIR DATA
function displayUserTasks() {
  let UsersData = getData();
  let CurrentUserEmail = getLoggedUser();
  resizeUl();

  for (user of UsersData) {
    for (arrayOfObject in user) {
      if (user.email == CurrentUserEmail) {
        navLogo.innerHTML = `<i class="fa-solid fa-user"></i>&nbsp;&nbsp;Hi, ${user.userName}`;
        if (typeof user[arrayOfObject] == "object") {
          if (arrayOfObject == "todos") {
            for (objsOfArray in user[arrayOfObject]) {
              toDosList.innerHTML += ` <li
                id="${user[arrayOfObject][objsOfArray].todoTaskId}"
                class="task w-100 transition-1ms p-relative"
                draggable="true"
                ondragstart="dragStart(event)"
                ondragend="dragEnd(event)"
                >
                <!--?=== CANCEL BTN ===-->
                    <div onclick="deleteTask(event)" class="cancelBtn p-absolute d-flex jc-center al-center pointer transition-1ms">
                      <i class="fa-solid fa-xmark" ></i>
                    </div>
                    <p class="taskTitle">${
                      user[arrayOfObject][objsOfArray].taskTitle ||
                      "not mentioned"
                    } </p>
                    <p class="taskDescription">
                    ${
                      user[arrayOfObject][objsOfArray].taskDescription ||
                      "not mentioned"
                    }
                    </p>
                      <p class="taskDeadLine d-flex jc-between">
                      <strong>dead line :</strong> ${
                        user[arrayOfObject][objsOfArray].taskDeaLine ||
                        "not mentioned"
                      }
                  </p>
                  <p class="taskStatus d-flex jc-between">
                    <strong>status :</strong><span class="status">${
                      user[arrayOfObject][objsOfArray].taskStatus ||
                      "not mentioned"
                    } </span>
                  </p>

                <p class="taskPriority d-flex jc-between al-center">
                <strong>priority :</strong>
                <select
                onchange="updateTaskPriority(event)"
                class="pointer"
                name="priority"
                id="${user[arrayOfObject][objsOfArray].taskPriorityId}"
              >
                <option value="heigh" ${
                  user[arrayOfObject][objsOfArray].taskPriority == "heigh"
                    ? "selected"
                    : ""
                }>heigh</option>
                <option value="medium"${
                  user[arrayOfObject][objsOfArray].taskPriority == "medium"
                    ? "selected"
                    : ""
                }>medium</option>
                <option value="low"${
                  user[arrayOfObject][objsOfArray].taskPriority == "low"
                    ? "selected"
                    : ""
                }>low</option>
                </select>
              </p>
            </li>`;
            }
          }
          if (arrayOfObject == "inProgress") {
            for (objsOfArray in user[arrayOfObject]) {
              inProgressList.innerHTML += ` <li
                id="${user[arrayOfObject][objsOfArray].todoTaskId}"
                class="task w-100 transition-1ms p-relative"
                draggable="true"
                ondragstart="dragStart(event)"
                ondragend="dragEnd(event)"
                >
                <!--?=== CANCEL BTN ===-->
                    <div onclick="deleteTask(event)" class="cancelBtn p-absolute d-flex jc-center al-center pointer transition-1ms">
                      <i class="fa-solid fa-xmark" ></i>
                    </div>
                    <p class="taskTitle">${
                      user[arrayOfObject][objsOfArray].taskTitle ||
                      "not mentioned"
                    } </p>
                    <p class="taskDescription">
                    ${
                      user[arrayOfObject][objsOfArray].taskDescription ||
                      "not mentioned"
                    }
                    </p>
                      <p class="taskDeadLine d-flex jc-between">
                      <strong>dead line :</strong> ${
                        user[arrayOfObject][objsOfArray].taskDeaLine ||
                        "not mentioned"
                      }
                  </p>
                  <p class="taskStatus d-flex jc-between">
                    <strong>status :</strong><span class="status">${
                      user[arrayOfObject][objsOfArray].taskStatus ||
                      "not mentioned"
                    } </span>
                  </p>

                <p class="taskPriority d-flex jc-between al-center">
                <strong>priority :</strong>
                <select
                onchange="updateTaskPriority(event)"
                class="pointer"
                name="priority"
                id="${user[arrayOfObject][objsOfArray].taskPriorityId}"
              >
                <option value="heigh" ${
                  user[arrayOfObject][objsOfArray].taskPriority == "heigh"
                    ? "selected"
                    : ""
                }>heigh</option>
                <option value="medium"${
                  user[arrayOfObject][objsOfArray].taskPriority == "medium"
                    ? "selected"
                    : ""
                }>medium</option>
                <option value="low"${
                  user[arrayOfObject][objsOfArray].taskPriority == "low"
                    ? "selected"
                    : ""
                }>low</option>
                </select>
              </p>
            </li>`;
            }
          }
          if (arrayOfObject == "completed") {
            for (objsOfArray in user[arrayOfObject]) {
              completedList.innerHTML += ` <li
                id="${user[arrayOfObject][objsOfArray].todoTaskId}"
                class="task w-100 transition-1ms p-relative"
                draggable="true"
                ondragstart="dragStart(event)"
                ondragend="dragEnd(event)"
                >
                <!--?=== CANCEL BTN ===-->
                    <div onclick="deleteTask(event)" class="cancelBtn p-absolute d-flex jc-center al-center pointer transition-1ms">
                      <i class="fa-solid fa-xmark" ></i>
                    </div>
                    <p class="taskTitle">${
                      user[arrayOfObject][objsOfArray].taskTitle ||
                      "not mentioned"
                    } </p>
                    <p class="taskDescription">
                    ${
                      user[arrayOfObject][objsOfArray].taskDescription ||
                      "not mentioned"
                    }
                    </p>
                      <p class="taskDeadLine d-flex jc-between">
                      <strong>dead line :</strong> ${
                        user[arrayOfObject][objsOfArray].taskDeaLine ||
                        "not mentioned"
                      }
                  </p>
                  <p class="taskStatus d-flex jc-between">
                    <strong>status :</strong><span class="status">${
                      user[arrayOfObject][objsOfArray].taskStatus ||
                      "not mentioned"
                    } </span>
                  </p>

                <p class="taskPriority d-flex jc-between al-center">
                <strong>priority :</strong>
                <select
                onchange="updateTaskPriority(event)"
                class="pointer"
                name="priority"
                id="${user[arrayOfObject][objsOfArray].taskPriorityId}"
              >
                <option value="heigh" ${
                  user[arrayOfObject][objsOfArray].taskPriority == "heigh"
                    ? "selected"
                    : ""
                }>heigh</option>
                <option value="medium"${
                  user[arrayOfObject][objsOfArray].taskPriority == "medium"
                    ? "selected"
                    : ""
                }>medium</option>
                <option value="low"${
                  user[arrayOfObject][objsOfArray].taskPriority == "low"
                    ? "selected"
                    : ""
                }>low</option>
                </select>
              </p>
            </li>`;
            }
          }
        }
      }
    }
  }
  updateStatus();
  showPriorityLevel();
}

displayUserTasks();

//! ==============================================
//! MODAL FUNCTIONALITY
//! ==============================================

//* FUNCTION TO SHOW THE MODAL AND HIDE THE UL ELEMENTS
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
  for (let uls of taskCardList) {
    uls.classList.replace("d-flex", "d-none");
  }
  modalContainer.classList.replace("d-none", "d-flex");
  modalContent.classList.replace("animate__bounceOut", "animate__bounceIn");
  flagForUl = ul;
}

//* FUNCTION TO HIDE THE MODAL AND SHOW THE UL ELEMENTS
function hideModalAndShowUls() {
  let modalContainer = document.querySelector(".modalContainer");
  let taskCardList = document.querySelectorAll(".taskCardList");
  modalContent.classList.replace("animate__bounceIn", "animate__bounceOut");
  displayUserTasks();
  setTimeout(() => {
    for (let ul of taskCardList) {
      ul.classList.replace("d-none", "d-flex");
    }
    modalContainer.classList.replace("d-flex", "d-none");
  }, 700);
}

//* FUNCTION TO SHOW LOG OUT BTN
function showLogOutBtn() {
  if (getLoggedUser()) {
    navSignUpBtn.classList.add("d-none");
    navLogInBtn.classList.add("d-none");
    navLogOutBtn.classList.remove("d-none");
    navDelAllBtn.classList.remove("d-none");
  } else {
    navSignUpBtn.classList.remove("d-none");
    navLogInBtn.classList.remove("d-none");
    navLogOutBtn.classList.add("d-none");
    navDelAllBtn.classList.add("d-none");
  }
}

showLogOutBtn();

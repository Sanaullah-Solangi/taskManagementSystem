//* GETTING ELEMENTS
var logInBtns = document.querySelector(".logInBtns");
var logOutBtns = document.querySelector(".logOutBtns");
var navLogo = document.querySelector(".logo");
var formLogInBtn = document.querySelector(".formLogInBtn");
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
var flagToEditTask = "";
var formDataCompleted = true; // FLAG TO CHECK EMPTY INPUT

//! ==============================================
//! SIGN-IN AND LOG-IN FUNCTIONALITIES
//! ==============================================

function getUserData() {
  let users = JSON.parse(localStorage.getItem("dataCollection")) ?? [];
  let currentUser = getLoggedUser();
  let usersTasks = [];
  for (let user of users) {
    if (user.email == currentUser) {
      Object.keys(user).forEach((arrayOfObject) => {
        if (Array.isArray(user[arrayOfObject])) {
          usersTasks.push(user[arrayOfObject]);
        }
      });
    }
  }
  return usersTasks;
}

function setUserData(taskArrays) {
  let users = JSON.parse(localStorage.getItem("dataCollection")) ?? [];
  let userInd;
  let currentUser = getLoggedUser();
  users.forEach((user, ind) => {
    if (user.email == currentUser) {
      userInd = ind;
      Object.keys(user).forEach((arrayOfObject) => {
        if (Array.isArray(user[arrayOfObject])) {
          if (arrayOfObject == "todos") {
            user[arrayOfObject] = taskArrays[0];
          } else if (arrayOfObject == "inProgress") {
            user[arrayOfObject] = taskArrays[1];
          } else if (arrayOfObject == "completed") {
            user[arrayOfObject] = taskArrays[2];
          }
        }
      });
      users[userInd] = user;
    }
  });
  localStorage.setItem("dataCollection", JSON.stringify(users));
}

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
    validateLengthOfPassword();
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
        location.href = "../index.html";
      });
    }
  });
}

//! ==============================================
//! LOCAL STORAGE MANAGEMENT
//! ==============================================

//* FUNCTION TO COLLECT DATA FROM MODAL AND SAVE TO LOCAL STORAGE
function saveDataToLocalStorageFromModal() {
  let modalTitle = document.querySelector("#modalTitle");
  let modalDeadLine = document.querySelector("#modalDeadLine");
  let modalStatus = document.querySelector("#modalStatus");
  let modalPriority = document.querySelector("#modalPriority");
  let modalDescription = document.querySelector("#modalDescription");
  let taskId = Math.round(Math.random() * 100000);
  let inputs = document.querySelectorAll(".modalContent input,textarea");
  let inputsAreFilled = true;

  for (let input of inputs) {
    if (input.value == "") {
      inputsAreFilled = false;
    }
  }
  if (inputsAreFilled && flagForUl && !flagToEditTask) {
    let userTasks = getUserData();
    let currentUserEmail = getLoggedUser();
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
    var todoData = {
      todoTaskId: taskId,
      taskTitle: modalTitle.value,
      taskDescription: modalDescription.value,
      taskDeadLine: modalDeadLine.value,
      taskStatus: modalStatus.value,
      taskPriority: modalPriority.value,
      taskPriorityId: `ID${taskId}`,
    };

    if (flagForUl.classList.contains("toDos")) {
      userTasks[0].push(todoData);
      setUserData(userTasks);
    } else if (flagForUl.classList.contains("inProgress")) {
      userTasks[1].push(todoData);
      setUserData(userTasks);
    } else if (flagForUl.classList.contains("completed")) {
      userTasks[2].push(todoData);
      setUserData(userTasks);
    }
    inputs.forEach((item) => {
      item.value = "";
    });
    flagForUl = "";
    hideModalAndShowUls();
  } else if (inputsAreFilled && !flagForUl && flagToEditTask) {
    let userTasks = getUserData();
    for (taskArr of userTasks) {
      for (task of taskArr) {
        if (task.todoTaskId == flagToEditTask) {
          task.taskTitle = modalTitle.value;
          task.taskDescription = modalDescription.value;
          task.taskStatus = modalStatus.value;
          task.taskDeadLine = modalDeadLine.value;
          task.taskPriority = modalPriority.value;
          break;
        }
      }
      setUserData(userTasks);
    }
    hideModalAndShowUls();
    inputs.forEach((item) => {
      item.value = "";
    });
    flagToEditTask = "";
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

//* FUNCTION TO SET DATA TO LOCAL STORAGE
function setDataCollection(usersData) {
  localStorage.setItem("dataCollection", JSON.stringify(usersData));
}

function setLoggedUserEmail(currentUserEmail) {
  localStorage.setItem("loggedInUserEmail", currentUserEmail);
}

//* FUNCTION TO DELETE ALL TASKS
function deleteAllTasks() {
  let arrOfTaskArrs = getUserData();
  let flagToShowError = 0;
  for (taskArrs of arrOfTaskArrs) {
    if (taskArrs.length != 0) {
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
            // ARR OF TODOS TASKS
            arrOfTaskArrs[0] = [];
            // ARR OF IN PROGRESS TSKS
            arrOfTaskArrs[1] = [];
            // ARR OF COMPLETED TASK
            arrOfTaskArrs[2] = [];
            setUserData(arrOfTaskArrs);
            displayUserTasks();
          });
        }
      });
    } else {
      flagToShowError += 1;
    }
  }
  if (flagToShowError == 3) {
    Swal.fire({
      customClass: {
        container: "sweatContainer",
        popup: "sweatPopup",
        title: "sweatTitle",
        htmlContainer: "sweatPara",
        confirmButton: "sweatBtn",
        cancelButton: "sweatBtn",
      },
      title: "No Tasks",
      text: "There are no tasks to delete.",
      icon: "info",
    });
  }
  setUserData(arrOfTaskArrs);
}

//* FUNCTION TO DELET TARGETD TASK
function deleteTask(event) {
  let cancelBtn = event.target;
  let cardId = cancelBtn.closest("li").id;
  let arrOfTaskArrs = getUserData();

  for (taskArr of arrOfTaskArrs) {
    taskArr.forEach((obj, ind) => {
      if (obj.todoTaskId == cardId) {
        taskArr.splice(ind, ind + 1);
      }
    });
  }
  setUserData(arrOfTaskArrs);
  displayUserTasks();
}

//! ==============================================
//! DRAG-AND-DROP TASK MANAGEMENT
//! ==============================================

//* Function to Handle Drag Start Event
function dragStart(event) {
  let cardId = event.target.id;
  let userTasks = getUserData();
  for (taskArr of userTasks) {
    taskArr.forEach((obj, ind) => {
      if (obj.todoTaskId == cardId) {
        taskToDrop = taskArr.splice(ind, ind + 1);
      }
    });
  }
  setUserData(userTasks);
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
  let userTasks = getUserData();
  for (taskArr of userTasks) {
    if (targetedUl.classList.contains("toDos")) {
      userTasks[0].push(taskToDrop[0]);
    } else if (targetedUl.classList.contains("inProgress")) {
      userTasks[1].push(taskToDrop[0]);
    } else if (targetedUl.classList.contains("completed")) {
      userTasks[2].push(taskToDrop[0]);
    }
    setUserData(userTasks);
    break;
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
  let userTasks = getUserData();
  for (taskArr of userTasks) {
    for (task of taskArr) {
      if (task.taskPriorityId == selectedPriorityId) {
        task.taskPriority = selectedPriority;
      }
    }
  }
  setUserData(userTasks);
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

//* FUNCTION TO DUBLICATE TASK
function copyTask(event) {
  let taskUl = event.target.closest("ul");
  let taskTitle = taskUl.querySelector(".taskTitle").innerHTML;
  let taskDescription = taskUl.querySelector(".taskDescription").innerHTML;
  let taskStatus = taskUl.querySelector(".taskStatus > .status").innerHTML;
  let taskPriority = taskUl.querySelector(".taskPriority > select").value;
  let taskDeadLine = taskUl.querySelector(".taskDeadLine > span").innerHTML;
  let taskId = Math.round(Math.random() * 100000);

  var duplicateData = {
    todoTaskId: taskId,
    taskTitle: taskTitle.trim(),
    taskDescription: taskDescription.trim(),
    taskDeadLine: taskDeadLine.trim(),
    taskStatus: taskStatus.trim(),
    taskPriority: taskPriority,
    taskPriorityId: `ID${taskId}`,
  };
  let userTasks = getUserData();
  for (taskArr of userTasks) {
    if (taskUl.classList.contains("toDos")) {
      userTasks[0].push(duplicateData);
      break;
    } else if (taskUl.classList.contains("inProgress")) {
      userTasks[1].push(duplicateData);
      break;
    } else if (taskUl.classList.contains("completed")) {
      userTasks[2].push(duplicateData);
      break;
    }
  }
  setUserData(userTasks);
  displayUserTasks();
}

//* FUNCTION TO ADJUST THE HEIGHT AND WIDTH OF EMPTY UL ELEMENTS
function resizeUl() {
  // RESIZING UL
  let userTasks = getUserData();
  userTasks.forEach((taskArr, index) => {
    //todo====== todos ======
    if (index == 0 && taskArr.length == 0) {
      toDosList.classList.add("heightWidth");
      toDosList.innerHTML = "<p class='d-flex'>add new task</p>";
    } else if (index == 0 && taskArr.length !== 0) {
      toDosList.classList.remove("heightWidth");
      toDosList.innerHTML = "<p class='d-none'>add new task</p>";
    }
    //todo====== in progress ======
    if (index == 1 && taskArr.length == 0) {
      inProgressList.classList.add("heightWidth");
      inProgressList.innerHTML = "<p class='d-flex'>add new task</p>";
    } else if (index == 1 && taskArr.length !== 0) {
      inProgressList.classList.remove("heightWidth");
      inProgressList.innerHTML = "<p class='d-none'>add new task</p>";
    }

    //todo====== completed ======
    if (index == 2 && taskArr.length == 0) {
      completedList.classList.add("heightWidth");
      completedList.innerHTML = "<p class='d-flex'>add new task</p>";
    } else {
      completedList.classList.remove("heightWidth");
      completedList.innerHTML = "<p class='d-none'>add new task</p>";
    }
  });
}
resizeUl();
//!

//* HELPER FUNCTION TO CREATE A TASK ITEM
window.createTaskItem = (task) => {
  return ` <li
                id="${task.todoTaskId}"
                class="task w-100 transition-1ms p-relative"
                draggable="true"
                ondragstart="dragStart(event)"
                ondragend="dragEnd(event)"
                >
                <!--?=== CANCEL BTN ===-->
                    <div
                      class="taskBtns p-absolute d-flex jc-center al-center pointer"
                    >
                    <i class="fa-regular fa-pen-to-square edit transition-1ms" onclick="showModalAndHideUls(event)"></i>
                    <i class="fa-regular fa-copy transition-1ms" onclick="copyTask(event)"></i>
                    <i class="fa-solid fa-xmark transition-1ms cancelBtn" onclick="deleteTask(event)"></i>
                  </div>
                    <p class="taskTitle">${
                      task.taskTitle || "not mentioned"
                    } </p>
                    <p class="taskDescription">
                    ${task.taskDescription || "not mentioned"}
                    </p>
                  <p class="taskDeadLine d-flex jc-between">
                      <strong>dead line :</strong> 
                      <span>${task.taskDeadLine || "not mentioned"}</span>      
                  </p>
                    <p class="taskRemainingTime d-flex jc-between">
                <strong>remaining Time :</strong>
                <span class="remainingTime d-flex"
                  ><span
                    class="remainingMonths d-flex dir-col al-center jc-center"
                    ><span>01</span>mons
                  </span>
                  <span class="remainingDays d-flex dir-col al-center jc-center"
                    ><span>30</span>days
                  </span>
                  <span
                    class="remainingHours d-flex dir-col al-center jc-center"
                    ><span>120</span>hors
                  </span>
                  <span
                    class="remainingMinutes d-flex dir-col al-center jc-center"
                    ><span>1800</span>mins
                  </span>
                  <span
                    class="remainingSeconds d-flex dir-col al-center jc-center"
                    ><span>1800</span>secs
                  </span>
                </span>
              </p>
                  <p class="taskStatus d-flex jc-between">
                    <strong>status :</strong><span class="status">${
                      task.taskStatus || "not mentioned"
                    } </span>
                  </p>

                <p class="taskPriority d-flex jc-between al-center">
                <strong>priority :</strong>
                <select
                onchange="updateTaskPriority(event)"
                class="pointer"
                name="priority"
                id="${task.taskPriorityId}"
              >
                <option value="heigh" ${
                  task.taskPriority == "heigh" ? "selected" : ""
                }>heigh</option>
                <option value="medium"${
                  task.taskPriority == "medium" ? "selected" : ""
                }>medium</option>
                <option value="low"${
                  task.taskPriority == "low" ? "selected" : ""
                }>low</option>
                </select>
              </p>
            </li>`;
};

//* FUNCTION TO RETRIEVE DATA FROM LOCAL STORAGE, CHECK THE LOGGED-IN USER'S ID, AND DISPLAY THEIR DATA
function displayUserTasks() {
  let userTasks = getUserData();
  let usersData = getData();
  let currentUserEmail = getLoggedUser();
  resizeUl();
  userTasks.forEach((taskArr, index) => {
    taskArr.forEach((objOfTask) => {
      let taskData = objOfTask;
      if (index == 0) {
        toDosList.innerHTML += createTaskItem(taskData);
      } else if (index == 1) {
        inProgressList.innerHTML += createTaskItem(taskData);
      } else if (index == 2) {
        completedList.innerHTML += createTaskItem(taskData);
      }
    });
  });
  updateStatus();
  showPriorityLevel();
}

displayUserTasks();

//! FUNCTION TO CALCULATE AND DISPLAY THE REMAINING TIME UNTIL THE TASK DEADLINE
window.displayRemainingTime = (taskId, ...remainingTime) => {
  let tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    if (task.id == taskId) {
      let remainingMonths = task.querySelector(".remainingMonths > span");
      let remainingDays = task.querySelector(".remainingDays > span");
      let remainingHours = task.querySelector(".remainingHours > span");
      let remainingMins = task.querySelector(".remainingMinutes > span");
      let remainingSecs = task.querySelector(".remainingSeconds > span");
      remainingMonths.innerHTML = remainingTime[0];
      remainingDays.innerHTML = remainingTime[1];
      remainingHours.innerHTML = remainingTime[2];
      remainingMins.innerHTML = remainingTime[3];
      remainingSecs.innerHTML = remainingTime[4];
    }
  });
};

function calculateRemainingTime() {
  let userTasks = getUserData();
  userTasks.forEach((taskArr) => {
    taskArr.forEach((task) => {
      let deadLine = task.taskDeadLine;
      let convertedDeadLine = new Date(deadLine);
      let currentDate = new Date();
      if (
        currentDate.getTime() == convertedDeadLine.getTime() ||
        currentDate.getTime() > convertedDeadLine.getTime()
      ) {
        let remainingTime = [0, 0, 0, 0, 0];
        displayRemainingTime(task.todoTaskId, ...remainingTime);
      } else {
        let diff = convertedDeadLine - currentDate;
        let months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        let days = Math.floor(
          (diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
        );
        let hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((diff % (1000 * 60)) / 1000);
        let remainingTime = [months, days, hours, minutes, seconds];
        displayRemainingTime(task.todoTaskId, ...remainingTime);
      }
    });
  });
}
setInterval(() => {
  calculateRemainingTime();
}, 1000);

//! ==============================================
//! MODAL FUNCTIONALITY
//! ==============================================

//* FUNCTION TO SHOW THE MODAL AND HIDE THE UL ELEMENTS
function showModalAndHideUls(event) {
  let clickedBtn = event.target;
  let container = event.target.closest(".todoProjectsContainer"); // MODAL CONTAINER
  let ul = container.querySelector("ul"); // PARENT UL OF CLICKED BTN
  let modalTitle = document.querySelector("#modalTitle");
  let modalDeadLine = document.querySelector("#modalDeadLine");
  let modalStatus = document.querySelector("#modalStatus");
  let modalPriority = document.querySelector("#modalPriority");
  let modalDescription = document.querySelector("#modalDescription");
  let modalContainer = document.querySelector(".modalContainer");
  let taskCardList = document.querySelectorAll(".taskCardList");

  //? HIDING ALL LISTS AND SHOWING MODAL
  for (list of taskCardList) {
    list.classList.replace("d-flex", "d-none");
    list.classList.remove("heightWidth");
  }
  modalContainer.classList.replace("d-none", "d-flex");
  modalContent.classList.replace("animate__bounceOut", "animate__bounceIn");

  //? IF EVENT TARGET IS EDIT BTN THIS PROGRAME WILL RUN
  if (clickedBtn.classList.contains("edit")) {
    //! GETTING MODAL'S VALUES & TARGET TAST TO EDIT
    let taskToEdit = event.target.closest("li"); // PARENT LI OF CLICKED BTN
    let idOftaskToEdit = event.target.closest("li").id; // ID OF PARENT LI OF CLICKED BTN
    let taskTitle = taskToEdit.querySelector(".taskTitle").innerHTML;
    let taskDescription =
      taskToEdit.querySelector(".taskDescription").innerHTML;
    let taskStatus = taskToEdit.querySelector(
      ".taskStatus > .status"
    ).innerHTML;
    let taskPriority = taskToEdit.querySelector(".taskPriority > select").value;
    let taskDeadLine = taskToEdit.querySelector(
      ".taskDeadLine > span"
    ).innerHTML;

    //! EDITING HEADINGS ACCORDING TO THE LIST
    if (ul.classList.contains("toDos")) {
      modalHeading.innerHTML = "Edit Todo Task";
    } else if (ul.classList.contains("inProgress")) {
      modalHeading.innerHTML = "Edit in pogress task";
    } else if (ul.classList.contains("completed")) {
      modalHeading.innerHTML = "Edit completed task";
    }
    //! ASSINGING TASK'S VALUES TO MODAL'S INPUTS
    modalTitle.value = taskTitle.trim();
    modalDescription.value = taskDescription.trim();
    modalDeadLine.value = taskDeadLine.trim();
    modalStatus.value = taskStatus.trim();
    modalPriority.value = taskPriority;
    //! ADJUSTING MODAL'S STATUS INPUT ACCORDING TO THE TASK STATUS
    if (taskStatus.trim() == "todo") {
      modalStatus.selectedIndex = 0;
    } else if (taskStatus.trim() == "in progress") {
      modalStatus.selectedIndex = 1;
    } else if (taskStatus.trim() == "completed") {
      modalStatus.selectedIndex = 2;
    }

    flagToEditTask = idOftaskToEdit;
  } else {
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
    flagForUl = ul;
  }
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
  let header = document.querySelector(".header");
  if (getLoggedUser()) {
    logInBtns.classList.replace("d-flex", "d-none");
    logOutBtns.classList.replace("d-none", "d-flex");
    header.classList.add("peddingRight");
  } else {
    logInBtns.classList.replace("d-none", "d-flex");
    logOutBtns.classList.replace("d-flex", "d-none");
    header.classList.remove("peddingRight");
  }
}

showLogOutBtn();

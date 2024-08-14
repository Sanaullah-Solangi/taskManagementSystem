import {
  app,
  auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  provider,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  getFirestore,
  db,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "./firebase.js";
//* GETTING ELEMENTS
let mainContainer = document.querySelector(".main-container");
let logInContainer = document.querySelector(".logInContainer");
let logInBtns = document.querySelector(".logInBtns");
let logOutBtns = document.querySelector(".logOutBtns");
let navLogo = document.querySelector(".logo");
let formLogInBtn = document.querySelector(".formLogInBtn");
let formSignUpBtn = document.querySelector(".formSignUpBtn");
let toDosList = document.querySelector(".toDos");
let inProgressList = document.querySelector(".inProgress");
let completedList = document.querySelector(".completed");
let modalContent = document.querySelector(".modalContent");
let modalHeading = document.querySelector(".modalHeading"); // MODAL HEADING
let modalStatus = document.querySelector("#modalStatus"); // STATUS INPUT IN MODAL
let nameValidation;
let emailValidation;
let passwordValidation;
let taskToDrop;
let flagForUl = "";
let flagToEditTask = "";
let formDataCompleted = true; // FLAG TO CHECK EMPTY INPUT
let capitalLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let smallLetters = "abcdefghijklmnopqrstuvwxyz";
let numbers = "0123456789";
let symbols = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
let storPassword = "";
let spiner = document.querySelector(".spinerContainer");
let spinerText = document.querySelector(".spinerText");
const uid = localStorage.getItem("uid");
//! ==============================================
//! SIGN-IN AND LOG-IN FUNCTIONALITIES
//! ==============================================

window.checkUserEmailVarification = () => {
  let userData = auth.currentUser;
  if (userData.emailVerified) {
    return true;
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
      title: "Action Restricted",
      text: "Please verify your email using the link we sent to your email to add tasks or perform any actions.",
    });

    return false;
  }
};

//* VALIDATE THE UESR NAME USING REGULAR EXPRESSION.
window.validateName = (event) => {
  const usernameRegex = /^(?!\s*$).+/;
  let name = document.querySelector("#name");
  if (!usernameRegex.test(name.value)) {
    nameValidation = false;
    return false;
  }
  nameValidation = true;
};

//* VALIDATE THE EMAIL ADDRESS USING REGULAR EXPRESSION.
window.validateEmail = (event) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let email = document.querySelector("#email");
  if (!emailRegex.test(email.value)) {
    emailValidation = false;
    return false;
  }
  emailValidation = true;
};

//* VALIDATE THE PASSWORD USING REGULAR EXPRESSION.
window.validatePassword = (event) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  let password = document.querySelector("#password");
  if (!passwordRegex.test(password.value)) {
    passwordValidation = false;
    return false;
  }
  passwordValidation = true;
};

//* UPDATING LABLE'S POSITOIN OF PLACEHOLDER ON THE LENGTH OF INPUT
window.updateLabelPosition = (event) => {
  let input = event.target;
  let inputCover = input.closest(".inputCover");
  let label = inputCover.querySelector("label");
  if (input.value.length > 0) {
    label.classList.add("labelPositionChange");
  } else {
    label.classList.remove("labelPositionChange");
  }
};

//* TOGGLE THE VISIBILITY OF THE PASSWORD FIELD.
window.togglePasswordVisibility = function () {
  let password = document.querySelector("#password");
  let showPassword = document.querySelector(".show");
  let hidePassword = document.querySelector(".hide");
  if (password.type == "password") {
    showPassword.classList.toggle("d-none");
    hidePassword.classList.toggle("d-none");
    password.type = "text";
  } else {
    showPassword.classList.toggle("d-none");
    hidePassword.classList.toggle("d-none");
    password.type = "password";
  }
};

//*PROGRAME TO CHECK PASSWORD STRENGTH LEVEL IN SIGNUP FORM
window.checkPasswordStatus = function () {
  var password = document.querySelector("#password");
  storPassword = password.value;
  var smallLettersFlag = false;
  var capitalLettersFlag = false;
  var numbersFlag = false;
  var symbolsFlag = false;
  let char;
  for (var i = 0; i < password.value.length; i++) {
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
};
//* FUNCTION TO SHOW STRENTH OF PASSWORD IN SINGUP FORM
window.showPasswordStatus = function (
  capsFlag,
  smallsFlag,
  numsFlag,
  symsFlag
) {
  let password = document.querySelector("#password");
  var strength = capsFlag + smallsFlag + numsFlag + symsFlag;
  //? conditional statements
  if (strength === 4) {
    password.style.border = "2px solid green";
  } else if (strength === 3) {
    password.style.border = "2px solid blue";
  } else if (strength === 2) {
    password.style.border = "2px solid orange";
  } else if (strength === 1) {
    password.style.border = "2px solid red";
  } else {
    password.style.border = "2px solid var(--mainColor3)";
  }
};

//* FUNCTION TO SIGN UP
window.signUp = function () {
  let name = document.querySelector("#name");
  let email = document.querySelector("#email");
  let password = document.querySelector("#password");
  let inputs = document.querySelectorAll("input");
  let formData = true;
  let lables = [];
  for (let input of inputs) {
    let inputCover = input.closest(".inputCover");
    let label = inputCover.querySelector("label");
    lables.push(label);
    if (!input.value) {
      formData = false;
    }
  }
  if (formData) {
    validateName();
    validateEmail();
    validatePassword();
    if (!nameValidation) {
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
        title: "Sorry...",
        text: "Please enter a valid username.",
      });
      nameValidation = true;
    } else if (!emailValidation) {
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
        title: "Sorry...",
        text: "Please enter a valid email address.",
      });
      emailValidation = true;
    } else if (!passwordValidation) {
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
        title: "Invalid Password",
        text: "Password must be at least 6 characters and include a mix of letters, numbers, and symbols.",
      });

      passwordValidation = true;
    } else if (nameValidation && emailValidation && passwordValidation) {
      spinerText.innerHTML = "Please wait while we create your account...";
      spiner.classList.replace("d-none", "d-flex");

      createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
          const user = userCredential.user;

          //* SENDING VARIFICATION EMAIL
          sendEmailVerification(auth.currentUser).then(() => {
            spiner.classList.replace("d-flex", "d-none");
            //* SENDING DATA TO THE FIRESTORE DATA BASE & SWITCHING TO THE LOGIN PAGE
            addUserDataToFireStore(user);
            //* DOING EMPTY ALL INPUTS
            name.value = "";
            email.value = "";
            password.value = "";
          });

          //* UPDATING POSITION OF LABLES
          lables.forEach((label) => {
            label.classList.remove("labelPositionChange");
          });
          lables = [];
          setLoggedUserEmail(user.email);
        })
        .catch((error) => {
          spiner.classList.replace("d-flex", "d-none");

          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          if (errorCode == "auth/network-request-failed") {
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
              title: "Network Error",
              text: "A network error occurred. Please check your internet connection and try again.",
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
              title: "User Already Exists",
              text: "An account with this email already exists.",
            });
          }
        });
    }
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
      icon: "warning",
      title: "sorry...",
      text: "please enter complete detail!",
    });
    formData = true;
  }
};

//* SIGN UP WITH GOOGLE
window.signUpWithGoogle = function () {
  let name = document.querySelector("#name");
  let email = document.querySelector("#email");
  let password = document.querySelector("#password");
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      //* SENDING VARIFICATION EMAIL
      sendEmailVerification(auth.currentUser).then(() => {
        //* SENDING DATA TO THE FIRESTORE DATA BASE & SWITCHING TO THE LOG IN PAGE
        addUserDataToFireStore(user);

        //* DOING EMPTY ALL INPUTS
        name.value = "";
        email.value = "";
        password.value = "";
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(error);
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
        title: "User Already Exists",
        text: "An account with this email already exists.",
      });
    });
};

//*SEND USER DATA TO FIRESTORE DATABASE
window.addUserDataToFireStore = async function (user) {
  let name = document.querySelector("#name");
  let email = document.querySelector("#email");
  let password = document.querySelector("#password");
  spinerText.innerHTML = "Almost done, saving your data...";
  spiner.classList.replace("d-none", "d-flex");
  try {
    localStorage.setItem("uid", user.uid);
    const response = await setDoc(doc(db, "users", user.uid), {
      userName: name.value,
      email: user.email,
      userPassword: password.value,
      emailVarification: user.emailVerified,
      uid: user.uid,
      todos: [],
      inProgress: [],
      completed: [],
    });
    spiner.classList.replace("d-flex", "d-none");
    Swal.fire({
      customClass: {
        container: "sweatContainer",
        popup: "sweatPopup",
        title: "sweatTitle",
        htmlContainer: "sweatPara",
        confirmButton: "sweatBtn",
        cancelButton: "sweatBtn",
      },
      icon: "success",
      title: "Account Created!",
      text: "Your account has been created successfully. A verification email has been sent to your email address. Please verify it.",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "../board.html";
      }
    });
  } catch (error) {
    spiner.classList.replace("d-flex", "d-none");
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
      title: "Error",
      text: "Failed to save your data. Please try again.",
    });

    console.log(error);
  }
};

//* LOG IN FUNCTION
window.logIn = function () {
  let email = logInContainer.querySelector("#email");
  let password = logInContainer.querySelector("#password");
  let inputs = logInContainer.querySelectorAll("input");
  let lables = [];
  let formData = true;
  for (let input of inputs) {
    let inputCover = input.closest(".inputCover");
    let label = inputCover.querySelector("label");
    lables.push(label);
    if (!input.value) {
      formData = false;
    }
  }

  if (formData) {
    spinerText.innerHTML = "Logging you in...";
    spiner.classList.replace("d-none", "d-flex");
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        spiner.classList.replace("d-flex", "d-none");
        Swal.fire({
          customClass: {
            container: "sweatContainer",
            popup: "sweatPopup",
            title: "sweatTitle",
            htmlContainer: "sweatPara",
            confirmButton: "sweatBtn",
            cancelButton: "sweatBtn",
          },
          icon: "success",
          title: "Welcome Back!",
          text: "You have successfully logged in. Welcome back!",
        });

        //* DOING EMPTY ALL INPUTS
        setLoggedUserEmail(email.value);
        email.value = "";
        password.value = "";

        //* UPDATING POSITION OF LABLES
        lables.forEach((label) => {
          label.classList.remove("labelPositionChange");
        });
        lables = [];

        const user = userCredential.user;
        localStorage.setItem("uid", user.uid);
        setTimeout(() => {
          location.href = "../board.html";
        }, 2000);
      })
      .catch((error) => {
        spiner.classList.replace("d-flex", "d-none");

        const errorCode = error.code;
        const errorMessage = error.message;
        if (error.code === "auth/user-not-found") {
          // Show "User Not Found" error alert
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
            title: "User Not Found",
            text: "No account found with this email. Please check your email or sign up.",
          });
        } else if (error.code === "auth/invalid-credential") {
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
            title: "Invalid Credential",
            text: "Please check your email or password.",
          });
        } else {
          // Handle other errors here
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
            title: "Authentication Error",
            text: `Error: ${error.message}`,
          });
          console.log(errorCode);
        }
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
      icon: "warning",
      title: "sorry...",
      text: "please enter complete detail!",
    });
    formData = true;
  }
};

//* FUNCTION TO LOG OUT
window.logOut = function () {
  spinerText.innerHTML = "logging you out";
  spiner.classList.replace("d-none", "d-flex");
  signOut(auth)
    .then(() => {
      spiner.classList.replace("d-flex", "d-none");
      localStorage.removeItem("uid");
      localStorage.removeItem("loggedInUserEmail");
      Swal.fire({
        customClass: {
          container: "sweatContainer",
          popup: "sweatPopup",
          title: "sweatTitle",
          htmlContainer: "sweatPara",
          confirmButton: "sweatBtn",
          cancelButton: "sweatBtn",
        },
        icon: "success",
        title: "Logged Out",
        text: "You have been successfully logged out.",
      });
      setTimeout(() => {
        location.href = "../index.html";
      }, 2000);
    })

    .catch((error) => {
      // spiner.classList.replace("d-flex", "d-none");

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
        title: "Logout Failed",
        text: "An error occurred while logging out. Please try again.",
      });

      // An error happened.
    });
};

//* FUNCTION TO GET CURRENT USER'S EMAIL IN LOCAL STORAGE
window.getLoggedUser = () => {
  var currentUserEmail = localStorage.getItem("loggedInUserEmail");
  return currentUserEmail;
};

//* FUNCTION TO SET CURRENT USER'S EMAIL IN LOCAL STORAGE
window.setLoggedUserEmail = (currentUserEmail) => {
  localStorage.setItem("loggedInUserEmail", currentUserEmail);
};

//* FUNCTION TO RESET PASSWORD
window.resetPassword = function () {
  let email = logInContainer.querySelector("#email");
  let formData = true;
  if (!email.value) {
    formData = false;
  }

  if (formData) {
    sendPasswordResetEmail(auth, email.value)
      .then(() => {
        Swal.fire({
          customClass: {
            container: "sweatContainer",
            popup: "sweatPopup",
            title: "sweatTitle",
            htmlContainer: "sweatPara",
            confirmButton: "sweatBtn",
            cancelButton: "sweatBtn",
          },
          icon: "success",
          title: "Email Sent!",
          text: "Password reset email has been sent to your email. Please check your inbox.",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
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
          title: "Error",
          text: `Error: ${errorMessage}`,
        });
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
      icon: "warning",
      title: "Sorry...",
      text: "Please fill in the email field.",
    });

    formData = true;
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(user);
    if (location.pathname == "/main.html") {
      getUserDataFromFireStore();
    }
  } else {
    // User is signed out
    console.log("user not exist");
  }
});

//! ==============================================
//! FIRESTORE DATA BASE MANAGEMENT
//! ==============================================

//* FUNCTION TO GET DATA FROM FIRESTORE DATA BASE
window.getDataFromDataBase = async () => {
  const userDataRef = doc(db, "users", uid);
  const userDataObj = await getDoc(userDataRef);
  let userData = userDataObj.data();
  let arrOfTaskArrs = [];
  Object.keys(userData).forEach((taskArr) => {
    if (Array.isArray(userData[taskArr])) {
      if (taskArr == "todos") {
        arrOfTaskArrs[0] = userData[taskArr];
      } else if (taskArr == "inProgress") {
        arrOfTaskArrs[1] = userData[taskArr];
      } else if (taskArr == "completed") {
        arrOfTaskArrs[2] = userData[taskArr];
      }
    }
  });
  return arrOfTaskArrs;
};

//* FUNCTION TO UPDATE DATA IN FIRESTORE DATA BASE
window.updateDataInDataBase = async (arrOfTaskArrs) => {
  const userDataRef = doc(db, "users", uid);
  try {
    await updateDoc(userDataRef, {
      todos: arrOfTaskArrs[0],
      inProgress: arrOfTaskArrs[1],
      completed: arrOfTaskArrs[2],
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};
//* FUNCTION TO COLLECT DATA FROM MODAL AND SAVE TO FIRESTORE DATA BASE
window.saveDataToLocalStorageFromModal = async () => {
  if (flagToEditTask) {
    spinerText.innerHTML = "Saving your changes, please wait...";
  } else {
    spinerText.innerHTML = "Saving your new task, hold on...";
  }
  spiner.classList.replace("d-none", "d-flex");
  const userDataRef = doc(db, "users", uid);
  let arrOfTaskArrs = await getDataFromDataBase();
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
  let todoData = {
    todoTaskId: taskId,
    taskTitle: modalTitle.value,
    taskDescription: modalDescription.value,
    taskDeadLine: modalDeadLine.value,
    taskStatus: modalStatus.value,
    taskStatusForInput: modalStatus.value,
    taskStatusId: `ST${taskId}`,
    taskPriority: modalPriority.value,
    taskPriorityId: `ID${taskId}`,
  };
  if (inputsAreFilled && flagForUl && !flagToEditTask) {
    if (!getLoggedUser()) {
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

    try {
      if (flagForUl.classList.contains("toDos")) {
        await updateDoc(userDataRef, {
          todos: arrayUnion(todoData),
        });
      } else if (flagForUl.classList.contains("inProgress")) {
        await updateDoc(userDataRef, {
          inProgress: arrayUnion(todoData),
        });
      } else if (flagForUl.classList.contains("completed")) {
        await updateDoc(userDataRef, {
          completed: arrayUnion(todoData),
        });
      }
      spiner.classList.replace("d-flex", "d-none");
    } catch (error) {
      spiner.classList.replace("d-flex", "d-none");
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
        title: "Task Not Added",
        text: "There was an issue while adding the task. Please try again later.",
      });

      console.log(error);
    }

    inputs.forEach((item) => {
      item.value = "";
    });
    flagForUl = "";
    hideModalAndShowUls();
  } else if (inputsAreFilled && flagForUl && flagToEditTask) {
    try {
      arrOfTaskArrs.forEach((taskArry) => {
        taskArry.forEach((task, ind) => {
          if (task.todoTaskId == flagToEditTask) {
            taskArry[ind] = todoData;
          }
        });
      });

      await updateDataInDataBase(arrOfTaskArrs);
      spiner.classList.replace("d-flex", "d-none");
    } catch (error) {
      spiner.classList.replace("d-flex", "d-none");
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
        title: "Editing Failed",
        text: "There was an issue while saving your changes. Please try again later.",
      });

      console.log(error);
    }

    hideModalAndShowUls();
    inputs.forEach((item) => {
      item.value = "";
    });
    flagToEditTask = "";
    flagForUl = "";
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
};

window.getRealTimeData = () => {
  spiner.classList.replace("d-none", "d-flex");
  spinerText.innerHTML = "Loading your data, please wait...";
  if (location.pathname == "/board.html") {
    let arrOfTaskArrs = [];
    try {
      onSnapshot(doc(db, "users", uid), (doc) => {
        let userData = doc.data();
        for (let arrayOfObject in userData) {
          if (Array.isArray(userData[arrayOfObject])) {
            if (arrayOfObject == "todos") {
              arrOfTaskArrs[0] = userData[arrayOfObject];
            } else if (arrayOfObject == "inProgress") {
              arrOfTaskArrs[1] = userData[arrayOfObject];
            } else if (arrayOfObject == "completed") {
              arrOfTaskArrs[2] = userData[arrayOfObject];
            }
          }
        }
        resizeUl(arrOfTaskArrs);
        displayUserTasks(arrOfTaskArrs);
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      spiner.classList.replace("d-flex", "d-none");
      if (errorCode == "auth/network-request-failed") {
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
          title: "Network Error",
          text: "A network error occurred. Please check your internet connection and try again.",
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
          title: "Data Fetch Failed",
          text: "An error occurred while fetching the data. Please try again later.",
        });
      }
    }
  }
  spiner.classList.replace("d-flex", "d-none");
};
getRealTimeData();

//* FUNCTION TO DELETE ALL TASKS
window.deleteAllTasks = async () => {
  if (checkUserEmailVarification()) {
    spiner.classList.replace("d-none", "d-flex");
    spinerText.innerHTML = "Clearing All Tasks... Hang Tight.";
    let flagToShowError = 0;
    try {
      const userDataRef = doc(db, "users", uid);
      let arrOfTaskArrs = await getDataFromDataBase();

      arrOfTaskArrs.forEach((arrayOfObject) => {
        if (arrayOfObject.length != 0) {
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
              }).then(async () => {
                await updateDoc(userDataRef, {
                  todos: [],
                  inProgress: [],
                  completed: [],
                });
              });
              spiner.classList.replace("d-flex", "d-none");
            }
          });
        } else {
          flagToShowError += 1;
        }
      });
    } catch (error) {
      spiner.classList.replace("d-flex", "d-none");
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
        title: "Deletion Failed",
        text: "Unable to clear all tasks. Please try again or check your connection.",
      });
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
  }
};

//* FUNCTION TO DELET TARGETD TASK
window.deleteTask = async (event) => {
  spiner.classList.replace("d-none", "d-flex");
  spinerText.innerHTML = "Removing Task... Just a Moment...";
  let taskLi = event.target.closest("li");
  let taskId = taskLi.id;
  try {
    let arrOfTaskArrs = await getDataFromDataBase();
    arrOfTaskArrs.forEach((taskArr) => {
      taskArr.forEach((obj, ind) => {
        if (obj.todoTaskId == taskId) {
          taskArr.splice(ind, ind + 1);
        }
      });
    });

    updateDataInDataBase(arrOfTaskArrs);
    spiner.classList.replace("d-flex", "d-none");
  } catch (error) {
    spiner.classList.replace("d-flex", "d-none");
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
      title: "Task Deletion Failed",
      text: "There was an issue deleting the task. Please try again.",
    });
    console.logerror;
  }
};

//! ==============================================
//! DRAG-AND-DROP TASK MANAGEMENT
//! ==============================================

//* Function to Handle Drag Start Event
window.dragStart = async (event) => {
  let cardId = event.target.id;
  let startPoint = event.target.closest("ul");
  localStorage.setItem("ID", cardId);
  flagForUl = startPoint;

  event.target.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
  event.target.style.opacity = "0";
  event.target.style.border = "2px solid var(--mainColor1)";
};

//* Function to Handle Drag End Event
window.dragEnd = (event) => {
  event.dataTransfer.setData("text", event.target.id);
  event.target.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
  event.target.style.opacity = "1";
  event.target.style.border = "2px solid transparent";
};

//* Function to Handle Drag Over Event
window.dragOver = (event) => {
  event.preventDefault();
};
//* Function to Handle Drop Event
window.drop = async (event) => {
  event.preventDefault();
  let taskId = localStorage.getItem("ID");
  let target = event.target;
  let statusId;
  let targetedUl;
  if (!target.classList.contains("taskCardList")) {
    targetedUl = target.closest("ul");
  } else {
    targetedUl = target;
  }
  try {
    let arrOfTaskArrs = await getDataFromDataBase();
    arrOfTaskArrs.forEach((taskArry) => {
      taskArry.forEach((task, ind) => {
        if (task.todoTaskId == taskId) {
          taskToDrop = taskArry.splice(ind, ind + 1);
          if (targetedUl.classList.contains("toDos")) {
            arrOfTaskArrs[0].push(taskToDrop[0]);
            statusId = taskToDrop[0].taskStatusId;
          } else if (targetedUl.classList.contains("inProgress")) {
            arrOfTaskArrs[1].push(taskToDrop[0]);
            statusId = taskToDrop[0].taskStatusId;
          } else if (targetedUl.classList.contains("completed")) {
            arrOfTaskArrs[2].push(taskToDrop[0]);
            statusId = taskToDrop[0].taskStatusId;
          }
        }
      });
    });
    updateDataInDataBase(arrOfTaskArrs);
    updateStatus(targetedUl, statusId);
  } catch (error) {
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
      title: "Drop Failed",
      text: "There was an issue moving the task. Please try again.",
    });
    console.log(error);
  }
};

//! ==============================================
//! TASK MANAGEMENT FUNCTIONALITIES
//! ==============================================

//* FUNCTION TO UPDATE THE STATUS OF A TASK BASED ON ITS UL LOCATION
window.updateStatus = async (targetedUl, statusId) => {
  try {
    let arrOfTaskArrs = await getDataFromDataBase();
    if (targetedUl) {
      arrOfTaskArrs.forEach((taskArr) => {
        taskArr.forEach((task) => {
          if (task.taskStatusId == statusId) {
            if (targetedUl.classList.contains("toDos")) {
              task.taskStatus = "todos";
            } else if (targetedUl.classList.contains("inProgress")) {
              task.taskStatus = "inProgress";
            } else if (targetedUl.classList.contains("completed")) {
              console.log("completed");
              task.taskStatus = "completed";
            }
          }
        });
      });
      updateDataInDataBase(arrOfTaskArrs);
    }
  } catch (error) {
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
      title: "Status Update Failed",
      text: "An error occurred while updating the task status. Please try again.",
    });
  }
  console.log(error);
};

//* FUNCTIONs TO UPDATE TASK Status
window.updateTaskStatusByInput = async (event) => {
  let selectedStatusId = event.target.id;
  let selectedStatus = event.target.value;
  try {
    let arrOfTaskArrs = await getDataFromDataBase();
    for (let taskArr of arrOfTaskArrs) {
      for (let task of taskArr) {
        if (task.taskStatusId == selectedStatusId) {
          task.taskStatusForInput = selectedStatus;
        }
      }
    }
    updateDataInDataBase(arrOfTaskArrs);
    changeUlBasedOnTaskStatus(selectedStatusId, selectedStatus);
    showStatusLevel();
  } catch (error) {
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
      title: "Status Update Failed",
      text: "An error occurred while moving the task to the appropriate list. Please try again.",
    });
    console.log(error);
  }
};

window.changeUlBasedOnTaskStatus = async (statusId, status) => {
  let arrOfTaskArrs = await getDataFromDataBase();
  arrOfTaskArrs.forEach((taskArr) => {
    taskArr.forEach((task, ind) => {
      if (task.taskStatusId == statusId) {
        if (status == "todo") {
          let temp = taskArr.splice(ind, ind + 1);
          arrOfTaskArrs[0].push(temp[0]);
        } else if (status == "in progress") {
          let temp = taskArr.splice(ind, ind + 1);
          arrOfTaskArrs[1].push(temp[0]);
        } else if (status == "completed") {
          let temp = taskArr.splice(ind, ind + 1);
          arrOfTaskArrs[2].push(temp[0]);
        }
      }
    });
  });
  updateDataInDataBase(arrOfTaskArrs);
};

//* FUNCTION TO CHANGE COLOR BASED ON STATUS
window.showStatusLevel = () => {
  let statusLevel = document.querySelectorAll(".inputTaskStatus > select");
  for (let selectedStatus of statusLevel) {
    if (selectedStatus.value == "todo") {
      selectedStatus.classList.remove("green", "blue");
      selectedStatus.classList.add("red");
    } else if (selectedStatus.value == "in progress") {
      selectedStatus.classList.remove("red", "green");
      selectedStatus.classList.add("blue");
    } else if (selectedStatus.value == "completed") {
      selectedStatus.classList.remove("blue", "red");
      selectedStatus.classList.add("green");
    }
    selectedStatus.blur();
  }
};

//* FUNCTION TO UPDATE TASK PRIORITY
window.updateTaskPriority = async (event) => {
  let selectedPriorityId = event.target.id;
  let selectedPriority = event.target.value;
  try {
    let arrOfTaskArrs = await getDataFromDataBase();

    for (let taskArr of arrOfTaskArrs) {
      for (let task of taskArr) {
        if (task.taskPriorityId == selectedPriorityId) {
          task.taskPriority = selectedPriority;
        }
      }
    }
    updateDataInDataBase(arrOfTaskArrs);
    showPriorityLevel();
  } catch (error) {
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
      title: "Priority Update Failed",
      text: "An error occurred while updating the task priority. Please try again.",
    });
  }
};
//* FUNCTION TO CHANGE COLOR BASED ON PRIORITY LEVEL
window.showPriorityLevel = () => {
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
};
showPriorityLevel();

//* FUNCTION TO DUBLICATE TASKs
window.copyTask = async (event) => {
  let taskUl = event.target.closest("ul");
  let taskLi = event.target.closest("li");
  let taskTitle = taskLi.querySelector(".taskTitle").innerHTML;
  let taskDescription = taskLi.querySelector(".taskDescription").innerHTML;
  let taskStatus = taskLi.querySelector(".taskStatus > .status").innerHTML;
  let taskStatusByInput = taskLi.querySelector(
    ".inputTaskStatus > select"
  ).value;
  let taskPriority = taskLi.querySelector(".taskPriority > select").value;
  let taskDeadLine = taskLi.querySelector(".taskDeadLine > span").innerHTML;
  let taskId = Math.round(Math.random() * 100000);
  const userDataRef = doc(db, "users", uid);

  var duplicateData = {
    todoTaskId: taskId,
    taskTitle: taskTitle.trim(),
    taskDescription: taskDescription.trim(),
    taskDeadLine: taskDeadLine.trim(),
    taskStatus: taskStatus.trim(),
    taskStatusForInput: taskStatusByInput.trim(),
    taskStatusId: `ST${taskId}`,
    taskPriority: taskPriority,
    taskPriorityId: `ID${taskId}`,
  };
  try {
    if (taskUl.classList.contains("toDos")) {
      await updateDoc(userDataRef, {
        todos: arrayUnion(duplicateData),
      });
    } else if (taskUl.classList.contains("inProgress")) {
      await updateDoc(userDataRef, {
        inProgress: arrayUnion(duplicateData),
      });
    } else if (taskUl.classList.contains("completed")) {
      await updateDoc(userDataRef, {
        completed: arrayUnion(duplicateData),
      });
    }
  } catch (error) {
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
      title: "Copy Failed",
      text: "An error occurred while copying the task. Please try again.",
    });

    console.log(error);
  }
};

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
                    ><span>0</span>mons
                  </span>
                  <span class="remainingDays d-flex dir-col al-center jc-center"
                    ><span>0</span>days
                  </span>
                  <span
                    class="remainingHours d-flex dir-col al-center jc-center"
                    ><span>0</span>hors
                  </span>
                  <span
                    class="remainingMinutes d-flex dir-col al-center jc-center"
                    ><span>0</span>mins
                  </span>
                  <span
                    class="remainingSeconds d-flex dir-col al-center jc-center"
                    ><span>0</span>secs
                  </span>
                </span>
              </p>
                  <p class="taskStatus d-flex jc-between">
                    <strong>status :</strong><span class="status">${
                      task.taskStatus || "not mentioned"
                    } </span>
                  </p>

              <p class="inputTaskStatus d-none  jc-between al-center">
                <strong>status :</strong>
                <select
                  onchange="updateTaskStatusByInput(event)"
                  class="pointer"
                  name="priority"
                  id="${task.taskStatusId}"
                >
                  <option value="todo" ${
                    task.taskStatusForInput == "todo" ? "selected" : ""
                  }>todo</option>
                  <option value="in progress" ${
                    task.taskStatusForInput === "inProgress" ||
                    task.taskStatusForInput === "in progress"
                      ? "selected"
                      : ""
                  } >in progress</option>
                  <option value="completed" ${
                    task.taskStatusForInput == "completed" ? "selected" : ""
                  }>completed</option>
                </select>
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
window.displayUserTasks = (arrOfTaskArrs) => {
  arrOfTaskArrs.forEach((taskArr, index) => {
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
  showPriorityLevel();
  showStatusLevel();
};

//* FUNCTION TO CALCULATE AND DISPLAY THE REMAINING TIME UNTIL THE TASK DEADLINE
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

window.calculateRemainingTime = async () => {
  try {
    let arrOfTaskArrs = await getDataFromDataBase();
    arrOfTaskArrs.forEach((taskArr) => {
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
  } catch (error) {
    console.log(error);
  }
};
setInterval(() => {
  if (location.pathname == "./board.html") {
    calculateRemainingTime();
  }
}, 1000);

//! ==============================================
//! UI ELEMENTS MANAGEMENT (MODALS, LISTS, BUTTONS)
//! ==============================================

//* FUNCTION TO ADJUST THE HEIGHT AND WIDTH OF EMPTY UL ELEMENTS
window.resizeUl = (arrOfTaskArrs) => {
  arrOfTaskArrs.forEach((taskArr, index) => {
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
};

//* FUNCTION TO SHOW THE MODAL AND HIDE THE UL ELEMENTS
window.showModalAndHideUls = (event) => {
  let clickedBtn = event.target;
  let container = event.target.closest(".todoProjectsContainer");
  let ul = container.querySelector("ul"); // PARENT UL OF CLICKED BTN
  let modalTitle = document.querySelector("#modalTitle");
  let modalDeadLine = document.querySelector("#modalDeadLine");
  let modalStatus = document.querySelector("#modalStatus");
  let modalPriority = document.querySelector("#modalPriority");
  let modalDescription = document.querySelector("#modalDescription");
  let modalContainer = document.querySelector(".modalContainer");
  let taskCardList = document.querySelectorAll(".taskCardList");
  if (checkUserEmailVarification()) {
    //? HIDING ALL LISTS AND SHOWING MODAL
    for (let list of taskCardList) {
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
      let taskPriority = taskToEdit.querySelector(
        ".taskPriority > select"
      ).value;
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
      flagForUl = ul;
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
};

//* FUNCTION TO HIDE THE MODAL AND SHOW THE UL ELEMENTS
window.hideModalAndShowUls = () => {
  let modalContainer = document.querySelector(".modalContainer");
  let taskCardList = document.querySelectorAll(".taskCardList");
  modalContent.classList.replace("animate__bounceIn", "animate__bounceOut");
  setTimeout(() => {
    for (let ul of taskCardList) {
      ul.classList.replace("d-none", "d-flex");
    }
    modalContainer.classList.replace("d-flex", "d-none");
  }, 700);
};

//* FUNCTION TO SHOW LOG OUT BTN
window.showLogOutBtn = () => {
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
};

showLogOutBtn();

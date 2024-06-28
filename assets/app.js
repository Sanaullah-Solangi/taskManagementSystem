function showPriorityLevel() {
  var priorityLevel = document.querySelectorAll(".cardPriority > select");
  for (let selectedLeverl of priorityLevel) {
    if (selectedLeverl.value == "medium") {
      selectedLeverl.classList.add("blue", "blueBorder");
      selectedLeverl.classList.remove(
        "green",
        "red",
        "greenBorder",
        "redBorder"
      );
    } else if (selectedLeverl.value == "low") {
      selectedLeverl.classList.add("green", "greenBorder");
      selectedLeverl.classList.remove("red", "blue", "redBorder", "blueBorder");
    } else if (selectedLeverl.value == "heigh") {
      selectedLeverl.classList.add("red");
      selectedLeverl.classList.add("redBorder");
      selectedLeverl.classList.remove(
        "blue",
        "green",
        "greenBorder",
        "blueBorder"
      );
    }
    selectedLeverl.blur();
  }
}
showPriorityLevel();

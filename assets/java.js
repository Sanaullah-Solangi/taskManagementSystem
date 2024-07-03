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

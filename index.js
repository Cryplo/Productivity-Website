//Cookies
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

//Task List Functions
function addTask(value, t, state = false){
    //get task list div
    var taskList = t.parentElement.querySelector(".taskList");
    //creat container div
    const divContainer = document.createElement("div");
    divContainer.className = "taskContainer";
    divContainer.draggable = false;
    //create opening div
    const divStart = document.createElement("div");
    divStart.className = "draggable";
    divStart.draggable = false;
    //create new checkbox
    const newCheckbox = document.createElement("input");
    newCheckbox.type = "checkbox";
    newCheckbox.className = "taskCheckbox";
    if(state) newCheckbox.checked = true;
    else newCheckbox.checked = false;
    divStart.appendChild(newCheckbox);
    //create new label
    const newLabel = document.createElement("input");
    newLabel.type = "text";
    //newLabel.innerHTML = "New Task";
    newLabel.contentEditable = true;
    newLabel.value = value;
    newLabel.className = "taskInput";
    divStart.appendChild(newLabel);
    //create a br
    divStart.appendChild(document.createElement('br'));
    divContainer.append(divStart);
    taskList.appendChild(divContainer);
}
function removeTask(t){
    //get task list div
    var taskList = t.parentElement.querySelector(".taskList");
    taskList.lastElementChild.remove();
}
function savePage(){
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++)
    eraseCookie(cookies[i].split("=")[0]);

    /*const taskLists = document.querySelectorAll(".taskList");
    const taskList = taskLists[0];
    var taskInputs = taskList.querySelectorAll(".taskInput");
    var checkboxs = taskList.querySelectorAll(".taskCheckbox");
    for(var i = 0; i < taskInputs.length; i++){
        var val = taskInputs[i].value;
        val.replace(";", "");
        setCookie(i, val, 365);
        setCookie(i + "state", checkboxs[i].checked, 365);
    }*/
    const widgets = document.querySelectorAll(".widgetContainer");
    for(var i = 0; i < widgets.length; i++){
        if(widgets[i].classList.contains("deleted")){
            continue;
        }
        if(widgets[i].classList.contains("taskWidget")){
            setCookie(i+"type", "task", 365);
            setCookie(i+"left", widgets[i].style.left);
            setCookie(i+"top", widgets[i].style.top);
            const taskList = widgets[i].querySelector(".taskList");
            var checkboxs = taskList.querySelectorAll(".taskCheckbox");
            var taskInputs = taskList.querySelectorAll(".taskInput");
            for(var j = 0; j < taskInputs.length; j++){
                var val = taskInputs[j].value;
                val = encodeURIComponent(val);
                setCookie("task"+j+"for"+i, val, 365);
                setCookie("taskState"+j+"for"+i, checkboxs[j].checked, 365);
            }
        }
        else if(widgets[i].classList.contains("notesWidget")){
            setCookie(i+"type", "notes", 365);
            setCookie(i+"left", widgets[i].style.left);
            setCookie(i+"top", widgets[i].style.top);
            var val = widgets[i].querySelector(".noteBox").value;
            val = encodeURIComponent(val);
            setCookie("note"+i, val, 365);
        }
        else if(widgets[i].classList.contains("timerWidget")){
            setCookie(i+"type", "timer", 365);
            setCookie(i+"left", widgets[i].style.left);
            setCookie(i+"top", widgets[i].style.top);
            var val = widgets[i].querySelector(".timer").getAttribute("data-current-time");
            setCookie("timer"+i, val, 365);
            var val = widgets[i].querySelector(".timer").getAttribute("data-original-time");
            setCookie("timerOriginal"+i, val, 365);
            var val = widgets[i].querySelector(".timer").getAttribute("data-state");
            setCookie("timerPlayPause"+i, val, 365);
        }
    }

}
function loadPage(){
    var cookies = document.cookie.split(";");
    if(cookies.length==1)return;
    /*const taskListContainers = document.querySelectorAll(".taskListContainer");
    const addButton = taskListContainers[0].querySelectorAll(".addTask")[0];
    console.log(addButton);
    for (var i = 0; i < cookies.length; i+=2){
        if(cookies[i+1].split("=")[1] == "true")addTask(cookies[i].split("=")[1], addButton, true);
        else addTask(cookies[i].split("=")[1], addButton);
    }*/
    /*var i = 0;
    while(i < cookies.length){
        var val = cookies[i].split("=")[1];
        var j = 0;
        if(val == "task"){
            var newListWidget = addListWidget();
            newListWidget.style.left = cookies[i+1].split("=")[1];
            newListWidget.style.top = cookies[i+2].split("=")[1];
            var addButton = newListWidget.querySelector(".addButton");
            j = i+3;
            while(j < cookies.length){
                var val2 = cookies[j].split("=")[1];
                var name2 = cookies[j].split("=")[0]
                if(name2.includes("task"))break;
                if(cookies[j+1].split("=")[1] == "true")addTask(cookies[j].split("=")[1], addButton, true);
                else addTask(cookies[j].split("=")[1], addButton);
                j+=2;
            }
        }
        console.log(j);
        i = j;
    }*/
    var i = 0;
    var state = "newWidget";
    var addButton;
    var newWidget;
    while(i < cookies.length){
        var val = cookies[i].split("=")[1];
        if(val == "task" && state == "newWidget"){
            newWidget = addListWidget();
            state = "positionTask";
            i++;
        }
        else if(val == "notes" && state == "newWidget"){
            newWidget = addNoteWidget();
            //console.log(newWidget);
            state = "positionNotes";
            i++;
        }
        else if(val == "timer" && state == "newWidget"){
            newWidget = addTimerWidget();
            //console.log(newWidget);
            state = "positionTimer";
            i++;
        }
        else if(state == "positionTask"){
            //console.log(cookies[i].split("=")[1]);
            //console.log(cookies[i+1].split("=")[1]);
            newWidget.style.left = cookies[i].split("=")[1];
            newWidget.style.top = cookies[i+1].split("=")[1];
            addButton = newWidget.querySelector(".addTask");
            state = "addTask";
            i+=2;
        }
        else if(state == "positionNotes"){
            //console.log(cookies[i].split("=")[1]);
            //console.log(cookies[i+1].split("=")[1]);
            newWidget.style.left = cookies[i].split("=")[1];
            newWidget.style.top = cookies[i+1].split("=")[1];
            state = "addNotes";
            i+=2;
        }
        else if(state == "positionTimer"){
            //console.log(cookies[i].split("=")[1]);
            //console.log(cookies[i+1].split("=")[1]);
            newWidget.style.left = cookies[i].split("=")[1];
            newWidget.style.top = cookies[i+1].split("=")[1];
            state = "addTimer";
            i+=2;
        }
        else if(state == "addTask"){
            var name = cookies[i].split("=")[0];
            if(name.includes("type")){
                state = "newWidget";
            }
            else{   
                val = decodeURIComponent(val);
                if(cookies[i+1].split("=")[1] == "true")addTask(val, addButton, true);
                else addTask(val, addButton);
                i+=2;
            }
        }
        else if(state == "addNotes"){
            val = decodeURIComponent(val);
            newWidget.querySelector(".noteBox").innerHTML = val;
            state = "newWidget";
            i++;
        }
        else if(state == "addTimer"){
            newWidget.querySelector(".timer").setAttribute("data-original-time", cookies[i+1].split("=")[1]);
            newWidget.querySelector(".timer").setAttribute("data-current-time", val);
            newWidget.querySelector(".timer").setAttribute("data-state", cookies[i+2].split("=")[1]);
            if(cookies[i+2].split("=")[1] == "pause"){
                newWidget.querySelector(".timer").removeAttribute("readonly");
                newWidget.querySelector(".playPauseButton").value = "Play";
            }
            newWidget.querySelector(".timer").value = formatTimeLeft(val);
            //console.log(formatTimeLeft(val));
            state = "newWidget";
            i+=3;
        }
    }
}

function onLoad(){
    loadPage();
    var themeList = document.querySelector("#themeList");
    themeList.style.display = "none";
    var widgetList = document.querySelector("#widgetList");
    widgetList.style.display = "none";
}

//Interactions
//Hide cursor when dragging
document.addEventListener("dragstart", function( event ) {
    var img = new Image();
    img.src = '';
    event.dataTransfer.setDragImage(img, 0, 0);
}, false);
//Show/Hide task widgets
var toggleButtons = document.querySelectorAll(".toggleButton");
var mouseClick = false;
for(var i = 0; i < toggleButtons.length; i++){
    toggleButtons[i].addEventListener("click", function(){toggleWidgetVisibility(this)}, false);
}

function toggleWidgetVisibility(t){
    if(mouseWasDown){
        mouseWasDown = false;   
        return;
    }
    var widgetBodyContainer = t.parentElement.querySelector(".widgetBodyContainer");
    if(t.value == "-"){
        if(widgetBodyContainer.classList.contains("showWidget")){
            widgetBodyContainer.classList.remove("showWidget");
        }
        widgetBodyContainer.classList.add("hideWidget");
        t.value = "+";
    }
    else{
        if(widgetBodyContainer.classList.contains("hideWidget")){
            widgetBodyContainer.classList.remove("hideWidget");
        }
        widgetBodyContainer.classList.add("showWidget");
        t.value = "-";
    }
}

//Add tasks
var addTaskButtons = document.querySelectorAll(".addTask");
for(var i = 0; i < addTaskButtons.length; i++){
    addTaskButtons[i].addEventListener("click", function(){addTask('New Task', this)}, false);
}
//Remove tasks
var removeTaskButtons = document.querySelectorAll(".removeTask");
for(var i = 0; i < removeTaskButtons.length; i++){
    removeTaskButtons[i].addEventListener("click", function(){removeTask(this)}, false);
}
//Save tasks
/*
var saveTasksButton = document.querySelector("#saveTask");
saveTasksButton.addEventListener("click", function(){saveTasks()}, false);*/
//Show/Hide Theme List
var themeButton = document.querySelector("#themeButton");
themeButton.addEventListener("click", function(){
    var themeList = document.querySelector("#themeList");
    if(themeList.classList.contains("hideNav")){
        themeList.classList.remove("hideNav");
    }
    //themeList.classList.add("showNav");
    themeList.style.display = "";
}, false)

var themeContainer = document.querySelector("#themeContainer");
themeContainer.addEventListener("mouseleave", function(){
    var themeList = document.querySelector("#themeList");
    if(themeList.classList.contains("showNav")){
        themeList.classList.remove("showNav");
    }
    //themeList.classList.add("hideNav");
    themeList.style.display = "none";
})

var themeButtons = document.querySelectorAll(".themeChoice");
var r = document.querySelector(":root");
for(var i = 0; i < themeButtons.length; i++){
    themeButtons[i].addEventListener("click", function(){
        if(this.value == "Pistachio"){
            r.style.setProperty("--foreground", "rgb(144, 190, 109)");
            r.style.setProperty("--background", "rgb(250, 255, 208)");
            r.style.setProperty("--third", "rgb(248, 255, 184)");
        }
        if(this.value == "Rose"){
            r.style.setProperty("--foreground", "rgb(250, 132, 132)");
            r.style.setProperty("--background", "rgb(255, 243, 226)");
            r.style.setProperty("--third", "rgb(255, 234, 234)");
        }
        if(this.value == "Ice"){
            r.style.setProperty("--foreground", "rgb(113, 201, 206)");
            r.style.setProperty("--background", "rgb(236, 255, 255)");
            r.style.setProperty("--third", "rgb(255, 255, 255)");
        }
        if(this.value == "Aqua"){
            r.style.setProperty("--foreground", "rgb(109, 187, 225)");
            r.style.setProperty("--background", "rgb(7, 0, 106)");
            r.style.setProperty("--third", "rgb(13, 65, 113)");
        }
    }, false);
}

var offset = [0,0];
var mouseIsDown = false;
var mouseWasDown = false;
var mouseDownWidgetId = 0;
for(var i = 0; i < toggleButtons.length; i++){
    toggleButtons[i].addEventListener('mousedown', function(e) {moveWidget(e, this)}, true);
}

function moveWidget(e, t){
    mouseIsDown = true;
    mouseDownWidgetId = parseInt(t.parentElement.getAttribute("data-widget-id"));
    offset = [
        widgetContainers[mouseDownWidgetId].offsetLeft - e.clientX,
        widgetContainers[mouseDownWidgetId].offsetTop - e.clientY
    ];
}

document.addEventListener('mouseup', function() {
    mouseIsDown = false;
}, true);
widgetContainers = document.querySelectorAll(".widgetContainer");
document.addEventListener('mousemove', function(e) {
    mouseWasDown = true;
    if (mouseIsDown) {
        widgetContainers[mouseDownWidgetId].style.left = (e.clientX + offset[0]) + 'px';
        widgetContainers[mouseDownWidgetId].style.top  = (e.clientY + offset[1]) + 'px';
    }
}, true);

//show/hide widget list
var addWidgetButton = document.querySelector("#addWidgetButton");
addWidgetButton.addEventListener("click", function(){
    var widgetList = document.querySelector("#widgetList");
    if(widgetList.classList.contains("hideNav")){
        widgetList.classList.remove("hideNav");
    }
    widgetList.style.display = "";
}, false)

var addWidgetContainer = document.querySelector("#addWidgetContainer");
addWidgetContainer.addEventListener("mouseleave", function(){
    var widgetList = document.querySelector("#widgetList");
    if(widgetList.classList.contains("showNav")){
        widgetList.classList.remove("showNav");
    }
    widgetList.style.display = "none";
})

var removeWidgetButton = document.querySelector("#removeWidgetButton");
removeWidgetButton.addEventListener("click", function(){
    var widgetContainers = document.querySelectorAll(".widgetContainer");
    var removeWidgetList = document.querySelector("#removeWidgetList");
    var nums = [0, 0, 0];
    for(var i = 0; i < widgetContainers.length; i++){
        if(widgetContainers[i].classList.contains("deleted"))continue;
        if(widgetContainers[i].classList.contains("taskWidget")){
            var button = document.createElement("input");
            nums[0]++;
            button.value = "To-Do List #" + nums[0];
            button.classList.add("removeWidgetChoice");
            button.type = "button";
            button.setAttribute("data-linked-widget", widgetContainers[i].getAttribute("data-widget-id"));
            button.addEventListener("mouseover", function(){removeButtonHoverHighlight(this);});
            button.addEventListener("mouseleave", function(){removeButtonUnHover(this);});
            button.addEventListener("click", function(){removeButtonRemove(this);});
            removeWidgetList.appendChild(button);
            removeWidgetList.appendChild(document.createElement("br"));
        }
        if(widgetContainers[i].classList.contains("notesWidget")){
            var button = document.createElement("input");
            nums[1]++;
            button.value = "Notes #" + nums[1];
            button.classList.add("removeWidgetChoice");
            button.type = "button";
            button.setAttribute("data-linked-widget", widgetContainers[i].getAttribute("data-widget-id"));
            button.addEventListener("mouseover", function(){removeButtonHoverHighlight(this);});
            button.addEventListener("mouseleave", function(){removeButtonUnHover(this);});
            button.addEventListener("click", function(){removeButtonRemove(this);});
            removeWidgetList.appendChild(button);
            removeWidgetList.appendChild(document.createElement("br"));
        }
        if(widgetContainers[i].classList.contains("timerWidget")){
            var button = document.createElement("input");
            nums[2]++;
            button.value = "Timer #" + nums[2];
            button.classList.add("removeWidgetChoice");
            button.type = "button";
            button.setAttribute("data-linked-widget", widgetContainers[i].getAttribute("data-widget-id"));
            button.addEventListener("mouseover", function(){removeButtonHoverHighlight(this);});
            button.addEventListener("mouseleave", function(){removeButtonUnHover(this);});
            button.addEventListener("click", function(){removeButtonRemove(this);});
            removeWidgetList.appendChild(button);
            removeWidgetList.appendChild(document.createElement("br"));
        }
    }
    if(removeWidgetList.classList.contains("hideNav")){
        removeWidgetList.classList.remove("hideNav");
    }
    removeWidgetList.style.display = "";
    //console.log(removeWidgetList);
})
var removeWidgetContainer = document.querySelector("#removeWidgetContainer");
removeWidgetContainer.addEventListener("mouseleave", function(){
    var removeWidgetList = document.querySelector("#removeWidgetList");
    if(removeWidgetList.classList.contains("showNav")){
        removeWidgetList.classList.remove("showNav");
    }
    removeWidgetList.style.display = "none";
    removeWidgetList.innerHTML = "";
})

function removeButtonHoverHighlight(t){
    var widgetID = t.getAttribute("data-linked-widget");
    var widgetContainers = document.querySelectorAll(".widgetContainer");
    for(var i = 0; i < widgetContainers.length; i++){
        if(widgetContainers[i].getAttribute("data-widget-id") == widgetID){
            widgetContainers[i].style.border = "5px solid var(--foreground)";
        }
    }
}

function removeButtonUnHover(t){
    var widgetID = t.getAttribute("data-linked-widget");
    var widgetContainers = document.querySelectorAll(".widgetContainer");
    for(var i = 0; i < widgetContainers.length; i++){
        if(widgetContainers[i].getAttribute("data-widget-id") == widgetID){
            widgetContainers[i].style.border = "5px solid rgba(0, 0, 0, 0)";
        }
    }
}

function removeButtonRemove(t){
    var widgetID = t.getAttribute("data-linked-widget");
    var widgetContainers = document.querySelectorAll(".widgetContainer");
    for(var i = 0; i < widgetContainers.length; i++){
        if(widgetContainers[i].getAttribute("data-widget-id") == widgetID){
            widgetContainers[i].innerHTML = "";
            widgetContainers[i].style.border = "5px solid rgba(0, 0, 0, 0)";
            widgetContainers[i].classList.add("deleted");
            t.style.display = "none";
            t.style.maxHeight = "0px";
            t.nextElementSibling.style.display = "none";
        }
    }
}

var widgetButtons = document.querySelectorAll(".widgetChoice");
for(var i = 0; i < widgetButtons.length; i++){
    widgetButtons[i].addEventListener("click", function(){
        if(this.value == "To-Do List"){
            addListWidget();
        }
        if(this.value == "Notes"){
            addNoteWidget();
        }
        if(this.value == "Timer"){
            addTimerWidget();
        }
    }, false);
}

function addListWidget(){
    const widgetContainer = document.createElement("div");
    widgetContainer.classList.add("widgetContainer");
    widgetContainer.classList.add("taskWidget");
    widgetContainer.setAttribute("data-widget-id", document.querySelectorAll(".widgetContainer").length);
    const toggleButton = document.createElement("input");
    toggleButton.type = "button";
    toggleButton.classList.add("toggleButton");
    toggleButton.value = "-";
    toggleButton.addEventListener('mousedown', function(e) {moveWidget(e, this)}, true);
    toggleButton.addEventListener("click", function(){toggleWidgetVisibility(this)}, false);
    widgetContainer.appendChild(toggleButton);
    const taskListContainer = document.createElement("div");
    taskListContainer.classList.add("taskListContainer");
    taskListContainer.classList.add("widgetBodyContainer");
    const addTaskButton = document.createElement("input");
    addTaskButton.type = "button";
    addTaskButton.classList.add("taskButton");
    addTaskButton.classList.add("addTask");
    addTaskButton.value = "Add";
    addTaskButton.addEventListener("click", function(){addTask('New Task', this)}, false);
    const removeTaskButton = document.createElement("input");
    removeTaskButton.type = "button";
    removeTaskButton.classList.add("taskButton");
    removeTaskButton.classList.add("removeTask");
    removeTaskButton.value = "Remove";
    removeTaskButton.addEventListener("click", function(){removeTask(this)}, false);
    const taskList = document.createElement("div");
    taskList.classList.add("taskList");
    taskListContainer.appendChild(addTaskButton);
    taskListContainer.appendChild(removeTaskButton);
    taskListContainer.appendChild(taskList);
    widgetContainer.appendChild(taskListContainer);
    var node = document.body.appendChild(widgetContainer);
    widgetContainers = document.querySelectorAll(".widgetContainer");
    new Sortable(taskList, {
        animation: 300, group: "shared"
    });
    return node;
}

function addNoteWidget(){
    const widgetContainer = document.createElement("div");
    widgetContainer.classList.add("widgetContainer");
    widgetContainer.classList.add("notesWidget");
    widgetContainer.setAttribute("data-widget-id", document.querySelectorAll(".widgetContainer").length);
    const toggleButton = document.createElement("input");
    toggleButton.type = "button";
    toggleButton.classList.add("toggleButton");
    toggleButton.value = "-";
    toggleButton.addEventListener('mousedown', function(e) {moveWidget(e, this)}, true);
    toggleButton.addEventListener("click", function(){toggleWidgetVisibility(this)}, false);
    widgetContainer.appendChild(toggleButton);
    const notesContainer = document.createElement("div");
    notesContainer.classList.add("notesContainer");
    notesContainer.classList.add("widgetBodyContainer");
    const notes = document.createElement("div");
    notes.classList.add("notes");
    const textarea = document.createElement("textarea");
    textarea.classList.add("noteBox");
    textarea.setAttribute("rows", "5");
    textarea.innerHTML = "New Note";
    notes.appendChild(textarea);
    notesContainer.appendChild(notes);
    widgetContainer.appendChild(notesContainer);
    var node = document.body.appendChild(widgetContainer);
    widgetContainers = document.querySelectorAll(".widgetContainer");
    return node;
}

function addTimerWidget(){
    const widgetContainer = document.createElement("div");
    widgetContainer.classList.add("widgetContainer");
    widgetContainer.classList.add("timerWidget");
    widgetContainer.setAttribute("data-widget-id", document.querySelectorAll(".widgetContainer").length);
    const toggleButton = document.createElement("input");
    toggleButton.type = "button";
    toggleButton.classList.add("toggleButton");
    toggleButton.value = "-";
    toggleButton.addEventListener('mousedown', function(e) {moveWidget(e, this)}, true);
    toggleButton.addEventListener("click", function(){toggleWidgetVisibility(this)}, false);
    widgetContainer.appendChild(toggleButton);
    const timerContainer = document.createElement("div");
    timerContainer.classList.add("widgetBodyContainer");
    timerContainer.classList.add("timerContainer");
    const timer = document.createElement("input");
    timer.type = "text";
    timer.classList.add("timer");
    timer.setAttribute("data-original-time", "10");
    timer.setAttribute("data-current-time", "10");
    timer.setAttribute("data-state", "play");
    timer.setAttribute("readonly", "");
    timer.value = formatTimeLeft("10");
    const resetButton = document.createElement("input");
    resetButton.type = "button";
    resetButton.classList.add("resetButton");
    resetButton.classList.add("timerButton");
    resetButton.value = "Reset";
    const playPauseButton = document.createElement("input");
    playPauseButton.type = "button";
    playPauseButton.classList.add("playPauseButton");
    playPauseButton.classList.add("timerButton");
    playPauseButton.value = "Pause";
    const setButton = document.createElement("input");
    setButton.type = "button";
    setButton.classList.add("setButton");
    setButton.classList.add("timerButton");
    setButton.value = "Set";

    resetButton.addEventListener("click", function(){resetFunction(this);}, false);
    playPauseButton.addEventListener("click", function(){playPauseFunction(this);}, false);
    setButton.addEventListener("click", function(){setFunction(this);}, false);

    timerContainer.appendChild(timer);
    timerContainer.appendChild(resetButton);
    timerContainer.appendChild(playPauseButton);
    timerContainer.appendChild(setButton);
    widgetContainer.appendChild(timerContainer);
    var node = document.body.appendChild(widgetContainer);
    widgetContainers = document.querySelectorAll(".widgetContainer");
    return node;
    /*body.innerHTML += "\n";
    body.innerHTML += `<div class = \"widgetContainer timerWidget\" data-widget-id = \"${widget_id}\">\
                            <input type= \"button\" class = \"toggleButton\" value = \"-\">\
                            <div class = \"timerContainer widgetBodyContainer\">\
                                <input type = \"text\" class = \"timer\" data-original-time=\"10\" data-current-time = \"10\" data-state = \"play\" readonly\
                                ><input type=\"button\" class = \"resetButton timerButton\" value = \"Reset\"\
                                ><input type=\"button\" class = \"playPauseButton timerButton\" value = \"Pause\"\
                                ><input type=\"button\" class = \"setButton timerButton\" value = \"Set\">\
                            </div>\
                        </div>`;
    console.log("all good!");
    widgetContainers = document.querySelectorAll(".widgetContainer");*/
    
    /*<div class = "widgetContainer timerWidget" data-widget-id = "0">
            <input type="button" class = "toggleButton" value = "-">
            <div class = "timerContainer widgetBodyContainer">
                <input type = "text" class = "timer" data-original-time="10" data-current-time = "10" data-state = "play" readonly
                ><input type="button" class = "resetButton timerButton" value = "Reset"
                ><input type="button" class = "playPauseButton timerButton" value = "Pause"
                ><input type="button" class = "setButton timerButton" value = "Set">
            </div>
        </div>*/
}

/*<div class = "widgetContainer notesWidget" data-widget-id = "0">
    <input type="button" class = "toggleButton" value = "-">
    <div class = "notesContainer widgetBodyContainer">
        <div class = "notes">
            <textarea class = "noteBox" rows="5">New Note</textarea>
        </div>
    </div>
</div>*/

//save button
var saveButton = document.querySelector("#saveButton");
saveButton.addEventListener("click", function(){savePage()}, false);

var timers = document.querySelectorAll(".timer");
for(var i = 0; i < timers.length; i++){
    var timeLeft = timers[i].getAttribute("data-current-time");
    timers[i].value = formatTimeLeft(timeLeft);
}

setInterval(function(){
    var timers = document.querySelectorAll(".timer");
    for(var i = 0; i < timers.length; i++){
        //console.log(timers[i]);
        var timeLeft = timers[i].getAttribute("data-current-time");
        if(timers[i].getAttribute("data-state") == "play"){
            if(timeLeft == 1){
                const audio = new Audio("onlymp3.to - Classic Alarm Clock - Sound Effect for Editing-8_EQneRq52c-256k-1654113109170-[AudioTrimmer.com].mp3");
                audio.play();
            }
            if(timeLeft > 0)timeLeft -= 1;
            timers[i].value = formatTimeLeft(timeLeft);
            timers[i].setAttribute("data-current-time", timeLeft);
        }
    }
}, 1000);

function formatTimeLeft(time) {
    // The largest round integer less than or equal to the result of time divided being by 60.
    const minutes = Math.floor(time / 60);
    
    // Seconds are the remainder of the time divided by 60 (modulus operator)
    let seconds = time % 60;
    
    // If the value of seconds is less than 10, then display seconds with a leading zero
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
  
    // The output in MM:SS format
    return `${minutes}:${seconds}`;
}


var resetButtons = document.querySelectorAll(".resetButton");
for(var i = 0; i < resetButtons.length; i++){
    resetButtons[i].addEventListener("click", function(){
        resetFunction(this);
    }, false);  
}

function resetFunction(t){
    timer = t.parentElement.querySelector(".timer");
    timeLeft = timer.getAttribute("data-original-time");
    timer.setAttribute("data-current-time", timeLeft);
    timer.value = formatTimeLeft(timeLeft);
}

var playPauseButtons = document.querySelectorAll(".playPauseButton");
for(var i = 0; i < playPauseButtons.length; i++){
    playPauseButtons[i].addEventListener("click", function(){
        playPauseFunction(this);
    }, false);  
}

function playPauseFunction(t){
    timer = t.parentElement.querySelector(".timer");
    if(timer.getAttribute("data-state") == "play"){
        t.parentElement.querySelector(".timer").setAttribute("data-state", "pause");
        t.value = "Play";
        timer.removeAttribute("readonly");
    }
    else if(timer.getAttribute("data-state") != "play"){
        t.parentElement.querySelector(".timer").setAttribute("data-state", "play");
        t.value = "Pause";
        timer.setAttribute("readonly", "");
    }
}

var setButtons = document.querySelectorAll(".setButton");
for(var i = 0; i < setButtons.length; i++){
    setButtons[i].addEventListener("click", function(){
        setFunction(this);
    }, false);
}

function setFunction(t){
    timer = t.parentElement.querySelector(".timer");
    if(timer.getAttribute("data-state") != "play"){
        if(timer.value.split(":").length - 1 == 1){
            //console.log("a");
            var min = parseInt(timer.value.split(":")[0]);
            var sec = parseInt(timer.value.split(":")[1]);
            var timeLeft = min*60 + sec;
            timer.setAttribute("data-original-time", timeLeft);
            timer.setAttribute("data-current-time", timeLeft);
        }
    }
}
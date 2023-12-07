

//var idk =  require("../node_modules/finderjs");
//import {message} from '../node_modules/@tauri-apps/api/dialog.cjs';

// These will be left for now for testing
let greetInputEl;
let greetMsgEl;
let MAIN = document.getElementsByClassName("tree-head")[0];
let currPath;

// here will be functions we will invoke once listenes are setup 

// open path in terminal
async function openInTerminal(directory) {
  invoke("open_in_terminal", {dir: directory}).then(response => console.log(response));
  //onsole.log(returnMsg);
  if (returnMsg === false) {
      await message(("Path doesn't exit!"));
  } 
}

// Ask user to choose directory and returns its value, make sure to check return value in case user cancels
async function chooseDir() {
  // open box to choose folder
  const selected = await open({
    directory: true,
    defaultPath: await appDir(),
    });
  //console.log(selected);
  return selected;
}

// functiont o get path tree from backend
async function getPathTree(directory) {
  // call rust backend to get tree object
  const tree = await invoke("get_path_tree", {dir: directory});
  // debugging

  // return tree
  return tree;
}

// function to pass directory to backend
async function createNewDir(directory){
  const returnMsg = await invoke("create_new_dir", {dir: directory});
  if (returnMsg === false) {
    await message(("Parent directories do not exist"));
  }
}

// function to rename file or folder
async function renameDirOrFile(from, to){
  const returnMsg = await invoke("rename_dir_or_file", {from: from, to: to});
  console.log(returnMsg);
  if (returnMsg === false){
    await message(("File or directory do not exist"));
  }
}

// 
async function moveToTrashAtDir(directory){
  const returnMsg = await invoke("move_to_trash_at_dir", {dir: directory});
  
  console.log(returnMsg);
  if (returnMsg === false){
    await message(("File or directory do not exist"));
  }

}

// const HEAD_PATH = "/home";
//  currPath = HEAD_PATH;




// async function getChildren(entry, pathName, pathSize){

//     var child = document.createElement("div");
//     child.className= "child-check";
    
//     var check = document.createElement("input");
//     check.type = "checkbox";
//     check.id = "id1";
//     child.appendChild(check);
//     var pathNameC = document.createElement("label")
//     pathNameC.textContent = pathName + "/"+ entry.name;
//     pathNameC.className = "label-path";
//     child.appendChild(pathNameC);
//     var name = document.createElement("label");
//     name.className="info";
//     name.textContent=entry.name;
//     child.appendChild(name);
    
//     var pathSize = document.createElement("label");
//     pathSize.className = "info2";
//     var sizePerc = entry.size/pathSize;
//     pathSize.textContent = entry.size.toString() + entry.unit;
//     child.appendChild(pathSize);
//     if (entry.entries.length != 0 ){
//       for (const c of entry.entries){
//         child.appendChild(await getChildren(c, pathNameC.textContent, pathSize.textContent));
//     }
//     }
    
//     //console.log(child);
//     if(sizePerc>0.8){
//       pathSize.style.color="red";
//     }else if (sizePerc > 0.6){
//       pathSize.style.color="orange";
//     }else if (sizePerc > 0.4){
//       pathSize.style.color="yellow";
//     }else if (sizePerc > 0.2){
//       pathSize.style.color="greenyellow";
//     } else{
//       pathSize.style.color="green";
//     }
//     return child
// }
 
async function generateTree(){
  let Tree = await getPathTree(currPath);
  console.log(Tree);
  for (const path of Tree.entries){
      var pathName = document.createElement("label");
      pathName.className="label-path";
      pathName.textContent = Tree.name + "/"+ path.name;
      var parentNode = document.createElement("div");
      parentNode.className = "parent-check";
      var check = document.createElement("input");
      check.type = "checkbox";
      check.id="id1";
      var name = document.createElement("label");
      name.className="info";
      name.textContent=path.name;
      parentNode.appendChild(check);
      parentNode.appendChild(pathName);
      parentNode.appendChild(name);
      var pathSize = document.createElement("label");
      pathSize.textContent = path.size.toString() + path.unit;
      parentNode.appendChild(pathSize);
      for (const child of path.entries){
            var c = await getChildren(child, pathName.textContent, pathSize.textContent);
            if ( c != 0){
              parentNode.append(c);
            }
        }
        MAIN.appendChild(parentNode);
    }
    console.log(MAIN);
    var checks = document.querySelectorAll("input[type=checkbox]");
console.log("checks");
console.log(checks);
for(var i = 0; i < checks.length; i++){
  checks[i].addEventListener( 'change', function(event) {
    if(this.checked) {
     //console.log(event.target.parentNode);
     //currPath = event.target.getChildren()[2].textContent;
      var p = event.target.parentNode.children[1].innerText;
      currPath = p;
        console.log(currPath);
       showChildrenChecks(this);
    } else {
       hideChildrenChecks(this)
    }
  });
}

function showChildrenChecks(elm) {
   var pN = elm.parentNode;
   var childCheks = pN.children;
   
  for(var i = 0; i < childCheks.length; i++){
      if(hasClass(childCheks[i], 'child-check')){
	      childCheks[i].classList.add("active");      
      }
  }
   
}

function hideChildrenChecks(elm) {
   var pN = elm.parentNode;
   var childCheks = pN.children;
   
  for(var i = 0; i < childCheks.length; i++){
      if(hasClass(childCheks[i], 'child-check')){
	      childCheks[i].classList.remove("active");      
      }
  }
   
}

function hasClass(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}
    
}







// async function greet() {
//   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
//   console.log(greetInputEl.value);
//   greetMsgEl.textContent = await invoke("greet", { dir: greetInputEl.value });
// }
// //  this function invokes invokes the function that sends struct from rust to js and prints it to console
// async function send(){
//     var x = await invoke("send", {dir: greetInputEl.value});
//     console.log(x);
// }







async function loadSelectedDir(){
  currPath = await chooseDir();
  while (MAIN.firstChild) MAIN.removeChild(MAIN.firstChild);
  generateTree();
}


async function Create(){
  //currPath = await chooseDir();
  let newDir = prompt("Please Provide the Directory Name: ");
  
  
  createNewDir(currPath+"/"+newDir);
}

async function Rename(){
  //currPath = await chooseDir();
  console.log(currPath);
  let newName = prompt("Please Provide the new Name: ");
  
  
  renameDirOrFile(currPath , newName);
}


async function oTerm(){
  //currPath = await chooseDir();
  
  openInTerminal(currPath);
}


window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document
    .querySelector("#greet-button")
    .addEventListener("click", () => {
      while (MAIN.firstChild) MAIN.removeChild(MAIN.firstChild);
      currPath = greetInputEl.value;
      //console.log(greetInputEl.value);
      
      generateTree()});

    document
    .querySelector("#delete")
    .addEventListener("click", () => {moveToTrashAtDir(currPath)});

    document
    .querySelector("#searchDir")
    .addEventListener("click", loadSelectedDir);

    document
    .querySelector("#cD")
    .addEventListener("click", Create);

    document
    .querySelector("#rename")
    .addEventListener("click", Rename);

    document
    .querySelector("#term")
    .addEventListener("click", oTerm);
});

window.addEventListener("click", (event) =>{
  if(event.target.className === "tree-head" ){
    
    var children = event.target.children;
    console.log(event.target.children);
    console.log(children.length);
    for (var i = 0; i < children.length; i++) {
      children[i].style.display="flex";
      // Do stuff
    }
    //children.style.display="inthline";
  } else if (event.target.className ==="dir"){
      var children = event.target.children

  }
  
});
export {openInTerminal}
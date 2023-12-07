import logo from './logo.svg';
import imageBack from './ephoto.webp';
import PieGraph from './PieGraph';
//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BarChart from './BarChart';
//import {get} from './backend';
import { invoke, path } from "@tauri-apps/api";

import ColumnChart from './ColumnChart';
import SunburstChart from './SunBurstChart';


//We need to import API's and send it as props to the specific components to display the right stuff. 

import React, { useState } from 'react';
import './App.css';


//var idk =  require("../node_modules/finderjs");
//import {message} from '../node_modules/@tauri-apps/api/dialog.cjs';

// These will be left for now for testing


function App() {
  

  const [leaves,setLeaves] =useState({});
  const [pathOfDir,setPathOfDir]  =  useState(""); //get currentpath
  const [statusOfButton,setStatusOfSelect]=useState(false);
  async function openInTerminal(directory) {
    console.log(typeof directory);
    var returnMsg = await invoke("open_in_terminal", {dir:directory});
    console.log("finally uya");
    console.log(returnMsg);
    if (returnMsg === false) {
        await message(("Path doesn't exit!"));
    } 
  }

  function foo (){
    console.log('Hello')
    return <SunburstChart />;
  }
  async function chooseDir() {
    // open box to choose folder
    const selected = await open({
      directory: true,
      defaultPath: await appDir(),
      });
    //console.log(selected);
    return selected;
  }
  async function getPathTree(directory) {
    // call rust backend to get tree object
    const tree = await invoke("get_path_tree", {dir: directory});
    // debugging
  
    // return tree
   
    return tree;
  }
  async function createNewDir(directory){
    console.log("fakhreldi ");
    const returnMsg = await invoke("create_new_dir", {dir: directory});
    console.log(directory, " ahmed samy");
    if (returnMsg === false) {
      await message(("Parent directories do not exist"));
    }
  }
  async function renameDirOrFile(from, to){
    const returnMsg = await invoke("rename_dir_or_file", {from: from, to: to});
    console.log(returnMsg);
    if (returnMsg === false){
      await message(("File or directory do not exist"));
    }
  }
  
async function moveToTrashAtDir(directory){
  const returnMsg = await invoke("move_to_trash_at_dir", {dir: directory});
  
  console.log(returnMsg);
  if (returnMsg === false){
    await message(("File or directory do not exist"));
  }

}

async function getChildren(entry, pathName, pathSize){

  var child = document.createElement("div");
  child.className= "child-check";
  
  var check = document.createElement("input");
  check.type = "checkbox";
  check.id = "id1";
  child.appendChild(check);
  var pathNameC = document.createElement("label")
  pathNameC.textContent = pathName + "/"+ entry.name;
  pathNameC.className = "label-path";
  child.appendChild(pathNameC);
  var name = document.createElement("label");
  name.className="info";
  name.textContent=entry.name;
  child.appendChild(name);
  
  var pathSize = document.createElement("label");
  pathSize.className = "info2";
  var sizePerc = entry.size/pathSize;
  pathSize.textContent = entry.size.toString() + entry.unit;
  child.appendChild(pathSize);
  if (entry.entries.length != 0 ){
    for (const c of entry.entries){
      child.appendChild(await getChildren(c, pathNameC.textContent, pathSize.textContent));
  }
  }
  
  //console.log(child);
  if(sizePerc>0.8){
    pathSize.style.color="red";
  }else if (sizePerc > 0.6){
    pathSize.style.color="orange";
  }else if (sizePerc > 0.4){
    pathSize.style.color="yellow";
  }else if (sizePerc > 0.2){
    pathSize.style.color="greenyellow";
  } else{
    pathSize.style.color="green";
  }
  return child
}

async function getDataForGraphs(directory){
  let currPath=directory;
  let Tree=await getPathTree(currPath);
  //console.log(Tree);
  //console.log(Tree);
    let dataNames=[];
    let dataValues=[];
    for( const path of Tree){
      dataNames.push(path.name);
      dataValues.push(path.value);
    }
  
  return {dataNames,dataValues};
}
async function generateTree(directory){
  let currPath = directory;
  let Tree = await getPathTree(currPath); //TREE here will have the matrix of matrixies of info entries
  console.log(Tree);
  
  //console.log("yooooo");
  for (const path of Tree.entries){

      //console.log("ABDELAZIZZZZZZZZZZZ");
      console.log(path.size2);
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
        //MAIN.appendChild(parentNode);
    }
    //console.log(MAIN);
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
  const statusSelector=( ) =>{
    setStatusOfSelect(!statusOfButton);
  }
  const [showGraph, setShowGraph] = useState(false);
  const [showGraph2, setShowGraph2] = useState(false);
  const [showGraph3, setShowGraph3] = useState(false);
  const [showGraph4, setShowGraph4] = useState(false);
  const toggleGraph = () => {
    
    setShowGraph(!showGraph);
    setShowGraph2(false);
    setShowGraph3(false);
    setShowGraph4(false);
  };
  const toggleGraph2 = () => {
    setShowGraph2(!showGraph2);
    setShowGraph(false); setShowGraph3(false);
    setShowGraph4(false);
  };

  const toggleGraph3 = () => {
    setShowGraph3(!showGraph3);
    setShowGraph(false);
    setShowGraph2(false);
    setShowGraph4(false);
  };
  const toggleGraph4 = () => {
    setShowGraph4(!showGraph4);
    setShowGraph(false);
    setShowGraph2(false);
    setShowGraph3(false);
  }

  function whichGraph() { //removed async 
      //getDataForGraphs(pathOfDir);
      //[ali,samy,nice]
      //[10,20,30]
      if (showGraph) {
        
        return <PieGraph tree= {} />
      }
      else if (showGraph2) {
        return <BarChart />;
      }
      else if (showGraph3) {
        return <ColumnChart />;
      }
      else if (showGraph4) {
        return <SunburstChart />;
      }
      else {
  
      }
    
    // getDataForGraphs()
    
  }

  //console.log(pathOfDir);
  return (


    <div class="bg-customBackground h-screen" >

      <div class="bg-customBackground ">
        <div class="top-bar pt-3">

          <button id="delete" type="button" className='bg-customBackground3 hover:bg-opacity-30 rounded-lg p-2 pl-3 pr-3 ml-2 mr-2 text-white' onClick={()=>getDataForGraphs(pathOfDir)}>Delete Directory</button>
          <button id="rename  " type="button" className='bg-customBackground3 hover:bg-opacity-30 rounded-lg p-2 pl-3 pr-3 ml-2 mr-2 text-white' onClick={()=>renameDirOrFile(pathOfDir,"/home/ali2/theRENAMEWORKS")}>Rename Directory</button>
          <button id="term" type="button" className='bg-customBackground3 hover:bg-opacity-30 rounded-lg p-2 ml-2 pl-3 pr-3  mr-2 text-white' onClick={()=>openInTerminal(pathOfDir)}>Open Terminal in Directory</button>
          <button id="cD" type="button" className='bg-customBackground3 hover:bg-opacity-30 rounded-lg p-2 ml-2  pl-3 pr-3 mr-2 text-white' onClick={()=> createNewDir(pathOfDir)}> Create Directory</button>
          <button id="pieB" type="button" className='bg-customBackground3 hover:bg-opacity-30 rounded-lg p-2 pl-3 pr-3  ml-2 mr-2 text-white' onClick={toggleGraph}>Pie Chart</button>
          <button id="barB" type="button" className='bg-customBackground3 hover:bg-opacity-30 rounded-lg p-2 pl-3 pr-3  ml-2 mr-2 text-white' onClick={toggleGraph2}>Bar Chart</button>
          <button id="columnB" type="button" className='bg-customBackground3 hover:bg-opacity-30 rounded-lg  pl-3 pr-3 p-2 ml-2 mr-2 text-white' onClick={toggleGraph3}>Column Chart</button>
          <button id="sunB" type="button" className='bg-customBackground3 hover:bg-opacity-30 rounded-lg pl-3 pr-3 p-2 ml-2 mr-2 text-white' onClick={toggleGraph4}>Sun Burst Chart</button>
          <div id="sort_list ">
            <form id="Form" action="/action_page.php" class="flex justify-center mt-3 rounded-lg ">
              <label id="sort" for="sorts" class="text-white mr-2" >Sort:    </label>
              <select name="sorts" id="SORTS" className='bg-customBackground2 text-white p-1  pl-4 pr-4 hover:bg-opacity-50 hover:cursor-pointer border-2 border-borderColour'  >
                <optgroup label="Size" >
                  <option value="Ascendingly ">Ascendingly</option>
                  <option value="Descendingly">Descendingly</option>
                </optgroup>
                <optgroup label="Alphabetically">
                  <option value="A->Z">AZ</option>
                  <option value="Z->A">ZA</option>
                </optgroup>
                <optgroup label="Number of files">
                  <option value="Ascendingly">Ascendingly</option>
                  <option value="Descendingly">Descendingly</option>
                </optgroup>
              </select>
            </form>
          </div>
        </div>

        <div class="container">

          <div class="files">
            <div class="row">
              <div className="flex justify-center items-center ml-64 mt-10">
                <input id="greet-input" placeholder="Enter a path..." className='bg-customBackground2 text-white p-1  pl-4 pr-4 hover:bg-opacity-50 hover:cursor-pointer border-2 border-borderColour' value={pathOfDir} onChange={e=>setPathOfDir(e.target.value) }/>
                <button id="greet-button" type="button" className='bg-customBackground3 hover:bg-opacity-40 rounded-lg p-1 ml-2 mr-2 text-white' >Search</button>
                <button id="searchDir" type="button" className='bg-customBackground3 hover:bg-opacity-40 rounded-lg p-1 ml-2 mr-2 text-white' onClick={statusSelector}>Select Directory</button>
              </div>
            </div>
            <button class="tree-head bt" >
            </button>
          </div>
          <div className="w-screen h-screen">
            {whichGraph()}
          </div>
        </div>


      </div>




    </div>







  );
}

export default App;

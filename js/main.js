var siteName = document.getElementById("siteName");
var siteUrl = document.getElementById("siteUrl");
var submitBtn = document.getElementById("submitBtn");
var updateBtn = document.getElementById("updateBtn");
var searchInput = document.getElementById("search");

var storageKey = "bookmarks";
var bookmarksList = [];
var currentIndex;
var currentId;
var currentBtnIsSubmit = true;

var inputsRegex = {
    siteName : {
        pattern: /^[\w]{3}(.{0,}[\w])?$/,
        status : false
    },
    siteUrl : {
        pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/,
        status : false
    }
}

var formInputs = [siteName,siteUrl];

// * ======================================== [ Start Section ] ==========================================

/*
 - by default the inputs are empty, hence that we need to add the wrong input modal to our submit button
 */
setWrongInputModal(); 

// Run to display the stored bookmarks if available in the local storage

if(localStorage.getItem(storageKey)){
    bookmarksList = getStorage();
    displayBookmarks(bookmarksList);
}


// * ======================================== [ Tools For The Form ] =====================================

function clear(){
    // This function to clear the form inputs after add / update
    siteName.value = null;
    siteUrl.value = null;
}

function validateInputs(element){

     // if the current input element is valid then do the following ...
    if(inputsRegex[element.id].pattern.test(element.value)){


        // Mark the input as valid using is-valid flag
        element.classList.add("is-valid"); 
        element.classList.remove("is-invalid");

        // Update the input validity status 
        inputsRegex[element.id].status = true;
        
        // Remove invalid message, because the input now is valid
        element.nextElementSibling.classList.remove("invalid-feedback");
        element.nextElementSibling.innerHTML = null;

        /*
        Check now if the other inputs status are valid as well,
        If yes then disassociate the error message model from the submit / update button.
        */
        if(allInputsAreValid()){
            removeWrongInputModal();
        }

    }else{ // if input not valid

        // Mark the input as invalid using is-invalid flag
        element.classList.remove("is-valid");
        element.classList.add("is-invalid");

        // Update the input validity status 
        inputsRegex[element.id].status = false;

        // Add invalid message, because the input now is invalid
        element.nextElementSibling.classList.add("invalid-feedback");

        if(element.id == "siteName"){ // based on current input show the error message
            element.nextElementSibling.innerHTML = "Invalid Site Name, the site name should start with 3 of any [ alphabetical or digit character, or underscore ] and end with the same"
        }else{
            element.nextElementSibling.innerHTML = "Invalid URL, the url should follow the standard rules,for example [ https://example.com ]" 
        }

        // Associate the error message model with the submit / update button.
        setWrongInputModal();
    }
}


function validateAllInputs(){
    // Loop on all inputs to check if they are valid
    // This function will be used only in addBookmark() , and saveUpdates() functions
    for (var i = 0; i < formInputs.length; i++) {
        var element = formInputs[i];
        validateInputs(element);
    }
}

function allInputsAreValid(){
    // Check the inputs status and return true if all inputs are valid, otherwise false
    if(inputsRegex.siteName.status && inputsRegex.siteUrl.status){
        return true;
    }else{
        return false;
    }
}

function setWrongInputModal(){
    // var eleBtn = currentBtnIsSubmit ? submitBtn : updateBtn;
    if(currentBtnIsSubmit){
        submitBtn.setAttribute("data-bs-toggle","modal");
        submitBtn.setAttribute("data-bs-target","#wrongInputsModal");
        updateBtn.setAttribute("data-bs-toggle","");
        updateBtn.setAttribute("data-bs-target","");
    }else{
        updateBtn.setAttribute("data-bs-toggle","modal");
        updateBtn.setAttribute("data-bs-target","#wrongInputsModal");
        submitBtn.setAttribute("data-bs-toggle","");
        submitBtn.setAttribute("data-bs-target","");
    }

    // eleBtn.setAttribute("data-bs-toggle","modal");
    // eleBtn.setAttribute("data-bs-target","#wrongInputsModal");
}

function removeWrongInputModal(){
    var eleBtn = currentBtnIsSubmit ? submitBtn : updateBtn;
    eleBtn.setAttribute("data-bs-toggle","");
    eleBtn.setAttribute("data-bs-target","");
}

function getElementIndexById(id){
    // Find the index of the element in the list by id
    var index;
    for (var i = 0; i < bookmarksList.length; i++) {
        if(bookmarksList[i].id == id){
            index = i;
        }
    }
    return index;
}

function resetFormValidation(){
    // reset the form inputs validation flags & messages after submittion / update
    for (let i = 0; i < formInputs.length; i++) {
        formInputs[i].nextElementSibling.innerHTML=null;
        formInputs[i].classList.remove("is-valid");
        formInputs[i].classList.remove("is-invalid");
    }


}

function resetInputvalidationStatus(){   
    inputsRegex.siteName.status = false;
    inputsRegex.siteUrl.status = false;
}

function enableSubmitBtn(){
    currentBtnIsSubmit = true;
    updateBtn.classList.add("d-none");
    updateBtn.classList.remove("d-inline-block");
    submitBtn.classList.add("d-inline-block");
    submitBtn.classList.remove("d-none");
}

function enableUpdateBtn(){
    currentBtnIsSubmit = false;
    updateBtn.classList.remove("d-none");
    updateBtn.classList.add("d-inline-block");
    submitBtn.classList.remove("d-inline-block");
    submitBtn.classList.add("d-none");
}

// * ======================================== [ CRUD Operations ] ==========================================

function addBookmark(){


    // Before save validate all inputs & update thier status
    validateAllInputs();
    
    // If the inputs status are not true then don't update the record!!
    if(!allInputsAreValid()){
        return;
    }

    var siteObj = {
        id: bookmarksList.length,
        name : siteName.value, 
        url: siteUrl.value
    };

    bookmarksList.push(siteObj);

    clear(); // clear the form inputs
    resetFormValidation(); // reset validation messages and flags [ valid - invalid ]
    resetInputvalidationStatus(); // reset input validation status
    setStorage(bookmarksList); // update the storage
    displayBookmarks(bookmarksList); // display the records
    setWrongInputModal(); // because now the inputs are empty 
}

function displayBookmarks(list){

    console.log("The list : ", list)
    var htmlBox = ``;

    // for (var i = 0; i < list.length; i++) {
    //     htmlBox += `
    //     <tr class="text-center">
    //           <td>${i+1}</td>
    //           <td>${(list[i].searchName ? list[i].searchName : list[i].name)}</td>
    //           <td>
    //             <a class="btn btn-visit text-white" href="${list[i].url}" target="_blank"> <i class="fa-solid fa-eye"></i> Visit</a>
    //           </td>
    //           <td>
    //             <button onclick="prepareForUpdate(${list[i].id})" class="btn btn-update text-white"><i class="fa-solid fa-pen-to-square"></i> Update</button>
    //           </td>
    //           <td>
    //             <button onclick="deleteBookmark(${list[i].id})" class="btn btn-danger"><i class="fa-solid fa-trash-can"></i> Delete</button>
    //           </td>
    //         </tr>`;
    // }

    for (var i = 0; i < list.length; i++) {
        htmlBox += `
        <tr>
              <th row-header="Index" scope="row">${i+1}</th>
              <td row-header="Website Name">${(list[i].searchName ? list[i].searchName : list[i].name)}</td>
              <td row-header="Visit">
                <a class="btn btn-visit text-white" href="${list[i].url}" target="_blank"> <i class="fa-solid fa-eye"></i> Visit</a>
              </td>
              <td row-header="Update">
                <button onclick="prepareForUpdate(${list[i].id})" class="btn btn-update text-white"><i class="fa-solid fa-pen-to-square"></i> Update</button>
              </td>
              <td row-header="Delete">
                <button onclick="deleteBookmark(${list[i].id})" class="btn btn-danger"><i class="fa-solid fa-trash-can"></i> Delete</button>
              </td>
        </tr>`;
    }

    document.getElementById("table_data").innerHTML = htmlBox;
}

function prepareForUpdate(id){

    // Get the index of the record
    var index;
    index = getElementIndexById(id);
    
    // set the form values from record data 
    siteName.value = bookmarksList[index].name;
    siteUrl.value = bookmarksList[index].url;

    currentIndex = index; // this index is very important for saveUpdates() function
    currentId = id; // this index is very important for saveUpdates() function

    resetFormValidation();// reset validation messages and flags [ valid - invalid ]

    // Data retrieved from local storage already valid...
    inputsRegex.siteName.status = true;
    inputsRegex.siteUrl.status = true;

    removeWrongInputModal(); // remove the modal from submit btn  [ currentbtn is submit ]
    enableUpdateBtn();// Enable update btn and hide submit btn. & update the currentbtn to updateBtn
    removeWrongInputModal(); // remove the modal from update btn, because by default the stored data is valid until the user start typing [ currentbtn is update ]
}

function saveUpdates(){
    
    // Before save validate all inputs & update thier status
    validateAllInputs();
    
    // If the inputs status are not true then don't update the record!!
    if(!allInputsAreValid()){
        return;
    }


    // Check if user deleted the item during the update process [ Handle Unexpected User Behavior ]
    var indexOfRecord =  getElementIndexById(currentId);

    if(indexOfRecord == undefined){
        alert("Your are trying to update deleted item, going to abort this process");
        clear();
        resetFormValidation();
        resetInputvalidationStatus();
        enableSubmitBtn(); // Enable submit btn and hide update btn [ currentbtn is submit ]
        setWrongInputModal(); // enable the modal on submit btn, because now the inputs are empty 
        return;
    }

    // If the inputs are valid, then update the record data
    bookmarksList[currentIndex].name = siteName.value;
    bookmarksList[currentIndex].url = siteUrl.value;

    clear(); // clear the form inputs
    resetFormValidation(); // reset validation messages and flags [ valid - invalid ]
    resetInputvalidationStatus(); // reset input validation status
    setStorage(bookmarksList); // update local storage
    displayBookmarks(bookmarksList); // display the records

     
    enableSubmitBtn(); // Enable submit btn and hide update btn [ currentbtn is submit ]
    setWrongInputModal(); // enable the modal on submit btn, because now the inputs are empty 
}

function deleteBookmark(id){
    // Get the index of the record
    var index;
    index = getElementIndexById(id);
    bookmarksList.splice(index,1);
    setStorage(bookmarksList);
    displayBookmarks(bookmarksList);
}

function search(keyword){

    var searchResult = [];
    var keywordInLower = keyword.toLowerCase();

    for (var i = 0; i < bookmarksList.length; i++) {
        
        var bookmarkName = bookmarksList[i].name;
        var bookmarkNameInLower= bookmarkName.toLowerCase();

        if(bookmarkNameInLower.includes(keywordInLower)){
            var indexOfKeyword = bookmarkNameInLower.indexOf(keywordInLower);
            var searchedTxt = bookmarkName.substring(indexOfKeyword,indexOfKeyword+keywordInLower.length);
            var coloredTxt = `<span class="text-danger">${searchedTxt}</span>`;
            bookmarksList[i].searchName = bookmarkName.replace(searchedTxt,coloredTxt);
            searchResult.push(bookmarksList[i]);
        }
    }
    
    displayBookmarks(searchResult);

}

//* ============================ [ Setup Local Storage ]======================================

function setStorage(list){
    localStorage.setItem(storageKey,JSON.stringify(list));
}

function getStorage(){
    var items =  localStorage.getItem(storageKey);
    return JSON.parse(items);
}


//* ============================ [ Setup Events ]======================================

siteName.addEventListener("keyup",function(ele){
        validateInputs(ele.target);
})

siteUrl.addEventListener("keyup",function(ele){
    validateInputs(ele.target);
})

// on change for copy and past actions ....
siteName.addEventListener("change",function(ele){
    validateInputs(ele.target);
})

siteUrl.addEventListener("change",function(ele){
    validateInputs(ele.target);
})

submitBtn.addEventListener("click",addBookmark)
updateBtn.addEventListener("click",saveUpdates)


searchInput.addEventListener("keyup",function(ele){ // When user search for something ....
    search(ele.target.value);
})

searchInput.addEventListener("search",function(ele){ // when search clear by clicking on X    
    if(ele.target.value == ''){
        search(ele.target.value);
    }
})
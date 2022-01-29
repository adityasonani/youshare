const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browsebtn = document.querySelector(".browsebtn");
const bgProgress = document.querySelector(".bg-progress");
const progressContainer = document.querySelector(".progress-container");
const fileUrl = document.querySelector("#fileUrl");
const sharingContainer = document.querySelector(".sharing-container");
const copyLink = document.querySelector(".copy-link");
const toast = document.querySelector(".toast");

const host = "https://youshare.herokuapp.com/";
const uploadUrl = host + "api/files";

const MAX_ALLOWED_SIZE = 100 * 1024 * 1024; //100MB

dropZone.addEventListener("dragover", (e)=>{
    e.preventDefault();
    // console.log("dragged");
    dropZone.classList.add("dragged");
});

dropZone.addEventListener("dragleave", (e)=>{
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e)=>{
    e.preventDefault();
    const files = e.dataTransfer.files;
    // console.log(files);
    if (files.length === 1) {
        if (files[0].size < MAX_ALLOWED_SIZE) {
            fileInput.files = files;
            uploadFile();
        } else {
            showToast("Max file size is 100MB!");
        }
    } else if (files.length > 1) {
        showToast("Please upload 1 file at a time!");
    }
    dropZone.classList.remove("dragged");
}); 

fileInput.addEventListener("change", ()=>{
    if (fileInput.files[0].size < MAX_ALLOWED_SIZE) {
        uploadFile();
    } else {
        showToast("Max file size is 100MB!");
        fileInput.value = "";
    }
});

browsebtn.addEventListener("click", ()=>{
    fileInput.click();
});

copyLink.addEventListener("click", ()=>{
    fileUrl.select(); 
    document.execCommand("copy");
    showToast("Copied To Clipboard");
});

fileUrl.addEventListener("click", () => {
    fileUrl.select();
});


const uploadFile = ()=>{
    const file = fileInput.files;
    
    const formData = new FormData();
    formData.append("myfile", file[0]);
    
    progressContainer.style.display = "block";

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = function (event) {
        let percent = Math.round((100 * event.loaded) / event.total);
        bgProgress.style.width = `${percent}%`;
    }

    xhr.upload.onerror = function () {
        showToast(`Error in upload: ${xhr.status}`);
        fileInput.value = "";
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            onFileUploadSuccess(xhr.responseText);
        }
    };
    /*
    xhr.upload.onprogress = updateProgress;

    xhr.upload.onerror = ()=>{
        fileInput.value = "";
        showToast(`Error in upload: ${xhr.statusText}`);
    };
    */

    xhr.open("POST", uploadUrl);
    xhr.send(formData);

};

const onFileUploadSuccess = (res) => {
    fileInput.value = "";
    progressContainer.style.display = "none";

    const {file : url} = JSON.parse(res);
    console.log(url);
    sharingContainer.style.display = "block";
    fileUrl.value = url;
    bgProgress.style.width = `0%`;
}

const updateProgress = (e) => {
    const percent = Math.round((e.loaded / e.total) * 100);
    bgProgress.style.width = `${percent}%`;
    // console.log(percent);
};


const showLink = ({file})=>{
    // console.log(file);
    sharingContainer.style.display = "block";
    fileUrl.value = file;
    progressContainer.style.display = "none";
};

let toastTime;
const showToast = (msg)=>{
    clearTimeout(toastTime);
    toast.innerText = msg;
    // toast.classList.add("show");
    toast.style.transform = "translate(-50%, 0)";
    toastTime = setTimeout(()=>{
        toast.style.transform = "translate(-50%, 60px)";
        // toast.classList.remove("show");
    }, 2000);
};

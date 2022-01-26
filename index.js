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
    console.log("dragged");
});

dropZone.addEventListener("drop", (e)=>{
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log(files);
    if (files.length) {
        fileInput.files = files;
        uploadFile();
    }
}); 

fileInput.addEventListener("change", ()=>{
    uploadFile();
});

browsebtn.addEventListener("click", ()=>{
    fileInput.click();
});

copyLink.addEventListener("click", ()=>{
    fileUrl.select(); 
    document.execCommand("copy");
    showToast("Copied To Clipboard");
});

const uploadFile = ()=>{
    if (fileInput.files.length > 1) {
        fileInput.value = "";
        showToast("Please upload 1 file at a time.");
        return;
    }
    const file = fileInput.files[0];
    
    if (file.size > MAX_ALLOWED_SIZE) {
        showToast("Please upload files less than 100MB size");
        fileInput.value = "";
        return;
    }
    
    progressContainer.style.display = "block";
    const formData = new FormData();
    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log(xhr.response);
            showLink(JSON.parse(xhr.response));
        }
    };

    xhr.upload.onprogress = updateProgress;

    xhr.upload.onerror = ()=>{
        fileInput.value = "";
        showToast(`Error in upload: ${xhr.statusText}`);
    };

    xhr.open("POST", uploadUrl);
    xhr.send(formData);

};

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
    toast.innerText = msg;
    toast.style.transform = "translate(-50%, 0)";
    clearTimeout(toastTime);
    toastTime = setTimeout(()=>{
        toast.style.transform = "translate(-50%, 60px)";
    }, 2000);
};
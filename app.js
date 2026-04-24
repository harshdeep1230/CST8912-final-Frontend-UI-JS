// Ensure these are only declared ONCE
const LIST_FILE_API_URL = "https://secure-file-api-12711.azurewebsites.net/api/list-files";
const UPLOAD_API_URL = "https://secure-file-api-12711.azurewebsites.net/api/UploadTrigger"; 

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileList = document.getElementById('fileList');
    const refreshBtn = document.getElementById('refreshBtn');
    const uploadLoading = document.getElementById('uploadLoading');
    const uploadMessage = document.getElementById('uploadMessage');
    const downloadLoading = document.getElementById('downloadLoading');

    // 1. TAB NAVIGATION
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab + 'Tab').classList.add('active');
            if(btn.dataset.tab === 'download') loadFileList();
        };
    });

    // 2. FILE SELECTION
    if(browseBtn) browseBtn.onclick = () => fileInput.click();
    
    fileInput.onchange = () => {
        const file = fileInput.files[0];
        if (file) {
            document.getElementById('fileName').innerText = file.name;
            document.getElementById('fileSize').innerText = (file.size / 1024).toFixed(2) + " KB";
            document.getElementById('fileInfo').style.display = "block";
            uploadBtn.disabled = false;
        }
    };

    // 3. UPLOAD LOGIC (POST)
    uploadBtn.onclick = async () => {
        const file = fileInput.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            uploadBtn.disabled = true;
            if(uploadLoading) uploadLoading.style.display = "block";
            uploadMessage.innerHTML = "Uploading...";

            const response = await fetch(UPLOAD_API_URL, { method: 'POST', body: formData });

            if (response.ok) {
                uploadMessage.className = "message success";
                uploadMessage.innerHTML = "✅ Upload Successful!";
                fileInput.value = "";
                document.getElementById('fileInfo').style.display = "none";
            } else {
                uploadMessage.className = "message error";
                uploadMessage.innerHTML = "❌ Upload Failed.";
            }
        } catch (err) {
            uploadMessage.innerHTML = "❌ CORS/Network Error.";
        } finally {
            uploadBtn.disabled = false;
            if(uploadLoading) uploadLoading.style.display = "none";
        }
    };

    // 4. LIST LOGIC (Matches your screenshot JSON)
    async function loadFileList() {
        if(downloadLoading) downloadLoading.style.display = "block";
        
        try {
            const res = await fetch(LIST_FILE_API_URL);
            const data = await res.json();
            const filesArray = data.files || []; // Matches {"files": [...]}
            
            fileList.innerHTML = filesArray.length ? "" : "No files found.";
            
            filesArray.forEach(file => {
                const item = document.createElement('div');
                item.className = 'file-item';
                item.innerHTML = `
                    <div class="file-info-details">
                        <div class="file-name">${file.filename}</div>
                        <div class="file-meta"><span class="file-size">${file.size} bytes</span></div>
                    </div>
                    <a href="${file.downloadUrl}" class="download-link" target="_blank">Download</a>
                `;
                fileList.appendChild(item);
            });
        } catch (err) {
            fileList.innerHTML = "Error loading files.";
        } finally {
            if(downloadLoading) downloadLoading.style.display = "none";
        }
    }

    if (refreshBtn) refreshBtn.onclick = loadFileList;
});
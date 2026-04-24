# CST8912 Final Project: Frontend Logic & API Integration

This repository contains the JavaScript logic for the CST8912 Final Group Project.

##  Key Features Implemented

* **Dynamic Tab Navigation:** Managed DOM manipulation to switch between Upload and Download views without page reloads.
* **Asynchronous File Uploads:** Developed logic to handle binary file data using `FormData` and `POST` requests to the Azure `UploadTrigger`.


The logic connects to the following endpoints deployed on Azure:

| Function | Method | Endpoint |
| :--- | :--- | :--- |
| **List Files** | `GET` | `/api/list-files` |
| **Upload File** | `POST` | `/api/UploadTrigger` |
| **Download** | `GET` | `/api/download?filename={name}` |

##  Technical Stack

* **Vanilla JavaScript (ES6+):** Utilized `fetch`, `async/await`, and DOM Event Listeners.
* **Azure Integration:** Configured to handle Blob Storage SAS tokens provided by the backend for secure downloads.
* **Error Handling:** Integrated robust try-catch blocks to manage CORS issues and network latencies.

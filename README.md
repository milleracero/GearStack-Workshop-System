# 🏎️ GearStack - Workshop Management System

GearStack is a full-stack application designed for automotive workshops. It allows **Mechanics** to manage vehicle interventions and **Clients** to track their car's repair history in real-time through a "Virtual Garage".



## 📋 Project Structure

This repository is organized as a **monorepo**:
* **/server**: Node.js + Express API (Backend).
* **/client**: React + Vite application (Frontend).

---

## 🚀 Installation and Execution

### 1. Prerequisites
* **Node.js** installed on your machine.
* **MariaDB/MySQL** database running locally.

### 2. Backend Setup (`/server`)
1.  **Open a terminal** and navigate to the folder:
    ```bash
    cd server
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the server**:
    * To use development mode (with auto-reload):
        ```bash
        npm run dev
        ```
    * *Note: The server runs on `http://localhost:3000`*.

### 3. Frontend Setup (`/client`)
1.  **Open a NEW terminal** (do not close the server terminal) and navigate to:
    ```bash
    cd client
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the dashboard**:
    ```bash
    npm run dev
    ```
    * *Note: The application will open at `http://localhost:5173`*.

---

## 🛠️ Key Commands Summary

| Action | Directory | Command |
| :--- | :--- | :--- |
| **Start Backend** | `/server` | `npm run dev` |
| **Start Frontend** | `/client` | `npm run dev` |
| **Install Dependencies** | Both | `npm install` |

---

## 🔑 Demo Access (Credentials)
* **Mechanic Role**: `mecanicien@gear.com` / `123456`.
* **Client Role**: `jean.dupont@email.com` / `123456`.

---

## 🛠️ Key Features
* **Mechanic Dashboard**: Search vehicles by license plate, register new cars, and update repair status (In Progress/Completed).
* **Client Dashboard**: View owned vehicles and detailed maintenance history including technical notes and costs.
* **Real-time Synchronization**: Status changes made by the mechanic are immediately visible to the car owner.
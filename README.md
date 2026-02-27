# GearStack - Workshop Management System

**GearStack** is a full-stack application designed for automotive workshops. It allows **Mechanics** to manage vehicle interventions and **Clients** to track their car's repair history in real-time through a "Virtual Garage".

## Tech Stack
* **Backend**: Node.js & Express.
* **ORM**: **Sequelize** (Object-Relational Mapping).
* **Database**: **MariaDB**.
* **Frontend**: React (Vite), **Tailwind CSS** (v4), and **daisyUI** (Component Library).

---

## Requirements
Before running the project, ensure you have the following installed:
* **Node.js** (v16 or higher recommended).
* **MariaDB** (Database server).

---

## Project Structure
This repository is organized as a **monorepo**:
* **/server**: Node.js + Express API + **Sequelize Models**.
* **/client**: React + Vite application.

---

## Installation and Execution

### 1. Database Configuration
1. Ensure your **MariaDB** server is running.
2. Create a database named `gearmanager` (or the name specified in your `.env`).
3. The tables will be automatically synchronized by **Sequelize** upon server startup.

### 2. Backend Setup (`/server`)
1. **Open a terminal** and navigate to the folder:

   ```bash
   cd server
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the server**:

   ```bash
   npm start
   ```
   > *Note: The server runs on `http://localhost:3000`.*

### 3. Frontend Setup (`/client`)
1. **Open a NEW terminal** and navigate to:

   ```bash
   cd client
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the dashboard**:

   ```bash
   npm run dev
   ```
   > *Note: The application will open at `http://localhost:5173`.*

---

## Key Commands Summary

| Action | Directory | Command |
| :--- | :--- | :--- |
| **Start Backend** | `/server` | `npm start` |
| **Start Frontend** | `/client` | `npm run dev` |
| **Install Dependencies** | Both | `npm install` |

---

## Demo Access (Credentials)
* **Mechanic Role**: `mecanicien@gear.com` / `123456`
* **Client Role**: `jean.dupont@email.com` / `123456`

---

## Key Features
* **Mechanic Dashboard**: Search vehicles by license plate, assign repairs to cars, and manage repair statuses (open or mark as completed).
* **Client Dashboard**: Register owned vehicles, check their real-time status, and view detailed maintenance history.
* **Security**: Role-Based Access Control (RBAC) and password hashing with Bcrypt.
* **Modern UI**: Fully responsive and themed interface built with **Tailwind CSS** and **daisyUI**.

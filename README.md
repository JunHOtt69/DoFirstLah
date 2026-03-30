# DoFirstLah
DoFirstLah is a full-stack web application developed as an assignment for the Responsive Web Design and Development (RWDD) module at Asia Pacific University (APU). The project’s name is inspired by the Malaysian slang for "just do it first," reflecting its core mission: encouraging users to act on their tasks without overthinking.

## 🚀 Installation & Setup Guide

Follow these steps to set up and run the **DoFirstLah** project locally on your machine.

### 1. Prerequisites
Ensure you have the following installed:
* [XAMPP](https://www.apachefriends.org/index.html) (Apache, MySQL, PHP)
* [Git](https://git-scm.com/)

---

### 2. Clone the Repository
Open your terminal or command prompt, navigate to your XAMPP `htdocs` directory, and clone the project:

```bash
cd C:\xampp\htdocs
git clone [https://github.com/JunHOtt69/DoFirstLah.git](https://github.com/JunHOtt69/DoFirstLah.git)
```

---

### 3. Start XAMPP Services
1. Open the XAMPP Control Panel.

2. Click Start next to Apache.

3. Click Start next to MySQL.

---

### 4. Database Configuration

1. In your web browser, go to: http://localhost/phpmyadmin/.

2. Click the New button on the left sidebar to create a new database.

3. Name the database dofirstlah and click Create.

4. Select the newly created database and click the Import tab at the top.

5. Click Choose File and navigate to:

```bash
C:\xampp\htdocs\DoFirstLah\Database\dofirstlah.sql 
```

6. Scroll to the bottom and click Import.

---

### 5. Access the Application
Once the database is imported, you can launch the application by visiting the URL below in your browser:

👉 http://localhost/DoFirstLah/1-landing_page.php

![DoFirstLah Landing Page](/images/landing_page.png)

## 📸 Application Preview

### 1. Authentication & Personal Space
Login Page
The entry point of the application featuring a clean, responsive design with "Remember Me" and password recovery options to ensure a smooth user experience.
![Login Preview](/images/login_preview.png)

User Dashboard
A personalized command center where users can manage their individual schedule via a dynamic calendar, track daily events, and check active reminders.
![User Dashboard Preview](/images/user_dashboard_preview.png)

---

2. Workspace Management
My Hustle
The project hub where users can view all ongoing individual and group projects, or instantly create and join new ones using invite codes.
![My Hustle Preview](/images/myHustle_preview.png)

Project Summary
A comprehensive overview of a specific project, displaying real-time task analytics, workload distribution among members, and overall goal progress.
![Project Summary Preview](/images/project_summary_preview.png)

---

3. Team & Task Operations
Project Members
A dedicated management interface to view involved members, handle pending invitations, and assign specific roles like Team Leader or Project Manager.
![Project Member Preview](/images/project_member_preview.png)

Project Tasks
The primary kanban-style board categorized by "Haven't Touch Yet," "On The Way," and "Settled" to track task progression visually.Task Detail Dialog
An interactive pop-up for deep-diving into specific tasks, allowing for subtask management, priority setting, file submissions, and activity history tracking.
![Project Tasks Preview](/images/project_tasks_preview.png)

---

4. Advanced Visualization
Project Gantt Chart
A high-level timeline view that allows team members to visualize project schedules and dynamically adjust task durations and deadlines.
![User Dashboard Preview](/images/project_gannt_chart_preview.png)

Project Attachments
A centralized repository for all project-related final work, organized by task with integrated preview and download capabilities.
![User Dashboard Preview](/images/project_attachments_preview.png)

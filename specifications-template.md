# **Full-Stack MERN Final Project Specification Document**

## **1. Project Overview**

-   **Project Name:** ERP
-   **Short Description:** _(Briefly describe what your project does)_  
    A comprehensive ERP system designed to help small and large companies manage their operations efficiently. The system includes modules for HR, logistics, marketing, finance, and more, with features like employee management, inventory tracking, payroll processing, and real-time analytics

## **2. Group Members**

(Maximum 3 students)

| Name   | Email                     | GitHub Profile |
| ------ | ------------------------- | -------------- |
| raid   | raid.mefti@hotmail.com    | Raid-Mefti     |
| mhamed | hamoudat1990@gmail.com    | xdloolmdr      |
| raouf  | raoufmeziane02@hgmail.com | meziane02      |

## **3. Selected Theme**

_(Choose one by marking an "X")_

-   [ ] **Task Management Application**
-   [ ] **E-Commerce Website**
-   [ ] **Real-time Chat Application**
-   [ ] **Book Recommendation App**
-   [x] **MERN Application**

## **4. Solution description**

### 4.1 Service (RH):

#### problem:

Manual Employee Data Management
Poor Attendance Tracking
Limited Reporting and Analytics

#### proposed solution :

Centralized Employee Database
Digital Attendance Tracking
Payroll Management

### 4.2 Service (Logistique)

#### problem:

gestion de stock (visibility)
communication (email, messaging, etc)
facturation
reducing the paper work

#### proposed solution :

stock management : make the product informations readable for all the workers
facturation : transfer from papers to database
communication : make the teamwork easier through faster and easier communication

### 4.3 Service (Marketing / commercial)

#### problems :

bad preparation for events
difficulty to publish new ads
connaître l'état du marché (pour le service commercial)
facturation (previously discussed in logistics)

#### proposed solution :

Calendar to better track the date and planning for events
Displaying statistics for the targets of our ads
Displaying statistics about the market

### 4.4 Service (Finance / comptabilité)

#### problems :

employee attendance
calculating different salaries, augmentations, primes, déduction de salaire...
calcul des revenus annuels, G30 et G50

#### proposed solution :

pointeur à l'entrée pour tous les employés pour tracker leur présence et l'heure de leur arrivée au quotidien
API pour automatiser la calculation des salaires en prenant en compte leurs absences, retards, heures supplémentaires... etc
collection spéciale dans la base de donnée pour tous les frais de la société

#### problems :

## **5. Features & Functionalities**

_(List all the key features your project will include)_

### **Frontend Features**

-   Landing page with a login screen
-   display overall data of the company(graphs)
-   Tabs: Separate tabs for each module (e.g., HR, Finance, Logistics) to organize functionalities.
-   animated windows
-   Calendar: A tool for scheduling events, tracking deadlines, and managing tasks
-   different themes
-   display separated data for each service:(RH,IT,FINANCE,MARKETING,COMMERCIAL,JURIDIQUE,LOGISTIQUE)
-   messaging interface

### **Backend Features**

-   CRUD for most services.

-   Separated access to own service secured by role.

-   Separated cards for each member.

-   Messaging system.

### **Additional Features (if any)**

_(E.g., payment integration, real-time notifications, third-party APIs, etc.)_

-   Role-Based Access Control (RBAC): Restrict access to modules based on user roles (e.g., admin, manager, employee).

## **5. Technologies Used**

_(List the primary technologies you will use in your project)_

-   **Frontend:** REACT, typescript
-   **Backend:** express, mongoose, cors
-   **Database:** mongoDB
-   **Additional Libraries/Tools:** tailwind, shadcn

## **6. Project Milestones & Timeline**

_(Outline your estimated timeline for completing each major part of the project)_

| Milestone                                                                                  | Expected Completion Date |
| ------------------------------------------------------------------------------------------ | ------------------------ |
| Project Setup : development environment, install dependencies, initialize the database     | 2 DAYS (01/03 ~ 03/03 )  |
| Frontend Development : Build the user interface, including the dashboard, tabs, and charts | 3 WEEK                   |
| Backend Development : Develop APIs for HR, logistics, finance, and other modules           | 3 WEEKS                  |
| Integration & Testing : perform unit and integration testing                               | 4 DAYS                   |
| Final Deployment                                                                           | 2 DAYS (30/03 ~ 31/03)   |

## **7. Additional Notes**

_(Any extra information about the project)_

-   We aim to deliver a fully functional ERP system with a modern and intuitive user interface. Our focus is on scalability, security, and ease of use

# M-Haderech

Welcome to the **M-Haderech** repository! This README provides detailed instructions on how to set up, deploy, and use the project.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)
- [Usage Instructions](#usage-instructions)
- [License](#license)
- [Examples](#examples)

## Project Overview

**M-Haderech** is a platform that provides essential information and support for those affected by Hyperemesis Gravidarum (HG). Our mission is to offer comprehensive resources in Hebrew, empowering individuals with knowledge and support through the challenging journey of HG. This project aims to raise awareness, support affected individuals, and provide a robust questionnaire tool in Hebrew.

What is Hyperemesis Gravidarum?
Hyperemesis Gravidarum (HG) is a severe form of nausea and vomiting during pregnancy that can lead to significant dehydration, weight loss, and electrolyte imbalance. Unlike typical morning sickness, HG can be debilitating, impacting a woman's ability to carry out daily activities and significantly affecting her quality of life.

### Our Mission
M-Haderech is a nonprofit organization committed to:

* Raising Awareness: Providing accurate and up-to-date information about HG in Hebrew.
* Supporting Affected Individuals: Offering a support system through educational resources and community connections.
* Empowering Through Knowledge: Ensuring that individuals understand the symptoms, potential treatments, and coping mechanisms for HG.
Resources We Offer
* Educational Content: Comprehensive articles and guides about HG, its symptoms, treatments, and ways to manage the condition.
* HELP Questionnaire: The Hyperemesis Gravidarum Impact of Symptoms (HGIS) questionnaire, available in Hebrew, allows individuals to assess the severity of their symptoms and the impact on their daily lives. This tool helps in understanding the condition better and communicating with healthcare providers.
* Support Network: Connection to support groups and communities where individuals can share experiences, seek advice, and find comfort among others who understand their journey.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Firebase Firestore**: A flexible, scalable database for mobile, web, and server development.
- **Firebase Authentication**: For user authentication and authorization.
- **React Router**: For handling routing in the React application.
- **Dnd-kit**: For drag-and-drop functionality.
- **Chart.js**: For data visualization.
- **React-icons**: For icons.
- **emailjs**: For sending emails from the client side.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed the latest version of Node.js and npm.
- You have a Firebase account and have set up a Firebase project.
- You have the necessary Firebase configuration details (API key, Auth domain, Project ID, etc.).

## Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/m-haderech.git
   cd m-haderech

2. **Install dependencies:**
   ```sh
   npm install

3. **Set up Firebase:**
   - Create a `.env` file in the root directory.
   - Add your Firebase configuration details to the `.env` file:
     ```plaintext
     REACT_APP_FIREBASE_API_KEY=your-api-key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
     REACT_APP_FIREBASE_PROJECT_ID=your-project-id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     REACT_APP_FIREBASE_APP_ID=your-app-id
     ```

## Running the Project

  To start the development server, run:
  - npm start
  This will launch the project at http://localhost:3000.


## Deployment

To deploy the project, follow these steps:

1. **Build the project:**
   ```sh
   npm run build

2. **Deploy to Firebase:**
  - Install Firebase CLI if you haven't already: npm install -g firebase-tools
  - Log in to Firebase: firebase login
  - Initialize Firebase in your project directory: firebase init
  - Deploy to Firebase: firebase deploy   


## Usage Instructions

### Navbar

The Navbar component provides navigation links to different sections of the website. It includes:
- Home
- Posts
- About Us
- Conventions
- Questionnaire
- Contact
- Donate

### Posts Section

The Posts Section displays articles with pagination and a search feature. It supports both regular users and admins. Admins can manage content directly from this section.

### Conventions List

Displays a list of conventions filtered from the posts. 

### Questionnaire Management

Admins can manage questionnaires, including adding, editing, and deleting questions and answers. This section includes drag-and-drop functionality for reordering questions.

### User Management

Admins can view a list of users, reset passwords, and toggle admin status.

### Contact Information

Admins can update contact information, add new fields, and delete existing fields.

### Bank Information

Admins can manage bank information details, add new fields, and delete existing fields.

### Analytics Section

Displays statistics about the organization with animated count-up numbers.

### Donation Section

Encourages users to donate, with a link to the donation page.

### Newsletter Link

Provides a link for users to subscribe to the newsletter.

### Sidebar

Admin dashboard sidebar for easy navigation between different admin sections.

### Protected Routes

Certain routes are protected and only accessible to authenticated users or admins.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Examples

![2](https://github.com/user-attachments/assets/9b902dea-78cc-419a-adb2-613c291b5924)
![1](https://github.com/user-attachments/assets/a036636c-75b0-46d2-9928-0c1c9dbf66bc)

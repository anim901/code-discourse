# 💬 StackQ — Ask, Answer, Learn

A modern, full-stack Q&A platform built with **Next.js**, powered by **Appwrite** for backend services, and styled with **Aceternity UI** & **Magic UI**. Inspired by StackOverflow, StackQ allows users to post questions, provide answers, earn reputation, and interact in a meaningful knowledge-sharing community.

---

## 🔧 Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **UI/UX:** Aceternity UI + Magic UI + Tailwind CSS
- **Backend-as-a-Service:** Appwrite (Database, Auth, Storage, Functions)
- **Authentication:** Appwrite OAuth + Email/Password
- **State Management:** Server Actions + React Hooks
- **Deployment:** Vercel / Custom Hosting

---

## ✨ Features

- ✅ **User Authentication**
  - Sign up / Login with Appwrite Auth
  - Email/password + social OAuth providers
- 📝 **Question & Answer System**
  - Post, edit, and delete questions
  - Write and manage answers to others' questions
- 🧠 **User Profiles**
  - View your posted and answered questions
  - Track your contributions and interactions
- 🌟 **Reputation System**
  - Gain or lose points based on community votes
  - Reputation used to unlock new features
- 📱 **Responsive UI**
  - Built with Aceternity UI & Magic UI for seamless experience on all devices
- 🔍 **Search & Tags**
  - Filter and search questions using tags or keywords (if implemented)

---

## 🖼️ Screenshots

<!-- Add actual screenshots if available -->

- Home Page
- Question Detail Page
- Answer Submission
- User Profile
- Login/Register

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/stackq.git
cd stackq
```

### 2. Install Dependencies

````bash
npm install
# or
yarn install

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory of your project and add the following:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_db_id
NEXT_PUBLIC_APPWRITE_COLLECTION_ID=your_questions_collection_id
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id

### 4. Run the Development Server

Start the development server with:

```bash
npm run dev
# or
yarn dev
````

# TripPrep - Trip Planner Application

A full-stack application for creating and managing trip equipment lists with real-time updates.

## Features

- **User Authentication**: Secure sign-up and login with Firebase Authentication
- **Trip Equipment Lists**: Create, view, edit, and delete packing lists for your trips
- **Interactive Checklists**: Track your packing progress with interactive checkboxes
- **Real-time Updates**: See changes to your lists in real-time
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Tech Stack

### Frontend
- React 18 with functional components
- React Router v6 for navigation
- Tailwind CSS for styling
- shadcn/ui component library
- Firebase SDK for authentication and Firestore

### Backend
- Node.js with Express
- Firebase Admin SDK
- Vite for development and production builds

## Setup Instructions

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Firebase account

### Firebase Setup
1. Go to the [Firebase console](https://console.firebase.google.com/) and create a new project
2. In your project's console, click "Add app" and select the Web platform (</>)
3. Go to the "Authentication" section and enable Email/Password authentication
4. In "Firestore Database", create a database and start in test mode
5. Note your Firebase configuration values which will be needed as environment variables:
   - API Key
   - Project ID
   - App ID

### Local Development

1. Clone the repository
```bash
git clone https://github.com/yourusername/trip-planner.git
cd trip-planner

# **Inventory Management App**


## **Overview**

The Inventory Management App is a web application designed to help users manage their inventory efficiently. It allows users to add, remove, search, and view items in their inventory. The app is built with Next.js and Firebase, utilizing React hooks and Material-UI for a modern, responsive user interface.


## **Features**



* **User Authentication**: Secure sign-in and authentication using Firebase.
* **Real-Time Inventory Management**: Add, remove, and update items in your inventory with real-time synchronization using Firebase Firestore.
* **Image Capture**: Capture item images using a webcam for easy identification.
* **Search Functionality**: Quickly search and filter items in the inventory.
* **Responsive Design**: A modern and responsive user interface built with Material-UI.


## **Live Demo**

Check out the live demo[ here](https://inventory-tracker-psi-ruby.vercel.app/).


## **Installation**

To run the app locally, follow these steps:



1. **Clone the repository**: \
    ```
    git clone https://github.com/your-username/inventory-management-app.git
    cd inventory-management-app
    ```


2. **Install dependencies**: \
`npm install`
3. **Set up Firebase**:
    * Create a Firebase project in the Firebase Console.
    * Add a web app to your Firebase project and copy the Firebase config object.

Create a `.env.local` file in the root directory of your project and add your Firebase config: 

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

```



4. **Run the app**: 
`npm run dev`

The app will be available at http://localhost:3000.


## **Usage**


### **Authentication**



* Navigate to the sign-in page and log in with your credentials. If you don't have an account, sign up for a new one.


### **Managing Inventory**



* **Add Item**: Click on the "Add New Item" button to open the modal. Enter the item name and optionally capture an image using the webcam. Click "Add Item" to save it to the inventory.
* **Remove Item**: Click on the remove button (red minus icon) next to the item to decrease its quantity. If the quantity reaches zero, the item is removed from the inventory.
* **Search Item**: Use the search bar to filter items by name.


## **Contributing**

Contributions are welcome! Please follow these steps to contribute:



1. Fork the repository.
2. Create a new branch. 
`git checkout -b feature-branch`
3. Make your changes and commit them. 
`git commit -m "Description of changes"`
4. Push to your forked repository. 
`git push origin feature-branch`
5. Create a pull request to the main repository.


## **License**

This project is licensed under the MIT License.

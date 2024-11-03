// Functions to handle authentication logic
import { auth } from "./config.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { signOut } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { updatePassword } from "firebase/auth";
import { deleteUser } from "firebase/auth";
import { updateEmail } from "firebase/auth";
import { updateProfile } from "firebase/auth";

// Creates user and stores information
export const doCreateUserWithEmailAndPassword = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // New user created successfully
        return userCredential;
    } catch (error) {
        // Error creating new user
        console.error("Error creating new user", error);

        // Output specific error message
        let errorMessage;
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = "This email address is already in use.";
                break;
            case 'auth/weak-password':
                errorMessage = "Password should be at least 6 characters.";
                break;
            case 'auth/invalid-email':
                errorMessage = "Please enter a valid email address.";
                break;
            default:
                errorMessage = "Failed to create user. Please try again.";
                break;
        }
        throw new Error(errorMessage);
    }
};


// Signing in an existiting user
export const doSignInUserWithEmailAndPassword = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Sign in worked
        return userCredential;
    } catch (error) {
        // Error signing in user
        console.error("Error signing in user:", error);

        // Output specific error message
        let errorMessage;
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = "No user found with this email.";
                break;
            case 'auth/wrong-password':
                errorMessage = "Incorrect password. Please try again.";
                break;
            case 'auth/invalid-email':
                errorMessage = "Please enter a valid email address.";
                break;
            default:
                errorMessage = "Failed to sign in. Please try again.";
                break;
        }
        throw new Error(errorMessage); // Re-throw the error with a custom message
    }
};


// User signs in with Google method
export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        // Successfully signed in with Google
        return result;        
    } catch (error) {
        // Google sign in failed
        console.error("Error signing in with Google:", error);
        throw new Error("Failed to sign in with Google. Please try again.");
    }
};

// Signing user out
export const doSignOut = async () => {
    try {
        await signOut(auth);
        console.log("User successfully signed out");
    } catch (error) {
        console.log("Error signing out: " , error);
        throw new Error("Failed to sign out. Please try again");
    }
};


// Password reset for user
export const doPasswordResetEmail = async (email) => {
    try {
        const result = await sendPasswordResetEmail(auth, email);
        alert("Password Reset has been sent. Please check your inbox");
        return result
    } catch (error) {
        console.error(error.message);
    }
};

/* 
    Updates the users password
    User has to be currently logged in
*/
export const doPasswordChange = async (newPassword) => {
    try {
        const user = auth.currentUser;
        if (user) {
            await updatePassword(user, newPassword);
            console.log("Password updated successfully");
        } else {
            throw new Error("User is not currently logged in");
        }
    } catch (error) {
        console.log("Error changing password: ", error.message);
        throw new Error("Error changing password. Please try again");
    }
};

/* 
    Deletes the users password
    User has to be currently logged in
*/
export const doDeleteUser = async () => {
    try {
        const user = auth.currentUser;
        if (user) {
            await deleteUser(user);
            console.log("User deleted successfully");
        } else {
            throw new Error("User is not currently logged in");
        }
    } catch (error) {
        console.error("Error deleting user:", error.message);
        throw new Error("Error deleting user. Please try again");
    }
};

/* 
    Updates the users email
    User has to be currently logged in
*/
export const doUpdateEmail = async (newEmail) => {
    try {
        const user = auth.currentUser;
        if (user) {
            await updateEmail(user, newEmail);
            console.log("Email updated successfully");
        } else {
            throw new Error("User is not currently logged in");
        }
    } catch (error) {
        console.error("Error updating email:", error.message);
        throw new Error("Error updating email. Please try again");
    }
};

/* 
    Updates the users name
    User has to be currently logged in
*/
export const doUpdateName = async (newName) => {
    try {
        const user = auth.currentUser;
        if (user) {
            await updateProfile(user, { displayName: newName });
            console.log("Name updated successfully");
        } else {
            throw new Error("User is not currently logged in");
        }
    } catch (error) {
        console.error("Error updating name:", error.message);
        throw new Error("Error updating name. Please try again");
    }
};

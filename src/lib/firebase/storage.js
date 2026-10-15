import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Imports functions for uploading files and retrieving their download URLs.

import { storage } from "@/src/lib/firebase/clientApp"; // Imports the Firebase Storage instance.

import { updateRestaurantImageReference } from "@/src/lib/firebase/firestore"; // Imports the function that saves the image URL to Firestore.

// Uploads a restaurant image and updates its Firestore document.
export async function updateRestaurantImage(restaurantId, image) { // Defines the public image update function.
  const imageURL = await uploadImage(restaurantId, image); // Uploads the image and retrieves its download URL.
  await updateRestaurantImageReference(restaurantId, imageURL); // Saves the download URL in the restaurant document.
  return imageURL; // Returns the URL so the interface can update.
} // Ends the image update function.

// Uploads an image file to Firebase Cloud Storage.
async function uploadImage(restaurantId, image) { // Defines the internal image upload function.
  if (!restaurantId || !image) { // Checks whether the restaurant ID and image exist.
    throw new Error("A restaurant ID and image are required."); // Reports missing required information.
  } // Ends the input validation.

  const imageRef = ref(storage, `restaurants/${restaurantId}/${Date.now()}-${image.name}`); // Creates a unique Storage path for the image.
  const uploadTask = uploadBytesResumable(imageRef, image); // Starts the resumable upload.

  await new Promise((resolve, reject) => { // Waits until the upload finishes or fails.
    uploadTask.on( // Registers upload state listeners.
      "state_changed", // Listens for upload progress changes.
      () => {}, // Leaves progress reporting unused.
      (error) => reject(error), // Rejects the promise if uploading fails.
      () => resolve() // Resolves the promise when uploading completes.
    ); // Ends the upload listener registration.
  }); // Ends the upload promise.

  return getDownloadURL(uploadTask.snapshot.ref); // Returns the public download URL for the uploaded image.
} // Ends the image upload function.
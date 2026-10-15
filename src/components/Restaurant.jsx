"use client"; // Tells Next.js this component runs in the browser.

// This component displays one individual restaurant.
// It receives data from src/app/restaurant/[id]/page.jsx.

import { React, useState, useEffect, Suspense } from "react"; // Imports React and hooks for state, effects, and loading boundaries.
import dynamic from "next/dynamic"; // Imports Next.js dynamic loading functionality.
import { getRestaurantSnapshotById } from "@/src/lib/firebase/firestore.js"; // Imports the function that listens for restaurant updates.
import { useUser } from "@/src/lib/getUser"; // Imports the hook that retrieves the current user.
import RestaurantDetails from "@/src/components/RestaurantDetails.jsx"; // Imports the component displaying restaurant information.
import { updateRestaurantImage } from "@/src/lib/firebase/storage.js"; // Imports the function that uploads restaurant images.

const ReviewDialog = dynamic(() => import("@/src/components/ReviewDialog.jsx")); // Loads the review dialog dynamically.

export default function Restaurant({ // Defines and exports the Restaurant component.
  id, // Receives the restaurant ID.
  initialRestaurant, // Receives the initial restaurant data.
  initialUserId, // Receives the initial authenticated user ID.
  children, // Receives any nested content.
}) { // Begins the component function.
  const [restaurantDetails, setRestaurantDetails] = useState(initialRestaurant); // Stores the restaurant's current details.
  const [isOpen, setIsOpen] = useState(false); // Tracks whether the review dialog is open.

  // The user ID associates reviews with users and determines whether the review dialog is available.
  const userId = useUser()?.uid || initialUserId; // Gets the current user's ID or falls back to the initial ID.
  const [review, setReview] = useState({ // Creates state for the review being written.
    rating: 0, // Sets the initial rating to zero.
    text: "", // Sets the initial review text to an empty string.
  }); // Ends the initial review state.

  const onChange = (value, name) => { // Defines the function that updates review fields.
    setReview({ ...review, [name]: value }); // Updates the specified field while preserving the other review values.
  }; // Ends the onChange function.

  async function handleRestaurantImage(target) { // Defines the asynchronous restaurant image upload handler.
    const image = target.files ? target.files[0] : null; // Gets the selected file if one exists.
    if (!image) { // Checks whether a file was selected.
      return; // Stops the function when no file is available.
    } // Ends the conditional statement.

    const imageURL = await updateRestaurantImage(id, image); // Uploads the image and retrieves its URL.
    setRestaurantDetails({ ...restaurantDetails, photo: imageURL }); // Updates the restaurant details with the new image URL.
  } // Ends the image upload function.

  const handleClose = () => { // Defines the function used to close and reset the review dialog.
    setIsOpen(false); // Closes the review dialog.
    setReview({ rating: 0, text: "" }); // Resets the review rating and text.
  }; // Ends the handleClose function.

  useEffect(() => { // Sets up a listener for restaurant data changes.
    return getRestaurantSnapshotById(id, (data) => { // Subscribes to updates for the specified restaurant and returns the cleanup function.
      setRestaurantDetails(data); // Updates the restaurant details when Firestore data changes.
    }); // Ends the Firestore subscription call.
  }, [id]); // Re-runs the effect when the restaurant ID changes.

  return ( // Begins rendering the component's JSX.
    <> {/* Groups multiple elements without adding an extra DOM element. */}
      <RestaurantDetails // Renders the restaurant details component.
        restaurant={restaurantDetails} // Passes the current restaurant data.
        userId={userId} // Passes the current user's ID.
        handleRestaurantImage={handleRestaurantImage} // Passes the image upload handler.
        setIsOpen={setIsOpen} // Passes the function that opens or closes the dialog.
        isOpen={isOpen} // Passes the current dialog visibility state.
      > {/* Ends the RestaurantDetails opening tag. */}
        {children} {/* Renders any nested content inside RestaurantDetails. */}
      </RestaurantDetails> {/* Ends the RestaurantDetails component. */}
      {userId && ( // Shows the review dialog only when a user ID is available.
        <Suspense fallback={<p>Loading...</p>}> {/* Displays a loading message while the dialog loads. */}
          <ReviewDialog // Renders the dynamically loaded review dialog.
            isOpen={isOpen} // Passes the dialog visibility state.
            handleClose={handleClose} // Passes the dialog close and reset handler.
            review={review} // Passes the current review information.
            onChange={onChange} // Passes the review update function.
            userId={userId} // Passes the authenticated user's ID.
            id={id} // Passes the restaurant ID.
          /> {/* Ends the ReviewDialog component. */}
        </Suspense> // Ends the Suspense boundary.
      )} {/* Ends the conditional rendering. */}
    </> // Ends the fragment.
  ); // Ends the return statement.
} // Ends the Restaurant component.
"use client"; // Tells Next.js that this component runs on the client.

 // This component handles the review dialog and uses a Next.js Server Action to submit the form.

import { useEffect, useLayoutEffect, useRef } from "react"; // Imports React hooks for managing component behavior.
import RatingPicker from "@/src/components/RatingPicker.jsx"; // Imports the component used to select a restaurant rating.
import { handleReviewFormSubmission } from "@/src/app/actions.js"; // Imports the Server Action that processes the review form.

const ReviewDialog = ({ // Defines the ReviewDialog component and receives its properties.
  isOpen, // Determines whether the dialog should be open.
  handleClose, // Provides the function used to close the dialog.
  review, // Contains the current review information.
  onChange, // Provides the function used to update the review text.
  userId, // Identifies the user submitting the review.
  id, // Identifies the restaurant being reviewed.
}) => { // Begins the component function.
  const dialog = useRef(); // Creates a reference to the HTML dialog element.

  // Opens or closes the dialog when the isOpen property changes.
  useLayoutEffect(() => { // Runs the effect after React updates the DOM.
    if (isOpen) { // Checks whether the dialog should be open.
      dialog.current.showModal(); // Opens the dialog as a modal.
    } else { // Runs when the dialog should be closed.
      dialog.current.close(); // Closes the dialog.
    } // Ends the conditional statement.
  }, [isOpen, dialog]); // Re-runs the effect when isOpen or dialog changes.

  // Handles clicks on the dialog and its backdrop.
  const handleClick = (e) => { // Defines the click event handler.
    if (e.target === dialog.current) { // Checks whether the backdrop itself was clicked.
      handleClose(); // Closes the dialog when the backdrop is clicked.
    } // Ends the conditional statement.
  }; // Ends the click handler function.

  return ( // Returns the dialog's JSX markup.
    <dialog ref={dialog} onMouseDown={handleClick}> {/* Creates the dialog and connects its reference and click handler. */}
      <form // Creates the form used to submit a review.
        action={handleReviewFormSubmission} // Sends the form data to the Server Action.
        onSubmit={() => { // Defines what happens when the form is submitted.
          handleClose(); // Closes the dialog after submission begins.
        }} // Ends the submit handler.
      > {/* Ends the form opening tag. */}
        <header> {/* Creates the dialog header. */}
          <h3>Add your review</h3> {/* Displays the form title. */}
        </header> {/* Ends the header. */}
        <article> {/* Groups the review form fields. */}
          <RatingPicker /> {/* Displays the rating selection component. */}

          <p> {/* Wraps the review text input. */}
            <input // Creates the text input for the review.
              type="text" // Specifies a single-line text input.
              name="text" // Sets the submitted form field name.
              id="review" // Assigns an identifier to the input.
              placeholder="Write your thoughts here" // Displays guidance inside the empty input.
              required // Requires the user to enter review text.
              value={review.text} // Displays the current review text.
              onChange={(e) => onChange(e.target.value, "text")} // Updates the review text when the user types.
            /> {/* Ends the text input. */}
          </p> {/* Ends the paragraph. */}

          <input type="hidden" name="restaurantId" value={id} /> {/* Includes the restaurant ID in the submitted form. */}
          <input type="hidden" name="userId" value={userId} /> {/* Includes the user ID in the submitted form. */}
        </article> {/* Ends the review form fields. */}
        <footer> {/* Creates the dialog footer. */}
          <menu> {/* Groups the dialog buttons. */}
            <button // Creates the cancel button.
              autoFocus // Automatically focuses this button when appropriate.
              type="reset" // Sets the button type to reset.
              onClick={handleClose} // Closes the dialog when clicked.
              className="button--cancel" // Applies the cancel button's CSS class.
            > {/* Ends the button opening tag. */}
              Cancel {/* Displays the cancel button text. */}
            </button> {/* Ends the cancel button. */}
            <button type="submit" value="confirm" className="button--confirm"> {/* Creates the button that submits the review. */}
              Submit {/* Displays the submit button text. */}
            </button> {/* Ends the submit button. */}
          </menu> {/* Ends the button menu. */}
        </footer> {/* Ends the footer. */}
      </form> {/* Ends the form. */}
    </dialog> // Ends the dialog element.
  ); // Ends the return statement.
}; // Ends the ReviewDialog component.

export default ReviewDialog; // Exports the component for use in other files.
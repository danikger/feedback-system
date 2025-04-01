import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { RiLoader5Fill } from "react-icons/ri";
import { HiAnnotation } from "react-icons/hi";

export default function SendFeedbackButton() {
  const [openFeedback, setOpenFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  async function handleSubmitFeedback({ message, source }) {
    const apiUrl = import.meta.env.VITE_API_URL;
    setError(false);

    if (feedback.trim() !== "" && !loading) {
      setLoading(true);

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message, source }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to submit feedback.");
        }

        setOpenFeedback(false);
        setFeedback("");
      } catch (err) {
        setError(true);
        console.error("Feedback submission failed:", err.message);
      } finally {
        setLoading(false);
      }
    }
  }


  return (
    <>
      <button
        onClick={() => setOpenFeedback(true)}
        className="cursor-pointer text-sm text-gray-300 font-semibold flex items-center gap-2"
      >
        <HiAnnotation className="size-4" />
        Send Feedback
      </button>

      <Dialog open={openFeedback} onClose={setOpenFeedback} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-zinc-950/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-zinc-800 px-4 pb-4 pt-4 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="text-center">
                  <DialogTitle as="h3" className="text-base font-semibold text-zinc-200">
                    Submit Feedback
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-zinc-400">
                      Have suggestions, found a bug, or just want to share your thoughts? Let us know!
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex flex-col">
                <label htmlFor="feedback" className="sr-only">Your feedback or issue</label>
                <textarea
                  id="feedback"
                  type="text"
                  placeholder="Type your feedback here..."
                  maxLength={1000}
                  onChange={(e) => setFeedback(e.target.value)}
                  value={feedback}
                  className="bg-zinc-900 h-32 rounded-md w-full text-zinc-200 p-2 resize-y max-h-96 min-h-10" />

                {error && (
                  <span className="text-red-500 text-center mt-3 text-sm">
                    Something went wrong. Please try again.
                  </span>
                )}
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => handleSubmitFeedback({
                    message: feedback,
                    source: "MyApp",
                  })}
                  className="inline-flex cursor-pointer w-full justify-center items-center rounded-md bg-zinc-950 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-900 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-zinc-600 sm:col-start-2"
                >
                  {loading ? <RiLoader5Fill className="size-5 text-zinc-200 animate-spin" /> : "Submit"}
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpenFeedback(false)}
                  className="mt-3 inline-flex cursor-pointer w-full justify-center rounded-md bg-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-zinc-100 sm:col-start-1 sm:mt-0"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}
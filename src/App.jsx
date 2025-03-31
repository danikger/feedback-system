import SendFeedbackButton from './sendFeedbackButton';
import './App.css'

function App() {
  return (
    <>
      <main className="bg-zinc-900 font-display min-h-screen relative size-full flex items-center">
        <div className="w-full max-w-2xl mx-auto px-6 flex flex-col items-center">
          <SendFeedbackButton />
        </div>
      </main>
    </>
  )
}

export default App

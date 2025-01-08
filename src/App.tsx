import { useState } from 'react'
import { remixContent } from './api/claude'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRemix = async () => {
    setIsLoading(true)
    try {
      const remixed = await remixContent(inputText)
      setOutputText(remixed)
    } catch (error) {
      alert('Failed to remix content')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Content Remixer</h1>
        
        <textarea
          className="w-full h-40 p-4 border rounded-lg"
          placeholder="Paste your content here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <button
          onClick={handleRemix}
          disabled={isLoading || !inputText}
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
        >
          {isLoading ? 'Remixing...' : 'Remix Content'}
        </button>

        {outputText && (
          <div className="p-4 bg-white border rounded-lg">
            <h2 className="font-bold mb-2">Remixed Content:</h2>
            <p>{outputText}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

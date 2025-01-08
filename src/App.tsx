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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-2">Content Remixer</h1>
        <p className="text-center text-gray-600 mb-8">Transform your content with AI-powered remixing</p>
        
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <textarea
            className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Paste your content here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <button
            onClick={handleRemix}
            disabled={isLoading || !inputText}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-lg shadow-sm"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Remixing...
              </span>
            ) : 'Remix Content'}
          </button>
        </div>

        {outputText && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Remixed Content:</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{outputText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

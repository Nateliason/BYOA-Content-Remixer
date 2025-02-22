import { useState } from 'react'
import { tweetsFromPost } from './api/claude'
import { saveTweet } from './api/supabase'
import { SavedTweets } from './components/SavedTweets'

function App() {
  const [inputText, setInputText] = useState('')
  const [tweets, setTweets] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editedContent, setEditedContent] = useState('')

  const handleRemix = async () => {
    setIsLoading(true)
    try {
      const remixedTweets = await tweetsFromPost(inputText)
      setTweets(remixedTweets)
    } catch (error) {
      alert('Failed to remix content')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveTweet = async (content: string) => {
    try {
      await saveTweet(content)
      setRefreshKey(prev => prev + 1)
    } catch (error) {
      alert('Failed to save tweet')
    }
  }

  const handleStartEdit = (index: number, content: string) => {
    setEditingIndex(index)
    setEditedContent(content)
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditedContent('')
  }

  const handleSaveEdit = (index: number) => {
    const newTweets = [...tweets]
    newTweets[index] = editedContent
    setTweets(newTweets)
    setEditingIndex(null)
    setEditedContent('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-x-hidden">
      <div className={`max-w-4xl mx-auto space-y-8 transition-transform duration-300 ${isSidebarCollapsed ? 'translate-x-[1.5rem]' : 'translate-x-[-10rem]'}`}>
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-2">Content Remixer</h1>
        <p className="text-center text-gray-600 mb-8">Transform your blog posts into engaging tweets</p>
        
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <textarea
            className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Paste your blog post here..."
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
                Generating Tweets...
              </span>
            ) : 'Generate Tweets'}
          </button>
        </div>

        {tweets.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Generated Tweets:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tweets.map((tweet, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow duration-200"
                >
                  {editingIndex === index ? (
                    <div className="space-y-2">
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(index)}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-800">{tweet}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-gray-500">{280 - tweet.length} characters remaining</span>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleStartEdit(index, tweet)}
                            className="inline-flex items-center p-2 text-gray-700 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
                            title="Edit tweet"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleSaveTweet(tweet)}
                            className="inline-flex items-center p-2 text-emerald-600 hover:text-emerald-700 transition-colors rounded-full hover:bg-emerald-50"
                            title="Save tweet"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank')}
                            className="inline-flex items-center p-2 text-blue-500 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                            title="Post to Twitter"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <SavedTweets 
        onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)} 
        refreshKey={refreshKey}
      />
    </div>
  )
}

export default App

import { useEffect, useState } from 'react'
import { SavedTweet, getSavedTweets, deleteSavedTweet } from '../api/supabase'

export function SavedTweets() {
  const [savedTweets, setSavedTweets] = useState<SavedTweet[]>([])

  useEffect(() => {
    loadSavedTweets()
  }, [])

  const loadSavedTweets = async () => {
    try {
      const tweets = await getSavedTweets()
      setSavedTweets(tweets)
    } catch (error) {
      console.error('Failed to load saved tweets:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteSavedTweet(id)
      setSavedTweets(tweets => tweets.filter(t => t.id !== id))
    } catch (error) {
      console.error('Failed to delete tweet:', error)
    }
  }

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-white shadow-lg p-4 overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Saved Tweets</h2>
      <div className="space-y-4">
        {savedTweets.map((tweet) => (
          <div key={tweet.id} className="p-4 rounded-lg border border-gray-200 bg-white">
            <p className="text-gray-800">{tweet.content}</p>
            <div className="mt-2 flex justify-between items-center">
              <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet.content)}`, '_blank')}
                className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Tweet
              </button>
              <button 
                onClick={() => handleDelete(tweet.id)}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
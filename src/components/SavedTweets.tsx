import { useEffect, useState } from 'react'
import { SavedTweet, getSavedTweets, deleteSavedTweet, updateSavedTweet } from '../api/supabase'

interface SavedTweetsProps {
  onCollapse: (collapsed: boolean) => void;
  refreshKey?: number;
}

export function SavedTweets({ onCollapse, refreshKey }: SavedTweetsProps) {
  const [savedTweets, setSavedTweets] = useState<SavedTweet[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [editingTweet, setEditingTweet] = useState<{ id: number, content: string } | null>(null)

  useEffect(() => {
    loadSavedTweets()
  }, [refreshKey])

  useEffect(() => {
    onCollapse(isCollapsed)
  }, [isCollapsed, onCollapse])

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

  const handleEdit = async (id: number, newContent: string) => {
    try {
      await updateSavedTweet(id, newContent)
      setSavedTweets(tweets => tweets.map(t => 
        t.id === id ? { ...t, content: newContent } : t
      ))
      setEditingTweet(null)
    } catch (error) {
      console.error('Failed to update tweet:', error)
    }
  }

  return (
    <div className={`fixed right-0 top-0 h-screen bg-white shadow-lg transition-transform duration-300 ${isCollapsed ? 'translate-x-[calc(100%-2rem)]' : 'translate-x-0'}`} style={{ width: '20rem' }}>
      <div className="flex items-center relative">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg absolute left-0 z-30 bg-white"
          style={{ boxShadow: isCollapsed ? '-4px 0 8px rgba(0,0,0,0.1)' : 'none' }}
        >
          <svg
            className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-800 p-4 pl-12 relative z-10">Saved Tweets</h2>
      </div>
      
      <div className="relative overflow-hidden">
        {isCollapsed && (
          <div className="absolute inset-0 bg-white z-20" style={{ left: '-2rem', width: 'calc(100% + 2rem)' }} />
        )}
        <div className="relative p-4 space-y-4 overflow-y-auto z-10" style={{ height: 'calc(100vh - 4rem)' }}>
          {savedTweets.map((tweet) => (
            <div key={tweet.id} className="p-4 rounded-lg border border-gray-200 bg-white">
              {editingTweet?.id === tweet.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editingTweet.content}
                    onChange={(e) => setEditingTweet({ ...editingTweet, content: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingTweet(null)}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleEdit(tweet.id, editingTweet.content)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-800">{tweet.content}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{280 - tweet.content.length} characters remaining</span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setEditingTweet({ id: tweet.id, content: tweet.content })}
                        className="inline-flex items-center p-2 text-gray-700 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
                        title="Edit tweet"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet.content)}`, '_blank')}
                        className="inline-flex items-center p-2 text-blue-500 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                        title="Post to Twitter"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(tweet.id)}
                        className="inline-flex items-center p-2 text-red-500 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                        title="Delete tweet"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
    </div>
  )
} 
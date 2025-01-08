const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY

export async function remixContent(content: string) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Please remix the following content in a creative way: ${content}`
        }]
      })
    })
    
    const data = await response.json()
    return data.content[0].text
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to remix content')
  }
} 
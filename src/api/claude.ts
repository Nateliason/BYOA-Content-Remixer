import Anthropic from '@anthropic-ai/sdk';

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY

const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true
});

const tweetFromPostPrompt = `
You are a social media expert and ghostwriter. 

You work for a popular blogger, and your job is to take their blog post and come up with a variety of tweets to share ideas from the post. 

Since you are a ghostwriter, you need to make sure to follow the style, tone, and voice of the blog post as closely as possible.

Remember: Tweets cannot be longer than 280 characters.

Please return at least five tweets. Each tweet must be on its own line and must start with "TWEET:" (this prefix will be removed later).

Do not use any hashtags or emojis.

Here is the blog post: 
`

export async function tweetsFromPost(content: string) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `${tweetFromPostPrompt} ${content}`
      }]
    });
    
    const text = (response.content[0] as { text: string }).text;
    // Split the response by lines, filter for lines starting with "TWEET:", and remove the prefix
    const tweets = text
      .split('\n')
      .filter(line => line.trim().startsWith('TWEET:'))
      .map(tweet => tweet.replace('TWEET:', '').trim());
    
    return tweets;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to remix content');
  }
} 
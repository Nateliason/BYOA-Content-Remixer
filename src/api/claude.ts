import Anthropic from '@anthropic-ai/sdk';

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY

const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function remixContent(content: string) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Please remix the following content in a creative way: ${content}`
      }]
    });
    
    return (response.content[0] as { text: string }).text;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to remix content');
  }
} 
import { openrouterChat, type ORMessage } from '../lib/ai/openrouter';

// Mock fetch globally
global.fetch = jest.fn();

describe('OpenRouter AI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OPENROUTER_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    delete process.env.OPENROUTER_API_KEY;
  });

  test('should make successful API call', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Test response from AI'
          }
        }
      ]
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const messages: ORMessage[] = [
      { role: 'user', content: 'Test message' }
    ];

    const result = await openrouterChat(messages);

    expect(fetch).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages,
          temperature: 0.2
        })
      }
    );

    expect(result).toBe('Test response from AI');
  });

  test('should throw error when API key is missing', async () => {
    delete process.env.OPENROUTER_API_KEY;

    const messages: ORMessage[] = [
      { role: 'user', content: 'Test message' }
    ];

    await expect(openrouterChat(messages)).rejects.toThrow('OPENROUTER_API_KEY missing');
  });

  test('should throw error on API failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized'
    });

    const messages: ORMessage[] = [
      { role: 'user', content: 'Test message' }
    ];

    await expect(openrouterChat(messages)).rejects.toThrow('OpenRouter 401: Unauthorized');
  });

  test('should handle custom model and temperature', async () => {
    const mockResponse = {
      choices: [{ message: { content: 'Custom response' } }]
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const messages: ORMessage[] = [
      { role: 'user', content: 'Test message' }
    ];

    await openrouterChat(messages, 'openai/gpt-4', 0.8);

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({
          model: 'openai/gpt-4',
          messages,
          temperature: 0.8
        })
      })
    );
  });

  test('should return empty string when no content in response', async () => {
    const mockResponse = {
      choices: []
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const messages: ORMessage[] = [
      { role: 'user', content: 'Test message' }
    ];

    const result = await openrouterChat(messages);
    expect(result).toBe('');
  });

  test('should handle malformed JSON response gracefully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => { throw new Error('Invalid JSON'); }
    });

    const messages: ORMessage[] = [
      { role: 'user', content: 'Test message' }
    ];

    await expect(openrouterChat(messages)).rejects.toThrow();
  });
});

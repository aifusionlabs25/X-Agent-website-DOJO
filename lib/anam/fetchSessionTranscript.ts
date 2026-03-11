/**
 * Utility to fetch a session's full transcript from Anam.
 * This is an optional post-session fetch if `sessionId` is available.
 * 
 * Note: ANAM_API_KEY must only be used server-side.
 */
export async function fetchSessionTranscript(sessionId: string) {
    if (!sessionId) {
        throw new Error('No sessionId provided');
    }

    const apiKey = process.env.ANAM_API_KEY;
    if (!apiKey) {
        throw new Error('Server configuration error: Missing ANAM_API_KEY');
    }

    try {
        const res = await fetch(`https://api.anam.ai/v1/sessions/${sessionId}/transcript`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch transcript. Status: ${res.status}`);
        }

        const data = await res.json();
        return data; // Returns { messages: [...] }
    } catch (error) {
        console.error('Error fetching Anam session transcript:', error);
        throw error;
    }
}

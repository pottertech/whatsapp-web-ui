export interface WebhookMessage {
  message: string;
  timestamp: string;
  chatId?: string;
  userId?: string;
}

export interface WebhookResponse {
  response: string;
  timestamp?: string;
  success: boolean;
}

class WebhookService {
  private webhookUrl: string;

  constructor() {
    // You can set this via environment variable or configuration
    this.webhookUrl = process.env.REACT_APP_N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/chat';
  }

  async sendMessage(message: WebhookMessage): Promise<WebhookResponse> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        response: data.response || data.message || 'No response received',
        timestamp: data.timestamp || new Date().toISOString(),
        success: true,
      };
    } catch (error) {
      console.error('Error sending message to webhook:', error);
      return {
        response: 'Sorry, I encountered an error processing your message.',
        timestamp: new Date().toISOString(),
        success: false,
      };
    }
  }

  setWebhookUrl(url: string) {
    this.webhookUrl = url;
  }
}

export const webhookService = new WebhookService();
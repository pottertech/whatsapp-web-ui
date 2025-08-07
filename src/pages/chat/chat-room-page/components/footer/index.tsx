import { useState } from "react";
import Icon from "common/components/icons";
import { webhookService } from "common/services/webhook.service";
import {
  AttachButton,
  Button,
  ButtonsContainer,
  IconsWrapper,
  Input,
  SendMessageButton,
  Wrapper,
  Form,
} from "./styles";

const attachButtons = [
  { icon: "attachRooms", label: "Choose room" },
  { icon: "attachContacts", label: "Choose contact" },
  { icon: "attachDocument", label: "Choose document" },
  { icon: "attachCamera", label: "Use camera" },
  { icon: "attachImage", label: "Choose image" },
];

type FooterProps = {
  onSendMessage?: (message: string, isUser: boolean) => void;
  chatId?: string;
};

export default function Footer({ onSendMessage, chatId }: FooterProps) {
  const [showIcons, setShowIcons] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    // Add user message to chat
    if (onSendMessage) {
      onSendMessage(userMessage, true);
    }

    try {
      // Send to webhook
      const response = await webhookService.sendMessage({
        message: userMessage,
        timestamp: new Date().toISOString(),
        chatId: chatId,
        userId: "current-user", // You can get this from context
      });

      // Add bot response to chat
      if (onSendMessage && response.success) {
        onSendMessage(response.response, false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (onSendMessage) {
        onSendMessage("Sorry, I encountered an error processing your message.", false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <Wrapper>
      <IconsWrapper>
        <AttachButton onClick={() => setShowIcons(!showIcons)}>
          <Icon id="attach" className="icon" />
        </AttachButton>
        <ButtonsContainer>
          {attachButtons.map((btn) => (
            <Button showIcon={showIcons} key={btn.label}>
              <Icon id={btn.icon} />
            </Button>
          ))}
        </ButtonsContainer>
      </IconsWrapper>
      <Form onSubmit={handleSubmit}>
        <Input 
          placeholder="Type a message here .." 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <SendMessageButton type="submit" disabled={!message.trim() || isLoading}>
          <Icon id="send" className="icon" />
        </SendMessageButton>
      </Form>
    </Wrapper>
  );
}

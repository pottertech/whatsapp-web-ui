import ChatLayout from "../layouts";
import Header from "./components/header";
import Footer from "./components/footer";
import Sidebar from "./components/sidebar";
import Icon from "common/components/icons";
import useChatRoom from "./hooks/useChatRoom";
import ProfileSection from "./components/profile";
import MessagesList from "./components/messages-list";
import SearchSection from "./components/search-section";
import useNavigateToChat from "./hooks/useNavigateToChat";
import { addMessage, getMessagesForChat } from "./components/messages-list/data/get-messages";
import { useState, useEffect } from "react";
import { Container, Body, Background, FooterContainer, ScrollButton } from "./styles";

export default function ChatRoomPage() {
  const {
    activeInbox,
    handleMenuOpen,
    handleShowIcon,
    isProfileOpen,
    isSearchOpen,
    isShowIcon,
    setIsProfileOpen,
    setIsSearchOpen,
    setShouldScrollToBottom,
    shouldScrollToBottom,
  } = useChatRoom();
  useNavigateToChat(activeInbox);
  
  const [messages, setMessages] = useState(() => 
    activeInbox ? getMessagesForChat(activeInbox.id) : []
  );

  useEffect(() => {
    if (activeInbox) {
      setMessages(getMessagesForChat(activeInbox.id));
    }
  }, [activeInbox?.id]);

  const handleSendMessage = (message: string, isUser: boolean) => {
    if (!activeInbox) return;
    
    addMessage(activeInbox.id, message, isUser);
    setMessages(getMessagesForChat(activeInbox.id));
    setShouldScrollToBottom(true);
  };

  return (
    <ChatLayout>
      <Container>
        <Body>
          <Background />
          <Header
            title={activeInbox?.name ?? ""}
            image={activeInbox?.image ?? ""}
            subTitle={activeInbox?.isOnline ? "Online" : ""}
            onSearchClick={() => handleMenuOpen("search")}
            onProfileClick={() => handleMenuOpen("profile")}
          />
          <MessagesList
            onShowBottomIcon={handleShowIcon}
            shouldScrollToBottom={shouldScrollToBottom}
            chatId={activeInbox?.id}
            messages={messages}
          />
          <FooterContainer>
            {isShowIcon && (
              <ScrollButton onClick={() => setShouldScrollToBottom(true)}>
                <Icon id="downArrow" />
              </ScrollButton>
            )}
            <Footer 
              onSendMessage={handleSendMessage}
              chatId={activeInbox?.id}
            />
          </FooterContainer>
        </Body>
        <Sidebar title="Search" isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)}>
          <SearchSection />
        </Sidebar>
        <Sidebar
          title="Contact Info"
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        >
          <ProfileSection name={activeInbox?.name ?? ""} image={activeInbox?.image ?? ""} />
        </Sidebar>
      </Container>
    </ChatLayout>
  );
}

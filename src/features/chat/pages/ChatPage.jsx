import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '../../../shared/context/useSidebar';
import Layout from '../../../shared/components/layout/Layout';
import ChatComposerLayer from '../components/ChatComposerLayer';
import ChatIntroSection from '../components/ChatIntroSection';
import ChatThread from '../components/ChatThread';
import { useSlider } from '../../../shared/hooks/useSlider';
import { useChat } from '../hooks/useChat';
import { isLoggedIn } from '../../auth/utils/auth';
import RecipeDetailModal from '../../meal/components/RecipeDetailModal';
import { fetchRandomRecipes, fetchRecipeDetail } from '../../meal/api/recipeApi';
import '../style/chat.css';

export default function ChatPage() {
  const { sliderRef, canScrollLeft, canScrollRight, updateButtons } = useSlider();
  const location = useLocation();

  const { sidebarOpen, setSidebarOpen } = useSidebar();

  const { query, setQuery,
          messages, isLoading, hasMessages, messagesEndRef,
          isNearBottom, scrollToBottom,
          handleSubmit, startNewChat, openExistingChat, chatId,
          chats, refreshChats, deleteChat,
        } = useChat();
  const [randomMeals, setRandomMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [detail, setDetail] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  // 사이드바가 열릴 때마다 채팅 목록 갱신 (기존 Sidebar의 useEffect 역할을 ChatPage가 담당)
  useEffect(() => {
    if (sidebarOpen && isLoggedIn()) refreshChats();
  }, [sidebarOpen, refreshChats]);

  // 캘린더 등 다른 페이지에서 채팅 클릭 시 해당 채팅 자동 로드
  // ref로 마운트 시점의 state만 캡처 → location 변경에 재반응하지 않음
  const chatIdToOpen = useRef(location.state?.chatIdToOpen);
  useEffect(() => {
    if (chatIdToOpen.current) openExistingChat(chatIdToOpen.current);
  }, [openExistingChat]);

  useEffect(() => {
    let ignore = false;

    const loadRandomMeals = async () => {
      try {
        const recipes = await fetchRandomRecipes(10);
        if (!ignore) setRandomMeals(Array.isArray(recipes) ? recipes : []);
      } catch (error) {
        console.error('랜덤 레시피 로딩 실패:', error?.response?.data || error);
        if (!ignore) setRandomMeals([]);
      }
    };

    loadRandomMeals();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const frameId = requestAnimationFrame(updateButtons);
    return () => cancelAnimationFrame(frameId);
  }, [randomMeals.length, updateButtons]);

  const loadRecipeDetail = async (meal) => {
    const recipeId = meal?.recipeId || meal?.id;
    if (!recipeId) return;

    setSelectedMeal(meal);
    setDetail(null);
    setDetailError('');
    setIsDetailLoading(true);

    try {
      const data = await fetchRecipeDetail(recipeId);
      setDetail(data);
    } catch (error) {
      setDetailError(error?.message || '레시피 상세 정보를 불러오지 못했습니다.');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeRecipeDetail = () => {
    setSelectedMeal(null);
    setDetail(null);
    setDetailError('');
    setIsDetailLoading(false);
  };


  return (
    <Layout
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSidebarOpen((prev) => !prev)}
      onStartNewChat={startNewChat}
      chats={chats}
      onOpenExistingChat={openExistingChat}
      onDeleteChat={(chatIdToDelete) => {
        deleteChat(chatIdToDelete);
        if (chatIdToDelete === chatId) startNewChat();  // 현재 채팅 삭제 시 새 채팅으로 초기화
      }}
    >
      <ChatIntroSection
        hasMessages={hasMessages}
        meals={randomMeals}
        sliderRef={sliderRef}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
        onMealClick={loadRecipeDetail}
      />

      {selectedMeal && (
        <RecipeDetailModal
          recipe={detail || selectedMeal}
          isLoading={isDetailLoading}
          error={detailError}
          onRetry={() => loadRecipeDetail(selectedMeal)}
          onClose={closeRecipeDetail}
        />
      )}

      <ChatThread
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />

      <ChatComposerLayer
        sidebarOpen={sidebarOpen}
        showScrollButton={hasMessages && !isNearBottom}
        onScrollToBottom={() => scrollToBottom()}
        inputProps={{
          value: query,
          onChange: setQuery,
          onSubmit: handleSubmit,
        }}
      />

    </Layout>
  );
}

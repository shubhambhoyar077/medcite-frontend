import { Outlet } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './navigation/SideBar';
import Topbar from './navigation/Topbar';
import { ToastContainer } from './toast/toast';
import { useAuth } from '../pages/auth/hooks/authHooks';
import {
  selectDarkMode,
  selectSidebarMinimized,
  selectSelectedModelId,
  toggleDarkMode,
  toggleSidebar,
  setSidebarMinimized,
  setSelectedModel,
  openModal,
} from '../redux/ui/uiSlice';
import {
  selectChatHistory,
  selectActiveChatId,
  newChat,
  selectChat,
} from '../redux/chat/chatSlice';

/* Models list — move to a constants file or fetch from API if needed */
const MODELS = [
  { id: '1', name: 'GPT-4' },
  { id: '2', name: 'Claude 3.5 Sonnet' },
  { id: '3', name: 'Gemini Pro' },
];

export default function PageLayout() {
  const dispatch = useDispatch();
  let { user, logout } = useAuth();

  /* UI state from Redux */
  const darkMode         = useSelector(selectDarkMode);
  const isMinimized      = useSelector(selectSidebarMinimized);
  const selectedModelId  = useSelector(selectSelectedModelId);

  /* Chat state from Redux */
  const chatHistory  = useSelector(selectChatHistory);
  const activeChatId = useSelector(selectActiveChatId);

  /* Page / app background driven by darkMode */
  const pageStyle = {
    background: darkMode
      ? `var(--color-dark-bg-via)`
      : `linear-gradient(to bottom right, var(--color-neutral-from), var(--color-neutral-mid), var(--color-neutral-to))`,
  };

  return (
    <div className="h-screen w-full flex overflow-hidden" style={pageStyle}>
      {/* ── Sidebar ── */}
      <Sidebar
        isMinimized={isMinimized}
        setIsMinimized={(val) => dispatch(setSidebarMinimized(val))}
        chatHistory={chatHistory}
        onNewChat={() => dispatch(newChat())}
        onChatSelect={(id) => dispatch(selectChat(id))}
        activeChatId={activeChatId}
        user={user}
        onLogout={logout}
        onProfileClick={() => dispatch(openModal('profile'))}
        darkMode={darkMode}
      />

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ── Topbar ── */}
        <Topbar
          models={MODELS}
          selectedModelId={selectedModelId}
          onModelChange={(id) => dispatch(setSelectedModel(id))}
          darkMode={darkMode}
          onDarkModeToggle={() => dispatch(toggleDarkMode())}
          isSidebarMinimized={isMinimized}
          onToggleSidebar={() => dispatch(toggleSidebar())}
        />

        {/* ── Toast notifications ── */}
        <ToastContainer position="top-right" />

        {/* ── Page content (HomePage, ProfilePage, etc.) ── */}
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
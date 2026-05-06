import { useState, useRef } from 'react';
import { Search, User, LogOut, Menu } from 'lucide-react';
import { FiSidebar } from 'react-icons/fi';
import logo from '../../assets/new_logo.svg';

export default function Sidebar({
  isMinimized,
  setIsMinimized,
  chatHistory = [],
  onNewChat = () => {},
  onChatSelect = () => {},
  activeChatId = null,
  user = { full_name: '', email: '' },
  onLogout = () => {},
  onProfileClick = () => {},
  darkMode = true,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const filteredChats = chatHistory.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name = '') =>
    name.split(' ').map((p) => p[0] || '').join('').toUpperCase().slice(0, 2);

  const v = (n) => `var(--color-${n})`;
  const dk = darkMode;

  const bg        = dk ? v('dark-bg-from')         : '#ffffff';
  const border    = dk ? v('dark-border')           : '#e5e7eb';
  const text      = dk ? v('dark-text-primary')     : '#111827';
  const textMuted = dk ? v('dark-text-muted')       : '#6b7280';
  const textDim   = dk ? v('dark-text-placeholder') : '#9ca3af';
  const surface   = dk ? v('dark-surface-to')       : '#f9fafb';
  const hoverBg   = dk ? 'rgba(255,255,255,0.06)'   : 'rgba(0,0,0,0.04)';
  const activeBg  = dk ? 'rgba(255,255,255,0.07)'   : 'rgba(0,0,0,0.06)';
  const inputBg   = dk ? v('dark-bg-via')           : '#f3f4f6';
  const iconCircle = dk ? 'rgba(255,255,255,0.08)'  : 'rgba(0,0,0,0.06)';

  /* ── Profile dropdown
     - Expanded sidebar → opens ABOVE the profile button (bottom: 100%)
     - Collapsed sidebar → opens to the RIGHT of the sidebar (left: 100%)
     Both share the same card content.
  ── */
  const DropdownCard = () => (
    <div
      className="z-50 rounded-xl overflow-hidden"
      style={{
        position: 'absolute',
        ...(isMinimized
          ? { left: 'calc(100% + 8px)', bottom: 0, width: 220 }
          : { left: 8, right: 8, bottom: 'calc(100% + 8px)' }),
        background: surface,
        border: `1px solid ${border}`,
        boxShadow: dk
          ? '0 8px 32px rgba(0,0,0,0.5)'
          : '0 8px 32px rgba(0,0,0,0.12)',
      }}
    >
      {/* User info header */}
      <div className="px-4 py-3" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="flex items-center gap-3">
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-full text-white text-xs font-semibold"
            style={{
              width: 32, height: 32,
              background: `linear-gradient(135deg, ${v('brand-green')}, ${v('brand-blue')})`,
            }}
          >
            {getInitials(user.full_name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: text }}>
              {user.full_name}
            </p>
            <p className="text-xs truncate" style={{ color: textDim }}>
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Profile */}
      <button
        onClick={() => { onProfileClick(); setIsProfileOpen(false); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
        style={{ color: text }}
        onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <User size={15} style={{ color: textMuted }} />
        Profile
      </button>

      {/* Logout */}
      <button
        onClick={() => { onLogout(); setIsProfileOpen(false); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
        style={{ color: '#f87171' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <LogOut size={15} />
        Log out
      </button>
    </div>
  );

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile toggle */}
      <button
        onClick={() => { setIsMobileOpen(true); setIsMinimized(false); }}
        className="md:hidden fixed top-0 left-0 z-10 w-16 h-16 flex items-center justify-center"
        style={{ background: bg, borderBottom: `1px solid ${border}` }}
      >
        <Menu size={20} style={{ color: textMuted }} />
      </button>

      <aside
        className={`
          h-full flex-shrink-0 flex flex-col
          transition-all duration-300 ease-in-out
          ${isMinimized ? 'w-16' : 'w-64'}
          ${isMobileOpen ? 'fixed inset-y-0 left-0 z-30' : 'hidden md:flex'}
        `}
        style={{ background: bg, borderRight: `1px solid ${border}` }}
      >

        {/* ── Header: logo + name + collapse button ── */}
        <div
          className="flex items-center justify-between px-3 flex-shrink-0"
          style={{ height: 56, borderBottom: `1px solid ${border}` }}
        >
          <button
            onClick={() => isMinimized && setIsMinimized(false)}
            className="flex items-center gap-3 min-w-0"
          >
            <img src={logo} alt="Sypher" className="w-8 h-8 flex-shrink-0 object-contain" />
            {!isMinimized && (
              <span className="text-base font-semibold truncate" style={{ color: text }}>
                Sypher
              </span>
            )}
          </button>

          {!isMinimized && (
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-md flex-shrink-0"
              style={{ color: textDim }}
              onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              title="Collapse"
            >
              <FiSidebar size={17} />
            </button>
          )}
        </div>

        {/* ── New Chat ──
            Expanded: plain text row with hover
            Collapsed: circle icon button (same style as active chat circle)
        ── */}
        <div
          className="px-3 py-3 flex-shrink-0 flex"
          style={{
            justifyContent: isMinimized ? 'center' : 'flex-start',
          }}
        >
          {isMinimized ? (
            <button
              onClick={onNewChat}
              title="New Chat"
              className="flex items-center justify-center transition-colors"
              style={{
                width: 36, height: 36,
                borderRadius: '50%',
                background: iconCircle,
                border: 'none',
                color: textMuted,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = dk ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'}
              onMouseLeave={(e) => e.currentTarget.style.background = iconCircle}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onNewChat}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
              style={{ color: textMuted }}
              onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: textMuted, flexShrink: 0 }}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>New Chat</span>
            </button>
          )}
        </div>

        {/* ── Search ──
            Expanded: input field
            Collapsed: circle icon button (same style as + above)
        ── */}
        <div
          className="px-3 pb-3 flex-shrink-0 flex"
          style={{ justifyContent: isMinimized ? 'center' : 'flex-start' }}
        >
          {isMinimized ? (
            <button
              title="Search"
              className="flex items-center justify-center transition-colors"
              style={{
                width: 36, height: 36,
                borderRadius: '50%',
                background: iconCircle,
                border: 'none',
                color: textMuted,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = dk ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'}
              onMouseLeave={(e) => e.currentTarget.style.background = iconCircle}
            >
              <Search size={15} />
            </button>
          ) : (
            <div className="relative w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textDim }} />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: inputBg, color: text, border: `1px solid ${border}` }}
              />
            </div>
          )}
        </div>

        {/* ── Chat history ──
            Collapsed: show NOTHING (no dots, no icons, no items)
            Expanded: full list
        ── */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {!isMinimized && (
            <>
              {chatHistory.length > 0 && (
                <p className="px-4 pt-1 pb-2 text-xs font-medium uppercase tracking-wide" style={{ color: textDim }}>
                  Recent
                </p>
              )}

              {filteredChats.length === 0 && (
                <p className="text-sm text-center py-8" style={{ color: textDim }}>
                  {searchQuery ? 'No results' : 'No chats yet'}
                </p>
              )}

              <div className="space-y-0.5 px-2">
                {filteredChats.map((chat) => {
                  const active = chat.id === activeChatId;
                  return (
                    <button
                      key={chat.id}
                      onClick={() => onChatSelect(chat.id)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors"
                      style={{
                        background: active ? activeBg : 'transparent',
                        color:      active ? text     : textMuted,
                        fontWeight: active ? 500      : 400,
                      }}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = hoverBg; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = active ? activeBg : 'transparent'; }}
                    >
                      {chat.title}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ── Profile ── */}
        <div
          className="relative flex-shrink-0 px-3 py-3"
          style={{ borderTop: `1px solid ${border}` }}
        >
          {/* Click-away */}
          {isProfileOpen && (
            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
          )}

          {isProfileOpen && <DropdownCard />}

          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-colors"
            style={{ justifyContent: isMinimized ? 'center' : 'flex-start' }}
            onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            {/* Avatar — always visible */}
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-full text-white text-xs font-semibold"
              style={{
                width: 32, height: 32,
                background: `linear-gradient(135deg, ${v('brand-green')}, ${v('brand-blue')})`,
              }}
            >
              {getInitials(user.full_name)}
            </div>

            {/* Name + email — expanded only */}
            {!isMinimized && (
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: text }}>
                  {user.full_name}
                </p>
                <p className="text-xs truncate" style={{ color: textDim }}>
                  {user.email}
                </p>
              </div>
            )}
          </button>
        </div>

      </aside>
    </>
  );
}
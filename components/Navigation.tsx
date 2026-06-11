import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Zap,
  Play,
  BookOpen,
  Settings,
  Search,
  Home,
  Bookmark,
  User,
  Gamepad2,
  Compass,
  Users,
  ChevronDown,
  LogOut,
  GraduationCap,
  MonitorPlay,
  ChevronUp,
  Clapperboard,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { useTheme } from '../contexts/ThemeContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authState, logout } = useAuth();
  const { level, levelDefinition } = useGamification();
  const { preferences, setTheme } = useTheme();
  const currentPath = location.pathname;
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [watchMenuOpen, setWatchMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const watchMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) =>
    path === '/' ? currentPath === '/' : currentPath === path || currentPath.startsWith(path + '/');
  const isWatchActive = isActive('/vod') || isActive('/feed');

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (watchMenuRef.current && !watchMenuRef.current.contains(event.target as Node)) {
        setWatchMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary navigation (used by the desktop sidebar)
  const mainNav = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/topics', label: 'Topics', icon: Compass },
    { path: '/experts', label: 'Experts', icon: Users },
    { path: '/vod', label: 'Watch', icon: Play, matchAlso: '/watch' },
    { path: '/courses', label: 'Courses', icon: BookOpen, matchAlso: '/course' },
    { path: '/learn', label: 'Learn', icon: GraduationCap },
    { path: '/games', label: 'Games', icon: Gamepad2 },
  ];

  const libraryNav = [
    { path: '/search', label: 'Search', icon: Search },
    { path: '/my-list', label: 'My List', icon: Bookmark },
    { path: '/profile', label: 'Your Journey', icon: User },
  ];

  // Mobile bottom nav items (5 sections)
  const mobileNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/courses', label: 'Courses', icon: BookOpen, matchAlso: '/course' },
    { path: 'watch', label: 'Watch', icon: MonitorPlay, isWatch: true },
    { path: '/games', label: 'Games', icon: Gamepad2 },
    { path: '/learn', label: 'Learn', icon: GraduationCap, matchAlso: '/learn' },
  ];

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'Auto', icon: Monitor },
  ];

  const renderSidebarLink = (item: { path: string; label: string; icon: any; matchAlso?: string }) => {
    const Icon = item.icon;
    const active = isActive(item.path) || (item.matchAlso && isActive(item.matchAlso));
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-[180ms] ease-[cubic-bezier(.22,.61,.36,1)] ${
          active
            ? 'bg-white/10 text-white'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        }`}
      >
        <Icon className="w-[18px] h-[18px]" />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Left Sidebar - sj.land inspired, clean & grouped */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-60 z-50 flex-col bg-[#0A0F18] border-r border-white/5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 px-5 h-16 cursor-pointer group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FACC15] to-[#F59E0B] flex items-center justify-center shadow-card">
            <Zap className="h-4 w-4 text-black" />
          </div>
          <span className="text-lg font-bold text-white">Fasterclass</span>
        </Link>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6 scrollbar-hide">
          <div className="space-y-0.5">
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-white/30">Menu</p>
            {mainNav.map(renderSidebarLink)}
          </div>
          <div className="space-y-0.5">
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-white/30">Library</p>
            {libraryNav.map(renderSidebarLink)}
          </div>
        </nav>

        {/* Bottom: theme toggle + profile */}
        <div className="px-3 py-4 border-t border-white/5 space-y-3 shrink-0">
          {/* Light / Dark / Auto toggle */}
          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all duration-[180ms] ${
                  preferences.theme === value
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white/80'
                }`}
                title={label}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Profile row */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-all duration-[180ms]"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-card shrink-0"
                style={{ backgroundColor: levelDefinition.color }}
              >
                <span className="text-white">{level}</span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-white truncate">{levelDefinition.title}</p>
                <p className="text-xs text-white/40">Level {level}</p>
              </div>
              <ChevronUp className={`w-4 h-4 text-white/40 transition-transform duration-[180ms] ${profileDropdownOpen ? '' : 'rotate-180'}`} />
            </button>

            {profileDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#111827] rounded-xl border border-white/10 shadow-modal overflow-hidden z-50">
                <div className="py-2">
                  <button
                    onClick={() => { navigate('/profile'); setProfileDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/90 hover:bg-[#1C2433] transition-all duration-[180ms]"
                  >
                    <User className="w-4 h-4 text-white/50" />
                    <span>Your Journey</span>
                  </button>
                  <button
                    onClick={() => { navigate('/profile'); setProfileDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/90 hover:bg-[#1C2433] transition-all duration-[180ms]"
                  >
                    <Settings className="w-4 h-4 text-white/50" />
                    <span>Preferences</span>
                  </button>
                  {authState.isAuthenticated && (
                    <button
                      onClick={() => { navigate('/admin'); setProfileDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/90 hover:bg-[#1C2433] transition-all duration-[180ms]"
                    >
                      <Settings className="w-4 h-4 text-white/50" />
                      <span>Curator CMS</span>
                    </button>
                  )}
                </div>
                <div className="py-2 border-t border-white/10">
                  <button
                    onClick={() => { logout(); setProfileDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/50 hover:bg-[#1C2433] hover:text-white transition-all duration-[180ms]"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile & Tablet Top Bar - hidden on desktop (replaced by sidebar) */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0A0F18]/80 backdrop-blur-[12px] border-b border-white/5">
        <div className="max-w-full mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FACC15] to-[#F59E0B] flex items-center justify-center shadow-card">
                <Zap className="h-4 w-4 text-black" />
              </div>
              <span className="text-lg font-bold text-white hidden sm:inline">
                Fasterclass
              </span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-[#1C2433] transition-all duration-[180ms] ease-[cubic-bezier(.22,.61,.36,1)]"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-card"
                    style={{ backgroundColor: levelDefinition.color }}
                  >
                    <span className="text-white">{level}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-[180ms] ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#111827] rounded-xl border border-white/10 shadow-modal overflow-hidden z-50">
                    {/* Header with level */}
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-card"
                          style={{ backgroundColor: levelDefinition.color }}
                        >
                          <span className="text-white font-bold">{level}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{levelDefinition.title}</p>
                          <p className="text-xs text-white/50">Level {level}</p>
                        </div>
                      </div>
                    </div>

                    {/* Theme toggle */}
                    <div className="px-3 py-3 border-b border-white/10">
                      <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
                        {themeOptions.map(({ value, label, icon: Icon }) => (
                          <button
                            key={value}
                            onClick={() => setTheme(value)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all duration-[180ms] ${
                              preferences.theme === value
                                ? 'bg-white/10 text-white'
                                : 'text-white/50 hover:text-white/80'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => { navigate('/profile'); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/90 hover:bg-[#1C2433] transition-all duration-[180ms]"
                      >
                        <User className="w-4 h-4 text-white/50" />
                        <span>Your Journey</span>
                      </button>
                      <button
                        onClick={() => { navigate('/topics'); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/90 hover:bg-[#1C2433] transition-all duration-[180ms]"
                      >
                        <Compass className="w-4 h-4 text-white/50" />
                        <span>Topics</span>
                      </button>
                      <button
                        onClick={() => { navigate('/experts'); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/90 hover:bg-[#1C2433] transition-all duration-[180ms]"
                      >
                        <Users className="w-4 h-4 text-white/50" />
                        <span>Experts</span>
                      </button>
                      <button
                        onClick={() => { navigate('/search'); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/90 hover:bg-[#1C2433] transition-all duration-[180ms]"
                      >
                        <Search className="w-4 h-4 text-white/50" />
                        <span>Search</span>
                      </button>
                      <button
                        onClick={() => { navigate('/my-list'); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/90 hover:bg-[#1C2433] transition-all duration-[180ms]"
                      >
                        <Bookmark className="w-4 h-4 text-white/50" />
                        <span>My List</span>
                      </button>
                      <button
                        onClick={() => { navigate('/profile'); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/90 hover:bg-[#1C2433] transition-all duration-[180ms]"
                      >
                        <Settings className="w-4 h-4 text-white/50" />
                        <span>Preferences</span>
                      </button>
                    </div>

                    {/* Admin Link */}
                    {authState.isAuthenticated && (
                      <div className="py-2 border-t border-white/10">
                        <button
                          onClick={() => { navigate('/admin'); setProfileDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/90 hover:bg-[#1C2433] transition-all duration-[180ms]"
                        >
                          <Settings className="w-4 h-4 text-white/50" />
                          <span>Curator CMS</span>
                        </button>
                      </div>
                    )}

                    {/* Sign Out */}
                    <div className="py-2 border-t border-white/10">
                      <button
                        onClick={() => { logout(); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/50 hover:bg-[#1C2433] hover:text-white transition-all duration-[180ms]"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile & Tablet Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0F18]/80 backdrop-blur-[12px] border-t border-white/5 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;

            // Handle Watch menu specially
            if (item.isWatch) {
              return (
                <div key={item.path} className="relative" ref={watchMenuRef}>
                  <button
                    onClick={() => setWatchMenuOpen(!watchMenuOpen)}
                    className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-[180ms] ease-[cubic-bezier(.22,.61,.36,1)] ${
                      isWatchActive
                        ? 'text-[#FACC15]'
                        : 'text-white/50'
                    }`}
                  >
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold">{item.label}</span>
                    <ChevronUp className={`w-3 h-3 transition-transform duration-[180ms] ${watchMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Watch Menu Popup */}
                  {watchMenuOpen && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-[#111827] rounded-xl border border-white/10 shadow-modal overflow-hidden">
                      <button
                        onClick={() => {
                          navigate('/feed');
                          setWatchMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-[180ms] ${
                          isActive('/feed')
                            ? 'bg-gradient-to-r from-[#FACC15]/20 to-[#F59E0B]/20 text-[#FACC15]'
                            : 'text-white/90 hover:bg-[#1C2433]'
                        }`}
                      >
                        <Clapperboard className="w-5 h-5" />
                        <span className="font-semibold">Shorts</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/vod');
                          setWatchMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-[180ms] ${
                          isActive('/vod')
                            ? 'bg-gradient-to-r from-[#FACC15]/20 to-[#F59E0B]/20 text-[#FACC15]'
                            : 'text-white/90 hover:bg-[#1C2433]'
                        }`}
                      >
                        <Play className="w-5 h-5" />
                        <span className="font-semibold">Watch</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            const active = isActive(item.path) || (item.matchAlso && isActive(item.matchAlso));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-[180ms] ease-[cubic-bezier(.22,.61,.36,1)] ${
                  active
                    ? 'text-white'
                    : 'text-white/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for mobile/tablet bottom nav */}
      <div className="lg:hidden h-16" />
    </>
  );
};

export default Navigation;

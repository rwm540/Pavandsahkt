/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  mockUsers, 
  mockProperties, 
  mockDealRooms, 
  mockNotifications, 
  mockPriceIndices 
} from './data/mockData';
import { UserRole, User, Property, DealRoom, NotificationItem, LiveActivityEvent, LiveTickerItem } from './types';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { FAB } from './components/common/FAB';
import { BottomSheetModal } from './components/common/BottomSheetModal';
import { SubmitModal } from './components/modals/SubmitModal';
import { LiveTickerBar } from './components/common/LiveTickerBar';
import { LiveActivityModal } from './components/common/LiveActivityModal';
import { MoreMenuSheet } from './components/common/MoreMenuSheet';
import { 
  initialTickerItems, 
  initialLiveEvents, 
  generateNextLiveEvent, 
  updateTickerItems, 
  playSubtleChime 
} from './utils/realtimeEngine';

// Pages
import { HomeDashboard } from './components/pages/HomeDashboard';
import { MarketplacePage } from './components/pages/MarketplacePage';
import { DealRoomPage } from './components/pages/DealRoomPage';
import { RateCutterPage } from './components/pages/RateCutterPage';
import { BarterPage } from './components/pages/BarterPage';
import { PartnershipPage } from './components/pages/PartnershipPage';
import { MaterialsMarketPage } from './components/pages/MaterialsMarketPage';
import { CraftsmenPage } from './components/pages/CraftsmenPage';
import { PriceDataCenterPage } from './components/pages/PriceDataCenterPage';
import { PropertyDetailPage } from './components/pages/PropertyDetailPage';
import { RoleDashboardPage } from './components/pages/RoleDashboardPage';
import { AdminPanelPage } from './components/pages/AdminPanelPage';
import { NotificationsPage } from './components/pages/NotificationsPage';
import { ProfilePage } from './components/pages/ProfilePage';

export default function App() {
  // Primary States
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeRole, setActiveRole] = useState<UserRole>('buyer');
  
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [dealRooms, setDealRooms] = useState<DealRoom[]>(mockDealRooms);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Real-Time Engine States
  const [tickerItems, setTickerItems] = useState<LiveTickerItem[]>(initialTickerItems);
  const [liveEvents, setLiveEvents] = useState<LiveActivityEvent[]>(initialLiveEvents);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(false);
  const [isLiveFeedModalOpen, setIsLiveFeedModalOpen] = useState<boolean>(false);

  // Modals & Bottom Sheets
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isMoreMenuSheetOpen, setIsMoreMenuSheetOpen] = useState<boolean>(false);
  const [submitModalType, setSubmitModalType] = useState<'property' | 'material_quote' | 'barter' | 'partnership'>('property');

  // Global Smooth Horizontal Mouse Wheel and Drag-to-Scroll Support
  useEffect(() => {
    // 1. Mouse Wheel on Horizontal Scroll Containers
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const scrollable = target.closest('.overflow-x-auto') as HTMLElement | null;
      if (scrollable && scrollable.scrollWidth > scrollable.clientWidth) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          // Translate vertical mouse wheel to horizontal scroll smoothly
          scrollable.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      }
    };

    // 2. Mouse Drag-to-Scroll for Desktop users
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let activeContainer: HTMLElement | null = null;
    let hasDragged = false;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const container = target.closest('.overflow-x-auto') as HTMLElement | null;
      if (container && container.scrollWidth > container.clientWidth) {
        isDown = true;
        hasDragged = false;
        activeContainer = container;
        startX = e.pageX;
        startScrollLeft = container.scrollLeft;
      }
    };

    const handleMouseUp = () => {
      isDown = false;
      activeContainer = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown || !activeContainer) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 4) {
        hasDragged = true;
      }
      activeContainer.scrollLeft = startScrollLeft - dx;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Real-Time Simulation Interval
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      // 1. Update fluctuating ticker prices
      setTickerItems((prev) => updateTickerItems(prev));

      // 2. Generate and prepend next live event
      const newEvent = generateNextLiveEvent();
      setLiveEvents((prev) => [newEvent, ...prev.slice(0, 40)]);

      // 3. Play audio chime if enabled
      if (isSoundEnabled) {
        playSubtleChime();
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isLiveActive, isSoundEnabled]);

  const handleEmitCustomLiveEvent = (title: string, desc: string, type: LiveActivityEvent['type']) => {
    const timeStr = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const customEv: LiveActivityEvent = {
      id: `custom-${Date.now()}`,
      title,
      description: desc,
      type,
      timestamp: timeStr,
      badge: 'رویداد لحظه‌ای',
      badgeColor: 'amber',
      actor: currentUser.name,
    };
    setLiveEvents((prev) => [customEv, ...prev]);
    if (isSoundEnabled) playSubtleChime();
  };

  // Filter states inside BottomSheet
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');

  // Find user object corresponding to role
  const currentUser: User = mockUsers.find((u) => u.role === activeRole) || mockUsers[0];

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const activeDealRoomsCount = dealRooms.filter((d) => d.status === 'active').length;

  // Handlers
  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'admin') {
      setActiveTab('admin_panel');
    }
  };

  const handleSelectProperty = (prop: Property) => {
    setSelectedProperty(prop);
    setActiveTab('property_detail');
  };

  const handleEnterDealRoom = (propertyCode: string) => {
    const existingRoom = dealRooms.find((r) => r.propertyCode === propertyCode);
    if (existingRoom) {
      setActiveTab('deal_room');
      return;
    }

    // Create a new Deal Room for this property code dynamically
    const targetProp = properties.find((p) => p.code === propertyCode);
    if (targetProp) {
      const newRoom: DealRoom = {
        id: `dr-${Date.now()}`,
        title: `اتاق معامله محرمانه - ${targetProp.title}`,
        propertyCode: targetProp.code,
        propertyTitle: targetProp.title,
        propertyPrice: targetProp.price,
        propertyImage: targetProp.images[0],
        buyerName: currentUser.name,
        buyerPhone: currentUser.phone,
        sellerName: targetProp.ownerName,
        sellerPhone: targetProp.ownerPhone,
        assignedAgentName: 'رضا کریمی',
        assignedAgentAgency: 'دفتر املاک امین کد ۷۴۸',
        currentStep: 1,
        status: 'active',
        expertAppraisalPrice: Math.round(targetProp.price * 0.98),
        commissionEstimate: Math.round(targetProp.price * 0.005),
        createdAt: 'امروز',
        lastUpdate: 'هم‌اکنون',
        confidentialNotes: ['ورود خریدار به اتاق معامله محرمانه ثبت گردید.'],
        steps: [
          { stepNumber: 1, title: 'استعلام اسناد و هویت', description: 'بررسی اصل سند و استعلام الکترونیک ثبت', completed: false, active: true, date: 'امروز' },
          { stepNumber: 2, title: 'ارزیابی و قیمت‌گذاری کارشناسی', description: 'بازدید کارشناس پیوند ساخت و تعیین قیمت عادلانه روز', completed: false, active: false },
          { stepNumber: 3, title: 'تنظیم پیش‌نویس محرمانه', description: 'توافق نحوه پرداخت و شروط طرفین', completed: false, active: false },
          { stepNumber: 4, title: 'ارجاع به املاک امین', description: 'ارسال مدارک به دفتر املاک امین جهت ثبت کد رهگیری', completed: false, active: false },
          { stepNumber: 5, title: 'امضای نهایی و کمیسیون', description: 'امضای مبایعه‌نامه رسمی و تسویه کمیسیون مصوب', completed: false, active: false },
        ],
        documents: [
          { id: 'd1', title: 'سند تک‌برگ ملک', type: 'سند ملکی', verified: true },
          { id: 'd2', title: 'استعلام ثبتی عدم بازداشتی', type: 'استعلام', verified: true },
        ],
      };

      setDealRooms([newRoom, ...dealRooms]);
    }

    setActiveTab('deal_room');
  };

  const handleAddProperty = (newPropPartial: Partial<Property>) => {
    const newProp: Property = {
      id: `p-${Date.now()}`,
      code: `PYS-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newPropPartial.title || 'فایل ملک اعتبارسنجی‌شده',
      dealType: newPropPartial.dealType || 'sale',
      propertyType: newPropPartial.propertyType || 'apartment',
      city: newPropPartial.city || 'تهران',
      district: newPropPartial.district || 'سعادت‌آباد',
      price: newPropPartial.price || 30000000000,
      pricePerMeter: newPropPartial.pricePerMeter || 150000000,
      area: newPropPartial.area || 150,
      rooms: newPropPartial.rooms || 3,
      year: 1403,
      verifiedStatus: 'pending',
      images: newPropPartial.images || ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'],
      features: newPropPartial.features || ['مستر‌روم', 'پارکینگ'],
      description: newPropPartial.description || 'فایل ملک ثبت‌شده جهت اعتبارسنجی.',
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerPhone: currentUser.phone,
      documentType: 'سند تک‌برگ شش‌دانگ',
      createdAt: 'امروز',
      rating: 5,
      viewsCount: 1,
    };

    setProperties([newProp, ...properties]);
  };

  const handleVerifyProperty = (id: string) => {
    setProperties(properties.map((p) => p.id === id ? { ...p, verifiedStatus: 'verified' } : p));
    alert('فایل ملک با موفقیت اعتبارسنجی شد و نشان سلامت دریافت کرد.');
  };

  const handleRejectProperty = (id: string) => {
    setProperties(properties.map((p) => p.id === id ? { ...p, verifiedStatus: 'rejected' } : p));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col relative overflow-x-hidden">
      
      {/* Background ambient lighting orbs for Glassmorphism reflections */}
      <div className="fixed top-0 right-1/4 w-96 h-96 ambient-glow-amber pointer-events-none z-0" />
      <div className="fixed top-1/3 left-10 w-96 h-96 ambient-glow-emerald pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-96 h-96 ambient-glow-blue pointer-events-none z-0" />

      {/* Top Bar Header */}
      <Header
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        currentUser={currentUser}
        onOpenNotifications={() => setActiveTab('notifications')}
        unreadCount={unreadNotificationsCount}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenLiveFeed={() => setIsLiveFeedModalOpen(true)}
        isLiveActive={isLiveActive}
        onOpenMoreMenu={() => setIsMoreMenuSheetOpen(true)}
      />

      {/* Real-time Streaming Ticker Bar */}
      <LiveTickerBar
        tickerItems={tickerItems}
        isLiveActive={isLiveActive}
        onToggleLive={() => setIsLiveActive(!isLiveActive)}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
        onOpenLiveFeed={() => setIsLiveFeedModalOpen(true)}
        liveEventsCount={liveEvents.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 pb-28 md:pb-12 relative z-10">
        
        {/* Render Tab Content */}
        {activeTab === 'home' && (
          <HomeDashboard
            currentUser={currentUser}
            activeRole={activeRole}
            properties={properties}
            priceIndices={mockPriceIndices}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSelectProperty={handleSelectProperty}
            onEnterDealRoom={handleEnterDealRoom}
            liveEvents={liveEvents}
            onOpenLiveFeed={() => setIsLiveFeedModalOpen(true)}
          />
        )}

        {activeTab === 'market' && (
          <MarketplacePage
            properties={properties}
            onSelectProperty={handleSelectProperty}
            onEnterDealRoom={handleEnterDealRoom}
            searchQuery={searchQuery}
            onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
          />
        )}

        {activeTab === 'deal_room' && (
          <DealRoomPage dealRooms={dealRooms} />
        )}

        {activeTab === 'rate_cutter' && (
          <RateCutterPage
            properties={properties}
            onSelectProperty={handleSelectProperty}
            onEnterDealRoom={handleEnterDealRoom}
          />
        )}

        {activeTab === 'barter' && (
          <BarterPage
            onOpenBarterOfferModal={() => {
              setSubmitModalType('barter');
              setIsSubmitModalOpen(true);
            }}
          />
        )}

        {activeTab === 'partnership' && (
          <PartnershipPage
            onOpenPartnershipModal={() => {
              setSubmitModalType('partnership');
              setIsSubmitModalOpen(true);
            }}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialsMarketPage
            onOpenMaterialQuoteModal={() => {
              setSubmitModalType('material_quote');
              setIsSubmitModalOpen(true);
            }}
          />
        )}

        {activeTab === 'craftsmen' && <CraftsmenPage />}

        {activeTab === 'price_data' && <PriceDataCenterPage />}

        {activeTab === 'property_detail' && selectedProperty && (
          <PropertyDetailPage
            property={selectedProperty}
            onBack={() => setActiveTab('market')}
            onEnterDealRoom={handleEnterDealRoom}
          />
        )}

        {activeTab === 'role_dashboard' && (
          <RoleDashboardPage
            currentUser={currentUser}
            activeRole={activeRole}
            properties={properties}
            onOpenRegisterProperty={() => {
              setSubmitModalType('property');
              setIsSubmitModalOpen(true);
            }}
            onOpenMaterialQuote={() => {
              setSubmitModalType('material_quote');
              setIsSubmitModalOpen(true);
            }}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'admin_panel' && (
          <AdminPanelPage
            properties={properties}
            onVerifyProperty={handleVerifyProperty}
            onRejectProperty={handleRejectProperty}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsPage
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllNotificationsRead}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            activeRole={activeRole}
            onRoleChange={handleRoleChange}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

      </main>

      {/* Floating Action Button (FAB) for Mobile and Quick Submissions */}
      <FAB
        onOpenRegisterProperty={() => {
          setSubmitModalType('property');
          setIsSubmitModalOpen(true);
        }}
        onOpenMaterialQuote={() => {
          setSubmitModalType('material_quote');
          setIsSubmitModalOpen(true);
        }}
        onOpenBarterOffer={() => {
          setSubmitModalType('barter');
          setIsSubmitModalOpen(true);
        }}
        onOpenPartnership={() => {
          setSubmitModalType('partnership');
          setIsSubmitModalOpen(true);
        }}
      />

      {/* Android Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setIsMoreMenuSheetOpen(false);
          setActiveTab(tab);
        }}
        activeDealRoomsCount={activeDealRoomsCount}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenMoreMenu={() => setIsMoreMenuSheetOpen(prev => !prev)}
        isMoreMenuOpen={isMoreMenuSheetOpen}
      />

      {/* 3D Animated More Menu Bottom Sheet */}
      <MoreMenuSheet
        isOpen={isMoreMenuSheetOpen}
        onClose={() => setIsMoreMenuSheetOpen(false)}
        onNavigateTab={(tab) => {
          setIsMoreMenuSheetOpen(false);
          setActiveTab(tab);
        }}
        onOpenLiveFeed={() => {
          setIsMoreMenuSheetOpen(false);
          setIsLiveFeedModalOpen(true);
        }}
        activeRole={activeRole}
        activeTab={activeTab}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Filter Bottom Sheet Modal */}
      <BottomSheetModal
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        title="فیلترهای پیشرفته جستجوی املاک و مصالح"
        subtitle="محدودسازی نتایج بر اساس شهر، نوع معامله و اعتبارسنجی"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">انتخاب شهر:</label>
            <select
              value={selectedCityFilter}
              onChange={(e) => setSelectedCityFilter(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/15 rounded-xl p-3 text-white font-bold focus:outline-none focus:border-amber-400"
            >
              <option value="all" className="bg-slate-900 text-white">همه شهرها (تهران، اصفهان، مازندران)</option>
              <option value="تهران" className="bg-slate-900 text-white">تهران</option>
              <option value="اصفهان" className="bg-slate-900 text-white">اصفهان</option>
              <option value="مازندران" className="bg-slate-900 text-white">مازندران</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">وضعیت اعتبارسنجی اسناد:</label>
            <div className="space-y-2.5">
              <label className="flex items-center gap-2.5 text-slate-200 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-amber-400 w-4 h-4" />
                <span>فقط فایل‌های سالم و تأییدشده حقوقی</span>
              </label>
              <label className="flex items-center gap-2.5 text-slate-200 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-amber-400 w-4 h-4" />
                <span>دارای گزارش ارزیابی کارشناسی روز</span>
              </label>
            </div>
          </div>

          <button
            onClick={() => setIsFilterSheetOpen(false)}
            className="w-full btn-3d-amber text-slate-950 font-black py-3.5 rounded-xl text-xs cursor-pointer border border-amber-300/50"
          >
            اعمال فیلترها
          </button>
        </div>
      </BottomSheetModal>

      {/* Multipurpose Submission Stepper Modal */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        type={submitModalType}
        onSubmitProperty={handleAddProperty}
      />

      {/* Real-time Interactive Live Feed Modal */}
      <LiveActivityModal
        isOpen={isLiveFeedModalOpen}
        onClose={() => setIsLiveFeedModalOpen(false)}
        events={liveEvents}
        tickerItems={tickerItems}
        isLiveActive={isLiveActive}
        onToggleLive={() => setIsLiveActive(!isLiveActive)}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
        onEmitCustomEvent={handleEmitCustomLiveEvent}
        onNavigateTab={(tab) => {
          setIsLiveFeedModalOpen(false);
          setActiveTab(tab);
        }}
      />

    </div>
  );
}

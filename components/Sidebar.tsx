'use client'; // Tambahkan ini di baris pertama

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, LanguageIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, PencilIcon, DocumentTextIcon, BookOpenIcon, CodeBracketIcon, PhotoIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isMobile }) => {
  const pathname = usePathname();
  const menuItems = [
    { name: 'Home', icon: HomeIcon, href: '/' },
    { name: 'Translate', icon: LanguageIcon, href: '/translate' },
    { name: 'Message Replier', icon: ChatBubbleLeftRightIcon, href: '/message-replier' },
    { name: 'Email', icon: EnvelopeIcon, href: '/email' },
    { name: 'Grammar', icon: PencilIcon, href: '/grammar' },
    { name: 'Summarizer', icon: DocumentTextIcon, href: '/summarizer' },
    { name: 'Thesis Title Generator', icon: BookOpenIcon, href: '/thesis-title-generator' },
    { name: 'Pull Request Description', icon: CodeBracketIcon, href: '/pull-request-description' },
    { name: 'Caption Generator', icon: PhotoIcon, href: '/caption-generator' },
    { name: 'Fill the Blank', icon: MagnifyingGlassIcon, href: '/fill-the-blank' },
  ];

  return (
    <>
      <aside 
        className={`bg-gray-900 text-white transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-0'
        } ${isMobile ? 'fixed left-0 top-0 h-full z-50' : 'relative'} flex flex-col shadow-lg overflow-hidden`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h1 className="text-2xl font-bold text-blue-400 font-sans">AI-ssistant</h1>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-white hover:bg-gray-800"
            >
              <XMarkIcon className="h-6 w-6" />
            </Button>
          )}
        </div>
        <ScrollArea className="flex-grow">
          <nav className="space-y-1 p-4">
            {menuItems.map((item) => (
              <Link key={item.name} href={item.href} passHref>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-white hover:bg-gray-800 transition-colors duration-200 px-4 ${pathname === item.href ? 'bg-gray-800 text-blue-400' : ''}`}
                  onClick={isMobile ? toggleSidebar : undefined}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="truncate font-medium">{item.name}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </aside>
    </>
  );
};

export default Sidebar;

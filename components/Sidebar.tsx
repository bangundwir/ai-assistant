import Link from 'next/link';
import { HomeIcon, LanguageIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, PencilIcon, DocumentTextIcon, BookOpenIcon, CodeBracketIcon, PhotoIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
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
    <aside className="w-64 bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">AI-ssistant</h1>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link href={item.href} className="flex items-center p-2 rounded hover:bg-gray-800">
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

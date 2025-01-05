'use client';

import { Brain, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/firebase/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TopNavProps {
  onSearch?: (query: string) => void;
}

export function TopNav({ onSearch }: TopNavProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 mr-8">
          <Brain className="h-6 w-6" />
          <span className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Idea Board
          </span>
        </Link>

        <div className="flex-1">
          <form>
            <div className="relative">
              <Input
                placeholder="Search projects..."
                className="w-[300px] pl-8"
                onChange={handleSearch}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </form>
        </div>

        {user && (
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right mr-2">
              <p className="text-sm font-medium leading-none">{user.displayName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
            <Link href="/profile">
              <Avatar>
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                <AvatarFallback>
                  {user.displayName?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 
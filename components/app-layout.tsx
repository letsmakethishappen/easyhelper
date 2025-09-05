'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Car, 
  History, 
  Settings, 
  CreditCard,
  Menu,
  X,
  Wrench,
  LogOut,
  User,
  Home,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Show demo mode when no user is logged in
  const isDemoMode = !user;

  const primaryNavigation = [
    { name: 'Dashboard', href: '/app', icon: Home },
    { name: 'Ask Question', href: '/app/ask', icon: MessageSquare },
    { name: 'My Vehicles', href: '/app/vehicles', icon: Car },
    { name: 'History', href: '/app/history', icon: History },
  ];

  const secondaryNavigation = [
    { name: 'Billing', href: '/app/billing', icon: CreditCard },
    { name: 'Settings', href: '/app/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between px-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">CarHelper</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 px-6 py-6">
              <ul className="space-y-2">
                {isDemoMode && (
                  <li className="mb-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-900">Demo Mode</span>
                      </div>
                      <p className="text-xs text-blue-700 mb-3">
                        You're using CarHelper.ai in demo mode. Sign up for full access!
                      </p>
                      <Button size="sm" asChild className="w-full">
                        <Link href="/auth/sign-up">Sign Up Free</Link>
                      </Button>
                    </div>
                  </li>
                )}
                {primaryNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all",
                        pathname === item.href
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li className="pt-4 border-t border-gray-200">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-4">
                    Account
                  </div>
                  {secondaryNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all",
                        pathname === item.href
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  ))}
                </li>
              </ul>
            </nav>
            <div className="border-t p-6">
              {isDemoMode ? (
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">Ready to get started?</p>
                    <div className="space-y-2">
                      <Button size="sm" asChild className="w-full">
                        <Link href="/auth/sign-up">Sign Up</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link href="/auth/sign-in">Sign In</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
                      <Badge variant="outline" className="text-xs">Free Plan</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={signOut} className="w-full justify-start rounded-xl">
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300",
        sidebarCollapsed ? "lg:w-16" : "lg:w-72"
      )}>
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            {!sidebarCollapsed && (
              <Link href="/" className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">CarHelper</span>
              </Link>
            )}
            {sidebarCollapsed && (
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
                <Wrench className="h-5 w-5 text-white" />
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn("hidden lg:flex", sidebarCollapsed && "mx-auto")}
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
          
          <nav className="flex-1 px-3 py-6">
            <ul className="space-y-2">
              {primaryNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all group",
                      pathname === item.href
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    )}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <item.icon className={cn("h-5 w-5", sidebarCollapsed ? "mx-auto" : "mr-3")} />
                    {!sidebarCollapsed && item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="border-t border-gray-200 p-3">
            {!sidebarCollapsed ? (
              <div className="space-y-4">
                {isDemoMode ? (
                  <div className="px-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                      <p className="text-xs text-blue-700 mb-2">Demo Mode</p>
                      <div className="space-y-2">
                        <Button size="sm" asChild className="w-full text-xs h-8">
                          <Link href="/auth/sign-up">Sign Up</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild className="w-full text-xs h-8">
                          <Link href="/auth/sign-in">Sign In</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 px-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
                      <Badge variant="outline" className="text-xs">Free Plan</Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {secondaryNavigation.map((item) => (
                          <DropdownMenuItem key={item.name} asChild>
                            <Link href={item.href} className="flex items-center">
                              <item.icon className="h-4 w-4 mr-2" />
                              {item.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={signOut} className="text-red-600">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                {isDemoMode ? (
                  <div className="text-center">
                    <Button size="sm" asChild className="mb-2">
                      <Link href="/auth/sign-up">Sign Up</Link>
                    </Button>
                  </div>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="px-2 py-1.5 text-sm font-semibold">{user?.name || 'User'}</div>
                      <DropdownMenuSeparator />
                      {secondaryNavigation.map((item) => (
                        <DropdownMenuItem key={item.name} asChild>
                          <Link href={item.href} className="flex items-center">
                            <item.icon className="h-4 w-4 mr-2" />
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut} className="text-red-600">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "lg:pl-16" : "lg:pl-72"
      )}>
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex h-16 items-center justify-between px-6 border-b bg-white">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="h-6 w-6 bg-blue-600 rounded-lg flex items-center justify-center">
                <Wrench className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">CarHelper</span>
            </div>
            <div />
          </div>
        </div>

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
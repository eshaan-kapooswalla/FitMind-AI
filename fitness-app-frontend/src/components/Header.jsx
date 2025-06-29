import { useState } from 'react'
import { Menu, Bell, Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-lg lg:max-w-xs">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search activities..."
                type="search"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700">
              <Bell className="h-6 w-6" />
            </button>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-700">{user?.name || 'User'}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-700 font-medium text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <a
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Dashboard
            </a>
            <a
              href="/activities"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Activities
            </a>
            <a
              href="/activities/add"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Add Activity
            </a>
            <a
              href="/recommendations"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Recommendations
            </a>
            <a
              href="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Profile
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header 
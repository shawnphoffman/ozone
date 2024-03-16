'use client'
import { useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { SidebarNav } from './SidebarNav'
import { MobileMenuProvider, MobileMenu, MobileMenuBtn } from './MobileMenu'
import { ProfileMenu } from './ProfileMenu'
import { LoginModal } from './LoginModal'

import { useCommandPaletteAsyncSearch } from './CommandPalette/useAsyncSearch'
import { useFluentReportSearch } from '@/reports/useFluentReportSearch'
import { useSyncedState } from '@/lib/useSyncedState'
// import Image from 'next/image'
import { Suspense } from 'react'
import { useColorScheme } from '@/common/useColorScheme'

export function Shell({ children }: React.PropsWithChildren) {
  useCommandPaletteAsyncSearch()
  const { theme, toggleTheme } = useColorScheme()

  return (
    <MobileMenuProvider>
      <LoginModal />
      <div className="flex h-full">
        {/* Narrow sidebar */}
        <div className="hidden overflow-y-auto w-28 bg-rose-700 dark:bg-teal-800 md:block">
          <div className="flex flex-col items-center w-full py-6">
            <div className="flex items-center flex-shrink-0">
              {/* <Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                width={100}
                height={100}
                className="w-auto h-8"
                src="https://ozone.shawnhoffman.dev/img/logo-white.png"
                alt="Ozone - Bluesky Admin"
                title="Icon from Flaticon: https://www.flaticon.com/free-icons/lifeguard-tower"
              />
            </div>
            <SidebarNav {...{ theme, toggleTheme }} />
          </div>
        </div>

        {/* Mobile menu */}
        <MobileMenu toggleTheme={toggleTheme} />

        {/* Content area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="w-full">
            <div className="relative z-10 flex flex-shrink-0 h-16 bg-white border-b border-gray-200 dark:border-slate-600 dark:bg-slate-900">
              <MobileMenuBtn />
              <div className="flex justify-between flex-1 px-4 sm:px-6">
                <div className="flex flex-1">
                  <form className="flex w-full md:ml-0" action="#" method="GET">
                    <label htmlFor="search-field" className="sr-only">
                      Search
                    </label>
                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon
                          className="flex-shrink-0 w-5 h-5"
                          aria-hidden="true"
                        />
                      </div>
                      {/* This is only needed because we use useSearchParams inside this component */}
                      <Suspense fallback={<div></div>}>
                        <SearchInput />
                      </Suspense>
                    </div>
                  </form>
                </div>
                <div className="flex items-center ml-2 space-x-4 sm:ml-6 sm:space-x-6">
                  {/* Profile dropdown */}
                  <ProfileMenu />
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="flex items-stretch flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto dark:bg-slate-900">
              {/* Primary column */}
              <section
                aria-labelledby="primary-heading"
                className="flex flex-col flex-1 h-full min-w-0 lg:order-last"
              >
                {children}
              </section>
            </main>
          </div>
        </div>
      </div>
    </MobileMenuProvider>
  )
}

function SearchInput() {
  const params = useSearchParams()
  const { updateParams } = useFluentReportSearch()
  const [termInput, setTermInput] = useSyncedState(params.get('term') ?? '')

  return (
    <input
      id="term"
      name="term"
      className="w-full h-full py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 border-transparent focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 dark:bg-slate-900 dark:text-gray-100"
      placeholder="Search"
      type="search"
      value={termInput}
      onChange={(ev) => {
        setTermInput(ev.target.value)
        updateParams(ev.target.value)
      }}
    />
  )
}

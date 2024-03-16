'use client'

import { Fragment, createContext, useContext, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'
import { Bars3BottomLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { classNames } from '@/lib/util'
import { useSession } from '@/lib/useSession'
import { ICONS, NAV_ITEMS, isCurrent } from './common'
// import Image from 'next/image'
import { useKBar } from 'kbar'

interface MobileMenuOpen {
  open: boolean
  set: (v: boolean) => void
}
const MobileMenuOpenCtx = createContext<MobileMenuOpen>({
  open: false,
  set: (v: boolean) => {},
})

export function MobileMenuProvider({ children }: React.PropsWithChildren) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const value = { open: mobileMenuOpen, set: setMobileMenuOpen }
  return (
    <MobileMenuOpenCtx.Provider value={value}>
      {children}
    </MobileMenuOpenCtx.Provider>
  )
}

export function MobileMenuBtn() {
  const mobileMenuOpen = useContext(MobileMenuOpenCtx)
  return (
    <button
      type="button"
      className="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500 md:hidden"
      onClick={() => mobileMenuOpen.set(true)}
    >
      <span className="sr-only">Open sidebar</span>
      <Bars3BottomLeftIcon className="w-6 h-6" aria-hidden="true" />
    </button>
  )
}

export function MobileMenu({ toggleTheme }: { toggleTheme: () => void }) {
  const pathname = usePathname() || '/'
  const mobileMenuOpen = useContext(MobileMenuOpenCtx)
  const kbar = useKBar()
  const session = useSession()
  const isServiceAccount = !!session && session.did === session.config.did
  return (
    <>
      {/* Mobile menu */}
      <Transition.Root show={mobileMenuOpen.open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20 md:hidden"
          onClose={mobileMenuOpen.set}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-rose-700 dark:bg-teal-700">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute right-0 p-1 top-1 -mr-14">
                    <button
                      type="button"
                      className="flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                      onClick={() => mobileMenuOpen.set(false)}
                    >
                      <XMarkIcon
                        className="w-6 h-6 text-white"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Close sidebar</span>
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex items-center flex-shrink-0 px-4">
                  {/* <Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    width={200}
                    height={200}
                    title="Icon from Flaticon: https://www.flaticon.com/free-icons/lifeguard-tower"
                    className="w-auto h-8"
                    src="https://ozone.shawnhoffman.dev/img/logo-white.png"
                    alt="Ozone - Bluesky Admin"
                  />
                </div>
                <div className="flex-1 h-0 px-2 mt-5 overflow-y-auto">
                  <nav className="flex flex-col h-full">
                    <div className="space-y-1">
                      {NAV_ITEMS.map((item) => {
                        if (item.serviceAccountOnly && !isServiceAccount) {
                          return
                        }
                        const Icon = ICONS[item.icon]
                        const children = (
                          <>
                            <Icon
                              className={classNames(
                                isCurrent(pathname, item)
                                  ? 'text-white'
                                  : 'text-rose-300 dark:text-teal-300 group-hover:text-white',
                                'mr-3 h-6 w-6',
                              )}
                              aria-hidden="true"
                            />
                            <span>{item.name}</span>
                          </>
                        )
                        if ('href' in item) {
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                isCurrent(pathname, item)
                                  ? 'bg-rose-800 dark:bg-teal-800 text-white'
                                  : 'text-rose-100 dark:text-teal-100 hover:bg-rose-800 dark:hover:bg-teal-800 hover:text-white',
                                'group py-2 px-3 rounded-md flex items-center text-sm font-medium',
                              )}
                              aria-current={
                                isCurrent(pathname, item) ? 'page' : undefined
                              }
                            >
                              {children}
                            </Link>
                          )
                        }

                        return (
                          <button
                            key={item.name}
                            className={classNames(
                              isCurrent(pathname, item)
                                ? 'bg-rose-800 text-white'
                                : 'text-rose-100 hover:bg-rose-800 hover:text-white',
                              'group py-2 px-3 rounded-md flex items-center text-sm font-medium',
                            )}
                            onClick={(e) => {
                              mobileMenuOpen.set(false)
                              if ('onClick' in item)
                                item.onClick({ kbar, toggleTheme })?.(e)
                            }}
                          >
                            {children}
                          </button>
                        )
                      })}
                    </div>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

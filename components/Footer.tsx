import React from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <div>
      <footer className="mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="grid grid-cols-2 gap-8 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase">
                    Solutions
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-base"
                      >
                        Link Management
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base"
                      >
                        Analytics
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base"
                      >
                        Social Media Integration
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold tracking-wider uppercase">
                    Support
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-base"
                      >
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base"
                      >
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base"
                      >
                        API Status
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase">
                    Company
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-base"
                      >
                        About
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base"
                      >
                        Blog
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base"
                      >
                        Careers
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold tracking-wider uppercase">
                    Legal
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link href="/privacy" className="text-base">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base"
                      >
                        Terms
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 xl:mt-0">
              <h3 className="text-sm font-semibold tracking-wider uppercase">
                Subscribe to our newsletter
              </h3>
              <p className="mt-4 text-base">
                The latest news, articles, and resources, sent to your inbox
                weekly.
              </p>
              <form className="mt-4 sm:flex sm:max-w-md">
                <Input
                  type="email"
                  name="email-address"
                  id="email-address"
                  required
                  className="w-full min-w-0 px-4 py-2 text-base border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white focus:border-white"
                  placeholder="Enter your email"
                />
                <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                  <Button
                    type="submit"
                    className="w-full hover:bg-blue-700"
                  >
                    Subscribe
                  </Button>
                </div>
              </form>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="#" className="hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" aria-hidden="true" />
              </a>
              <a href="#" className="hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" aria-hidden="true" />
              </a>
              <a href="#" className="hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" aria-hidden="true" />
              </a>
              <a href="#" className="hover:text-gray-300">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" aria-hidden="true" />
              </a>
            </div>
            <p className="mt-8 text-base md:mt-0 md:order-1">
              &copy; 2023 Chebe Social, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer
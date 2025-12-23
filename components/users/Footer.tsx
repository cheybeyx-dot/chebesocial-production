import React from "react";

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
                      <a href="#" className="text-base">
                        Link Management
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base">
                        Analytics
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base">
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
                      <a href="#" className="text-base">
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base">
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base">
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
                      <a href="#" className="text-base">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base">
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
                      <Dialog>
                        <DialogTrigger className="text-base text-left block w-full">
                          Terms & Conditions
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Terms and Conditions</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4 space-y-6">
                            <section>
                              <h2 className="text-lg font-semibold">
                                Terms of Service
                              </h2>
                              <p>
                                By placing an order with Chebe Social, you
                                automatically accept these Terms of Service,
                                whether you read them or not. We reserve the
                                right to modify these terms without notice.
                              </p>
                            </section>

                            <section>
                              <h3 className="text-md font-semibold">General</h3>
                              <ol className="list-decimal pl-5 space-y-2 mt-2">
                                <li>
                                  <strong>Acceptance:</strong> By using our
                                  website, you agree to these Terms of Service.
                                </li>
                                <li>
                                  <strong>Compliance:</strong> You must comply
                                  with the Terms of Service of all social media
                                  platforms.
                                </li>
                                <li>
                                  <strong>Rates:</strong> Our rates are subject
                                  to change without notice.
                                </li>
                                <li>
                                  <strong>Delivery:</strong> We do not guarantee
                                  delivery times and will not refund orders in
                                  progress.
                                </li>
                                <li>
                                  <strong>Service Changes:</strong> We reserve
                                  the right to modify services to complete an
                                  order.
                                </li>
                              </ol>
                            </section>

                            <section>
                              <h3 className="text-md font-semibold">
                                Disclaimer
                              </h3>
                              <p>
                                Chebe Social is not responsible for any damages
                                or losses resulting from our services.
                              </p>
                            </section>

                            <section>
                              <h3 className="text-md font-semibold">
                                Liabilities
                              </h3>
                              <p>
                                We are not liable for account suspensions or
                                content removal by social media platforms. As
                                our services are not harmful to social media
                                accounts! Ensure your contents are following
                                social media (Facebook, YouTube, Instagram,
                                TikTok, and many more) community guidelines.
                              </p>
                            </section>

                            <section>
                              <h3 className="text-md font-semibold">
                                Services
                              </h3>
                              <ol className="list-decimal pl-5 space-y-2 mt-2">
                                <li>
                                  <strong>Purpose:</strong> Our services promote
                                  your social media presence.
                                </li>
                                <li>
                                  <strong>No Guarantee:</strong> We do not
                                  guarantee engagement or interaction from new
                                  followers.
                                </li>
                                <li>
                                  <strong>Account Quality:</strong> We strive to
                                  provide high-quality accounts, but cannot
                                  guarantee 100% profile completeness.
                                </li>
                                <li>
                                  <strong>Content Restrictions:</strong> You
                                  must not upload prohibited content.
                                </li>
                              </ol>
                            </section>

                            <section>
                              <h3 className="text-md font-semibold">
                                Refund Policy
                              </h3>
                              <ol className="list-decimal pl-5 space-y-2 mt-2">
                                <li>
                                  <strong>No Refunds:</strong> No refunds will
                                  be made for placed orders.
                                </li>
                                <li>
                                  <strong>Withdrawal:</strong> Referral bonuses
                                  can be withdrawn using our site.
                                </li>
                                <li>
                                  <strong>Disputes:</strong> Filing disputes or
                                  chargebacks may result in account termination.
                                </li>
                              </ol>
                            </section>

                            <section>
                              <h3 className="text-md font-semibold">Privacy</h3>
                              <p>
                                We take your privacy seriously and will protect
                                your personal information.
                              </p>
                            </section>

                            <section>
                              <h3 className="text-md font-semibold">
                                Important Notes
                              </h3>
                              <ol className="list-decimal pl-5 space-y-2 mt-2">
                                <li>
                                  <strong>Flag for Review:</strong> Turn off
                                  Flag for Review before ordering Instagram
                                  followers.
                                </li>
                                <li>
                                  <strong>Payment:</strong> Always use a new
                                  account number for deposits. And do not save
                                  our account number because it changes every
                                  few minutes and aren&apos;t allowed to use
                                  twice.
                                </li>
                              </ol>
                            </section>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </li>
                    <li>
                      <a href="#" className="text-base">
                        Privacy
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
                  <Button type="submit" className="w-full hover:bg-blue-700">
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
};

export default Footer;

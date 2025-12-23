"use client";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <>
      <div className="relative overflow-hidden bg-background text-foreground">
        <div className="relative overflow-hidden">
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-x-16 lg:items-center">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  Boost Your Online Presence
                  <span className="block">With Chebe Social</span>
                </h1>
                <p className="mt-6 text-xl leading-8">
                  Simplify your social media management and increase your reach.
                  Share all your content with just one powerful link.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link href="/users/dashboard" className="flex flex-row link-button justify-center align-center font-semibold">
                    Get Started
                    <ArrowRight />
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-50"
                    aria-hidden="true"
                  />
                </div>
                <Image
                  src="/assets/images/smartphone-social-media-2.jpg"
                  alt="Classic Media mobile app"
                  className="relative mx-auto w-full max-w-lg rounded-2xl shadow-xl ring-1 ring-white/10"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-background text-foreground">
        <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="relative lg:grid lg:grid-cols-3 lg:gap-x-8">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Boost all your social handles
              </h2>
            </div>
            <div className="mt-10 sm:mt-0 lg:col-span-2">
              <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
                <div className="text-center">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mx-auto">
                    <Facebook className="h-10 w-10" />
                  </div>
                  <h3 className="mt-2 text-lg font-medium">Facebook</h3>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-400 mx-auto">
                    <Twitter className="h-10 w-10" />
                  </div>
                  <h3 className="mt-2 text-lg font-medium">Twitter</h3>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-pink-100 text-pink-600 mx-auto">
                    <Instagram className="h-10 w-10" />
                  </div>
                  <h3 className="mt-2 text-lg font-medium">Instagram</h3>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-800 mx-auto">
                    <Linkedin className="h-10 w-10" />
                  </div>
                  <h3 className="mt-2 text-lg font-medium">LinkedIn</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;

"use client";
import React from "react";
import SearchForm from "./SearchForm";
import Image from "next/image";
import Link from "next/link";

export default function SearchBar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-content-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              style={{ cursor: "pointer" }}
              className="text-2xl font-bold text-blaze"
            >
              TrailBlaze
            </Link>
          </div>
          <div className="flex-shrink-0 flex items-center col-lg-8 col-6">
            <SearchForm />
          </div>
          <div className="flex-shrink-0 flex items-center">
            <Image
              src="/images/user-icon.png"
              width="50"
              height="50"
              alt="profile image"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

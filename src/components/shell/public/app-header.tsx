"use client";

import Image from "next/image";

export function PublicHeader() {
  return (
    <header className="bg-main flex h-(--header-height) shrink-0 items-center gap-2 border-b py-8 text-white transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="lg: flex w-full items-center gap-1 px-4 py-4 lg:gap-2 lg:px-6">
        <div className="mx-auto flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={300} height={150} />
        </div>
      </div>
    </header>
  );
}

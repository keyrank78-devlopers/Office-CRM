import React from "react";
import { BrandMark } from "../components/brand/BrandMark";
import { useBrand } from "../context/BrandContext";

export const AuthLayout = ({ children }) => {
  const { brand } = useBrand();
  const companyName = brand.companyName || "AK Techs";

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      {/* Left Panel - Branding (Hidden on mobile/tablet) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-emerald-900 to-teal-700 flex-col justify-between p-12 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-emerald-500/40 blur-3xl"></div>
          <div className="absolute top-24 -right-16 h-72 w-72 rounded-full bg-lime-400/25 blur-3xl"></div>
          <div className="absolute -bottom-24 left-16 h-80 w-80 rounded-full bg-sky-500/25 blur-3xl"></div>
        </div>

        {/* Logo area */}
        <BrandMark tone="dark" className="relative z-10" />

        {/* Main messaging */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            Catalog, staff, and permissions in one place.
          </h2>
          <p className="text-emerald-100 text-lg leading-relaxed font-normal">
            Manage departments, employees, categories, and products from a single dashboard.
          </p>
        </div>
        
        {/* Minimal Footer */}
        <div className="relative z-10 text-sm text-emerald-200 font-medium">
          &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 relative bg-gradient-to-br from-white via-emerald-50/40 to-slate-50 transition-colors duration-300">
        {/* Mobile Logo (Visible only on small screens) */}
        <BrandMark className="absolute top-8 left-8 lg:hidden" />
        
        <div className="w-full max-w-[420px] pt-16 lg:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

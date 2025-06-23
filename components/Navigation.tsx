"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useSearch } from "../context/SearchContext";
import {
    XMarkIcon,
    Bars3Icon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import CartDropdown from "../components/CartDropDown";

export default function Navigation() {
    const { data: session } = useSession();
    const { search, setSearch } = useSearch();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const menuItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    const mobileMenuVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
        visible: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: "easeInOut",
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
                when: "afterChildren",
            },
        },
    };

    const searchVariants = {
        normal: { scale: 1 },
        focused: { scale: 1.02 },
        hover: { scale: 1.01 },
    };

    return (
        <motion.nav
            className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl backdrop-blur-xl border-b border-white/10"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Animated background overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 1, 0.3],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="relative container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo và Search */}
                    <div className="flex items-center space-x-4 flex-1">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/"
                                className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100 text-2xl font-bold tracking-tight hover:from-blue-200 hover:to-purple-200 transition-all duration-300"
                            >
                                E-Commerce
                            </Link>
                        </motion.div>

                        {/* Search Bar */}
                        <motion.form
                            onSubmit={(e) => e.preventDefault()}
                            className="hidden sm:flex items-center flex-1 max-w-md"
                            variants={searchVariants}
                            initial="normal"
                            animate={isSearchFocused ? "focused" : "normal"}
                            whileHover="hover"
                        >
                            <div className="relative flex-1">
                                <motion.input
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className="w-full pl-4 pr-10 py-2 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:border-blue-400/50 focus:bg-white/20 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-300"
                                    whileFocus={{ scale: 1.02 }}
                                />
                                <motion.button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 text-blue-300 hover:text-blue-100 transition-colors duration-300"
                                    whileHover={{ scale: 1.1, rotate: 15 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <MagnifyingGlassIcon className="h-5 w-5" />
                                </motion.button>
                            </div>
                        </motion.form>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        className="md:hidden text-white focus:outline-none p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                        onClick={toggleMobileMenu}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <AnimatePresence mode="wait">
                            {isMobileMenuOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Bars3Icon className="h-6 w-6" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    {/* Desktop Menu */}
                    <motion.div
                        className="hidden md:flex items-center space-x-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {session && (
                            <>
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/products"
                                        className="text-white/90 hover:text-white transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
                                    >
                                        Sản phẩm
                                    </Link>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/orders"
                                        className="text-white/90 hover:text-white transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
                                    >
                                        Đơn hàng
                                    </Link>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/products/new"
                                        className="text-white/90 hover:text-white transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
                                    >
                                        Thêm sản phẩm
                                    </Link>
                                </motion.div>
                            </>
                        )}

                        <motion.div>
                            <CartDropdown />
                        </motion.div>

                        {session ? (
                            <motion.button
                                onClick={() => signOut()}
                                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/25"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Đăng xuất
                            </motion.button>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/auth/login"
                                        className="text-white/90 hover:text-white transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
                                    >
                                        Đăng nhập
                                    </Link>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/auth/register"
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
                                    >
                                        Đăng ký
                                    </Link>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    );
}

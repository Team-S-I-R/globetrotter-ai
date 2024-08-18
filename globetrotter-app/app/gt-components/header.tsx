'use client'

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import { motion } from "framer-motion"

export default function Header() {
    return (
    <>
    <motion.header 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 2.3 }}
    className="flex relative z-50 justify-between p-6 outline outline-[1px] w-screen">
    <a href="/" className="text-xl font-bold">Globetrotter</a>
    <a href="/about" className="text-xl font-bold">About</a>
    {/* <div></div> */}
    {/* <NavigationMenu>
        <NavigationMenuList>
            <NavigationMenuItem>
                <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <NavigationMenuLink>Link</NavigationMenuLink>
                </NavigationMenuContent>
            </NavigationMenuItem>
        </NavigationMenuList>
    </NavigationMenu> */}
    </motion.header>
    </>
    )
}
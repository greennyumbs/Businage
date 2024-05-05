"use client"
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";

function MenuButton(text, href, icon, pathname) {
    return (
      <Link href={href} className={clsx("w-full inline-block py-3 px-5 rounded-lg hover:bg-gray-200", {"bg-gray-200": pathname === href})} >
        <div className="flex gap-2">
          <Image src={"/sidebar/" + icon + ".svg"} width={15} height={15} className=" w-auto h-auto"></Image>
          {text}
  
        </div>
      </Link>
    )
  }

export default function Sidebar(){
    const pathname = usePathname();
    return (
        <nav className="fixed w-60 h-screen left-0 top-0 px-5 bg-white shadow-sm shadow-slate-300  overflow-auto z-20 ">


            <div className=" text-xl font-semibold h-20 pt-5">
              <div className="flex items-center space-x-3">
              
                <Image 
                  src="/assets/icon.png"
                  width={32}
                  height={32}
                  alt="Businage icon"

                />

              

                <div>
                  Businage

                </div>
              </div>
            </div>

            {/* Menus */}
            <ul className=" text-gray-400 text-xs">
              <li className="pt-10">
                PRODUCT
                <ul className=" pt-4 text-sm text-black">
                  <li className="flex-col space-y-2">
                    {MenuButton("Inventory", "/product-inventory", "dashboard", pathname)}
                    {MenuButton("Visualization", "/product-visualization", "visualization", pathname)}

                  </li>

                </ul>
              </li>

              <li className="pt-10">
                MONETARY
                <ul className=" pt-4 text-sm text-black">
                  <li className="flex-col space-y-2">
                    {MenuButton("Expense & Sale", "/monetary-expense-sale", "shop-cart", pathname)}

                    {MenuButton("Trade-In Income", "/monetary-tradein", "paper", pathname)}

                    {MenuButton("Visualization", "/monetary-visualization", "visualization", pathname)}
                    
                  </li>

                </ul>
              </li>
            </ul>



          </nav>
    )
}
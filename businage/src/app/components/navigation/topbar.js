"use client"
import { usePathname } from "next/navigation"

// At start, there is no path so cause error!!!!!

export default function Topbar() {
    const pathname = usePathname()
    const words = pathname.slice(1).split("-");
    // Debug for first visiting the page which cause no pathname exist 
    // By checking before display the value
    if(words.length > 1){
        if (words[1] == "expense") {
            words[1] = "Expense & Sale"
        }
        else if (words[1] == "tradein") {
            words[1] = "Trade-In Income"
        }
        else{
            words[1] = words[1][0].toUpperCase() + words[1].slice(1)
        }
    }
    else {
        words[1] = "Loading..."
    }
    

    return (
        <nav className="fixed top-0 z-10 w-screen h-14 flex gap-x-3  items-center pl-64 shadow-sm shadow-zinc-200 bg-white">
            <div className=" bg-black rounded-[0.2rem] py-2 px-3 text-white text-sm">
                {words[0].toUpperCase()}
            </div>
            <h1 className=" font-semibold">
                &gt;

            </h1>
            <div>
                {words[1]}
            </div>

        </nav>
    )
}
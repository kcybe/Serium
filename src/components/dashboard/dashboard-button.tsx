import { LayoutDashboard } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"

// Add this new component
export default function DashboardButton() {
  return (
    <Button variant="outline">
      <Link href='/dashboard' className='flex items-center'>
        <LayoutDashboard className="h-[1.2rem] w-[1.2rem]" />
        {/* <span className="ml-2">Dashboard</span> */}
      </Link>
    </Button>
  )
}


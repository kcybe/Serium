import React from 'react'
import { History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from "next/link"

export default function HistoryButton() {
  return (
    <Button variant="outline">
        <Link href="/history" className="flex items-center">
        <History className="h-[1.2rem] w-[1.2rem]" />
        {/* <span className="ml-2">History</span> */}
        </Link>
    </Button>
  )
}

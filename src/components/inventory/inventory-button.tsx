import React from 'react'
import { Table } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function InventoryButton() {
  return (
    <Button variant="outline">
          <Link href='/inventory' className='flex items-center'>
            <Table className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            <span className="ml-2">Inventory</span>
          </Link>
    </Button>
  )
}

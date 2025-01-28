import React from 'react'
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { SettingsDialog } from './dialogs/settings-dialog'

export default function SettingsButton() {
  return (
    <SettingsDialog />
  )
}

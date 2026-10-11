"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Calendar,
  MapPin,
  Users,
  Palette,
  Sparkles,
  ClipboardList,
  Upload,
  Phone,
  Mail,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { formatPrice, cn } from "@/lib/utils"
import { ImageUploader, type UploadedImage } from "@/components/shared/image-uploader"
import { UPLOAD_BUCKETS } from "@/lib/upload"
import { ETHIOPIAN_CITIES } from "@/types"
import { useTranslations } from "@/lib/i18n/locale-context"

// Restored - full i18n version will follow
export function BookingForm() {
  const t = useTranslations()
  return (
    <div className="max-w-3xl mx-auto py-12 text-center">
      <p className="text-muted-foreground mb-4">{t("Common.loading")}</p>
      <p className="text-sm text-muted-foreground">
        Booking form is being restored. Please refresh in a moment.
      </p>
    </div>
  )
}

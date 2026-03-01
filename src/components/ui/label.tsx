"use client"

import * as React from "react"
// ✅ เปลี่ยนมา Import แบบนี้เพื่อให้เรียกใช้ LabelPrimitive.Root ได้
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// เพิ่มการจัดการ Variants ตามมาตรฐาน shadcn
const labelVariants = cva(
  "text-sm font-medium leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    data-slot="label"
    className={cn(labelVariants(), className)}
    {...props}
  />
))

Label.displayName = LabelPrimitive.Root.displayName

export { Label }
"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface IllustrationProps {
  className?: string
  width?: string
  height?: string
}

// Adventurous Explorer - Mountain climber with backpack
export function AdventurousExplorerIllustration({
  className = "",
  width = "100%",
  height = "100%",
}: IllustrationProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.path
          d="M50,250 L200,50 L350,250 Z"
          fill="#8B5CF6"
          opacity="0.2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
        />
        <motion.path
          d="M100,250 L200,100 L300,250 Z"
          fill="#EC4899"
          opacity="0.3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.path
          d="M150,250 L200,150 L250,250 Z"
          fill="#F97316"
          opacity="0.4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
        <motion.circle
          cx="200"
          cy="180"
          r="15"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
        <motion.rect
          x="190"
          y="195"
          width="20"
          height="30"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        />
        <motion.rect
          x="185"
          y="210"
          width="30"
          height="15"
          fill="#F97316"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
      </svg>
    </div>
  )
}

// Cultural Nomad - Person with landmarks
export function CulturalNomadIllustration({ className = "", width = "100%", height = "100%" }: IllustrationProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.rect
          x="150"
          y="50"
          width="30"
          height="100"
          fill="#10B981"
          opacity="0.3"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 100, opacity: 0.3 }}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d="M150,50 L180,50 L165,20 Z"
          fill="#10B981"
          opacity="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        <motion.rect
          x="220"
          y="80"
          width="60"
          height="70"
          fill="#34D399"
          opacity="0.3"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 70, opacity: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.rect
          x="240"
          y="60"
          width="20"
          height="20"
          fill="#34D399"
          opacity="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
        <motion.circle
          cx="200"
          cy="180"
          r="15"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        />
        <motion.rect
          x="190"
          y="195"
          width="20"
          height="30"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        />
      </svg>
    </div>
  )
}

// Luxury Traveler - Person with champagne glass and luxury items
export function LuxuryTravelerIllustration({ className = "", width = "100%", height = "100%" }: IllustrationProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.rect
          x="120"
          y="150"
          width="160"
          height="80"
          rx="10"
          fill="#818CF8"
          opacity="0.3"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 160, opacity: 0.3 }}
          transition={{ duration: 0.8 }}
        />
        <motion.circle
          cx="200"
          cy="150"
          r="40"
          fill="#818CF8"
          opacity="0.2"
          initial={{ r: 0, opacity: 0 }}
          animate={{ r: 40, opacity: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.path
          d="M180,120 L220,120 L210,80 L190,80 Z"
          fill="#C4B5FD"
          opacity="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        <motion.circle
          cx="200"
          cy="110"
          r="15"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
        <motion.rect
          x="190"
          y="125"
          width="20"
          height="30"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        />
        <motion.circle
          cx="240"
          cy="180"
          r="10"
          fill="#C4B5FD"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        />
      </svg>
    </div>
  )
}

// Digital Explorer - Person with laptop and tech
export function DigitalExplorerIllustration({ className = "", width = "100%", height = "100%" }: IllustrationProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.rect
          x="150"
          y="150"
          width="100"
          height="60"
          rx="5"
          fill="#8B5CF6"
          opacity="0.3"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 100, opacity: 0.3 }}
          transition={{ duration: 0.8 }}
        />
        <motion.rect
          x="150"
          y="210"
          width="100"
          height="5"
          rx="2"
          fill="#8B5CF6"
          opacity="0.5"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 100, opacity: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.circle
          cx="200"
          cy="110"
          r="15"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        <motion.rect
          x="190"
          y="125"
          width="20"
          height="30"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        />
        <motion.circle
          cx="240"
          cy="100"
          r="10"
          fill="#C4B5FD"
          opacity="0.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
        <motion.circle
          cx="260"
          cy="120"
          r="8"
          fill="#C4B5FD"
          opacity="0.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        />
        <motion.circle
          cx="270"
          cy="100"
          r="6"
          fill="#C4B5FD"
          opacity="0.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        />
      </svg>
    </div>
  )
}

// Urban Adventurer - Person with city skyline
export function UrbanAdventurerIllustration({ className = "", width = "100%", height = "100%" }: IllustrationProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.rect
          x="120"
          y="150"
          width="30"
          height="100"
          fill="#6B7280"
          opacity="0.3"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 100, opacity: 0.3 }}
          transition={{ duration: 0.8 }}
        />
        <motion.rect
          x="150"
          y="120"
          width="20"
          height="130"
          fill="#6B7280"
          opacity="0.4"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 130, opacity: 0.4 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
        <motion.rect
          x="170"
          y="170"
          width="25"
          height="80"
          fill="#6B7280"
          opacity="0.3"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 80, opacity: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.rect
          x="195"
          y="100"
          width="35"
          height="150"
          fill="#6B7280"
          opacity="0.5"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 150, opacity: 0.5 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        <motion.rect
          x="230"
          y="140"
          width="25"
          height="110"
          fill="#6B7280"
          opacity="0.4"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 110, opacity: 0.4 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        <motion.rect
          x="255"
          y="160"
          width="30"
          height="90"
          fill="#6B7280"
          opacity="0.3"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 90, opacity: 0.3 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
        <motion.circle
          cx="170"
          cy="150"
          r="15"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
        <motion.rect
          x="160"
          y="165"
          width="20"
          height="30"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        />
      </svg>
    </div>
  )
}

// Beach Bum - Person with beach and waves
export function BeachBumIllustration({ className = "", width = "100%", height = "100%" }: IllustrationProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.path
          d="M100,200 Q150,170 200,200 Q250,230 300,200 L300,250 L100,250 Z"
          fill="#0EA5E9"
          opacity="0.3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d="M100,210 Q150,180 200,210 Q250,240 300,210 L300,250 L100,250 Z"
          fill="#0EA5E9"
          opacity="0.4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.path
          d="M100,220 Q150,190 200,220 Q250,250 300,220 L300,250 L100,250 Z"
          fill="#0EA5E9"
          opacity="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        <motion.path
          d="M100,250 L300,250 L300,270 L100,270 Z"
          fill="#FBBF24"
          opacity="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
        <motion.circle
          cx="200"
          cy="120"
          r="20"
          fill="#FBBF24"
          opacity="0.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        />
        <motion.circle
          cx="200"
          cy="170"
          r="15"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
        <motion.rect
          x="190"
          y="185"
          width="20"
          height="30"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        />
      </svg>
    </div>
  )
}

// Backpacker - Person with large backpack
export function BackpackerIllustration({ className = "", width = "100%", height = "100%" }: IllustrationProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.rect
          x="170"
          y="130"
          width="60"
          height="80"
          rx="10"
          fill="#22C55E"
          opacity="0.3"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 80, opacity: 0.3 }}
          transition={{ duration: 0.8 }}
        />
        <motion.rect
          x="180"
          y="210"
          width="40"
          height="10"
          rx="5"
          fill="#22C55E"
          opacity="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        <motion.rect
          x="185"
          y="120"
          width="30"
          height="10"
          rx="5"
          fill="#22C55E"
          opacity="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        />
        <motion.circle
          cx="200"
          cy="100"
          r="15"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
        <motion.rect
          x="190"
          y="115"
          width="20"
          height="30"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        />
        <motion.circle
          cx="160"
          cy="160"
          r="8"
          fill="#22C55E"
          opacity="0.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        />
        <motion.circle
          cx="240"
          cy="160"
          r="8"
          fill="#22C55E"
          opacity="0.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        />
      </svg>
    </div>
  )
}

// Foodie Traveler - Person with food and utensils
export function FoodieTravelerIllustration({ className = "", width = "100%", height = "100%" }: IllustrationProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.circle
          cx="200"
          cy="180"
          r="50"
          fill="#F59E0B"
          opacity="0.2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 0.8 }}
        />
        <motion.circle
          cx="200"
          cy="180"
          r="40"
          fill="#F59E0B"
          opacity="0.3"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.rect
          x="170"
          y="120"
          width="5"
          height="40"
          fill="#F59E0B"
          opacity="0.5"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 40, opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        <motion.rect
          x="225"
          y="120"
          width="5"
          height="40"
          fill="#F59E0B"
          opacity="0.5"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 40, opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        />
        <motion.circle
          cx="200"
          cy="100"
          r="15"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
        <motion.rect
          x="190"
          y="115"
          width="20"
          height="30"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        />
      </svg>
    </div>
  )
}

// Aesthetic Adventurer - Person with camera and scenic views
export function AestheticAdventurerIllustration({
  className = "",
  width = "100%",
  height = "100%",
}: IllustrationProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.path
          d="M100,250 L150,180 L200,220 L250,150 L300,250 Z"
          fill="#EC4899"
          opacity="0.2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 0.8 }}
        />
        <motion.circle
          cx="150"
          cy="180"
          r="10"
          fill="#EC4899"
          opacity="0.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        <motion.circle
          cx="250"
          cy="150"
          r="10"
          fill="#EC4899"
          opacity="0.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        />
        <motion.rect
          x="170"
          y="150"
          width="60"
          height="40"
          rx="5"
          fill="#EC4899"
          opacity="0.3"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        <motion.circle
          cx="200"
          cy="170"
          r="10"
          fill="#EC4899"
          opacity="0.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
        <motion.circle
          cx="200"
          cy="110"
          r="15"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        />
        <motion.rect
          x="190"
          y="125"
          width="20"
          height="30"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        />
      </svg>
    </div>
  )
}

// Social Explorer - Multiple people together
export function SocialExplorerIllustration({ className = "", width = "100%", height = "100%" }: IllustrationProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.circle
          cx="160"
          cy="120"
          r="15"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.rect
          x="150"
          y="135"
          width="20"
          height="30"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <motion.circle
          cx="200"
          cy="110"
          r="15"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
        <motion.rect
          x="190"
          y="125"
          width="20"
          height="30"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
        <motion.circle
          cx="240"
          cy="120"
          r="15"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
        <motion.rect
          x="230"
          y="135"
          width="20"
          height="30"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        />
        <motion.circle
          cx="200"
          cy="180"
          r="50"
          fill="#3B82F6"
          opacity="0.2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        />
        <motion.path
          d="M160,180 Q200,220 240,180"
          stroke="#3B82F6"
          strokeWidth="3"
          opacity="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1, delay: 1 }}
        />
      </svg>
    </div>
  )
}

// Luxury Nomad - Person with luxury items but in natural setting
export function LuxuryNomadIllustration({ className = "", width = "100%", height = "100%" }: IllustrationProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.path
          d="M100,250 L200,150 L300,250 Z"
          fill="#8B5CF6"
          opacity="0.2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 0.8 }}
        />
        <motion.rect
          x="170"
          y="170"
          width="60"
          height="40"
          rx="5"
          fill="#8B5CF6"
          opacity="0.3"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.circle
          cx="240"
          cy="150"
          r="15"
          fill="#C4B5FD"
          opacity="0.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        <motion.circle
          cx="260"
          cy="170"
          r="10"
          fill="#C4B5FD"
          opacity="0.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        />
        <motion.circle
          cx="200"
          cy="110"
          r="15"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
        <motion.rect
          x="190"
          y="125"
          width="20"
          height="30"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        />
        <motion.path
          d="M180,160 Q200,140 220,160"
          stroke="#C4B5FD"
          strokeWidth="3"
          opacity="0.7"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 1, delay: 1.2 }}
        />
      </svg>
    </div>
  )
}

// Default illustration for any other traveler type
export function DefaultTravelerIllustration({ className = "", width = "100%", height = "100%" }: IllustrationProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.circle
          cx="200"
          cy="150"
          r="50"
          fill="#8B5CF6"
          opacity="0.2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 0.8 }}
        />
        <motion.circle
          cx="200"
          cy="150"
          r="30"
          fill="#8B5CF6"
          opacity="0.3"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.circle
          cx="200"
          cy="100"
          r="15"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        <motion.rect
          x="190"
          y="115"
          width="20"
          height="30"
          fill="#FFFFFF"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        />
        <motion.path
          d="M150,200 Q200,230 250,200"
          stroke="#8B5CF6"
          strokeWidth="3"
          opacity="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1, delay: 1 }}
        />
      </svg>
    </div>
  )
}

// Helper function to get the right illustration based on traveler type
export function getTravelerIllustration(travelerType: string, className = "") {
  // Map the traveler type to the appropriate illustration
  const illustrationMap: Record<string, string> = {
    // Original longer names for backward compatibility
    "Adventurous Explorer": "/travel-aesthetic-adventure-seeker.png",
    "Cultural Nomad": "/travel-aesthetic-cultural-nomad.png",
    "Luxury Traveler": "/travel-aesthetic-luxury-traveler.png",
    "Digital Explorer": "/travel-aesthetic-digital-explorer.png",
    "Urban Adventurer": "/travel-collage-gen-z.png",
    "Aesthetic Adventurer": "/travel-aesthetic-aesthetic-adventurer.png",
    "Social Explorer": "/travel-aesthetic-social-explorer.png",
    "Luxury Nomad": "/travel-aesthetic-luxury-wanderer.png",

    // New punchy names
    "Adventure Junkie": "/travel-aesthetic-adventure-seeker.png",
    "Culture Buff": "/travel-aesthetic-cultural-nomad.png",
    "Luxury Chaser": "/travel-aesthetic-luxury-traveler.png",
    "Digital Nomad": "/travel-aesthetic-digital-explorer.png",
    "City Slicker": "/travel-collage-gen-z.png",
    "Insta Wanderer": "/travel-aesthetic-aesthetic-adventurer.png",
    "Party Hopper": "/travel-aesthetic-social-explorer.png",
    "Zen Wanderer": "/travel-aesthetic-luxury-wanderer.png",

    // Chinese names
    文化達人: "/travel-aesthetic-cultural-nomad.png",
    奢華控: "/travel-aesthetic-luxury-traveler.png",
    數位游民: "/travel-aesthetic-digital-explorer.png",
    城市客: "/travel-collage-gen-z.png",
    網紅客: "/travel-aesthetic-aesthetic-adventurer.png",
    派對客: "/travel-aesthetic-social-explorer.png",
    禪意客: "/travel-aesthetic-luxury-wanderer.png",
  }

  // Default illustration if no match is found
  const defaultIllustration = "/wanderlust-collage.png"

  // Get the illustration path or use the default
  const illustrationPath = illustrationMap[travelerType] || defaultIllustration

  return (
    <Image
      src={illustrationPath || "/placeholder.svg"}
      alt={`${travelerType} illustration`}
      width={500}
      height={500}
      className={`object-cover ${className}`}
      priority
    />
  )
}

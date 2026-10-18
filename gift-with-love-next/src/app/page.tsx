"use client";

import React, { useState } from "react";
import AmbientBackground from "@/components/AmbientBackground";
import StickyHeader from "@/components/StickyHeader";
import HeroSection from "@/components/HeroSection";
import OccasionCloud from "@/components/OccasionCloud";
import RelationshipGrid from "@/components/RelationshipGrid";
import BespokeStepper from "@/components/BespokeStepper";
import GiftFinderForm, { GiftSearchParams } from "@/components/GiftFinderForm";
import LuxuryFooter from "@/components/LuxuryFooter";

export default function HomePage() {
  const [selectedRelationship, setSelectedRelationship] = useState<string>("mom");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("birthday");
  const [activeTab, setActiveTab] = useState<string>("find-gift");

  // Handler when user clicks an occasion chip in the cloud or hero
  const handleSelectOccasion = (occasionId: string) => {
    setSelectedOccasion(occasionId);
    document.getElementById("gift-discovery-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Handler when user clicks a relationship card in the grid
  const handleSelectRelationship = (relationshipId: string) => {
    setSelectedRelationship(relationshipId);
    document.getElementById("gift-discovery-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCustomExplore = () => {
    setActiveTab("custom-made");
    document.getElementById("custom-made-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* 1. Ambient Background (ThreeUI / 21st.dev style interactive canvas shader & mesh) */}
      <AmbientBackground />

      {/* 2. Sticky Glassmorphism Header */}
      <StickyHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="relative z-10 flex-1">
        {/* 3. Hero Section (Left editorial column + Right 3D tilt spotlight card) */}
        <HeroSection
          onFindGiftClick={() => {
            document.getElementById("gift-discovery-form")?.scrollIntoView({ behavior: "smooth" });
          }}
          onCustomMadeClick={handleCustomExplore}
          onQuickOccasionClick={handleSelectOccasion}
        />

        {/* 4. Interactive Occasion Pill Cloud ("What are you celebrating?") */}
        <OccasionCloud
          selectedOccasion={selectedOccasion}
          onSelectOccasion={handleSelectOccasion}
        />

        {/* 5. Relationship Grid ("Who are you gifting today?") */}
        <RelationshipGrid onSelectRelationship={handleSelectRelationship} />

        {/* 6. Bespoke Gifting Flow & Stepper ("Something one-of-a-kind?") */}
        <BespokeStepper onExploreCustom={handleCustomExplore} />

        {/* 7. Multi-step Gift Finder Form ("Find the Perfect Gift") */}
        <GiftFinderForm
          key={`${selectedRelationship}-${selectedOccasion}`}
          initialRelationship={selectedRelationship}
          initialOccasion={selectedOccasion}
          onDiscover={(data: GiftSearchParams) => {
            console.log("Searching gifts with params:", data);
          }}
        />
      </main>

      {/* Luxury Footer with Trust Pillars & Newsletter */}
      <LuxuryFooter />
    </div>
  );
}

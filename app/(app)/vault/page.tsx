"use client";

import { useState, useMemo, useCallback } from "react";
import {
  VaultHeader,
  VaultFilters,
  VaultGrid,
  VaultBulkActions,
} from "@/components/vault";
import { mockVaultStats, mockVaultSets } from "@/lib/mockdata";
import type { VaultViewMode } from "@/types/vault";

export default function VaultPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [themeFilter, setThemeFilter] = useState("All Themes");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<VaultViewMode>("grid");
  const [selectedSets, setSelectedSets] = useState<Set<string>>(new Set());

  const toggleSelect = useCallback((setNum: string) => {
    setSelectedSets((prev) => {
      const next = new Set(prev);
      if (next.has(setNum)) {
        next.delete(setNum);
      } else {
        next.add(setNum);
      }
      return next;
    });
  }, []);

  const filteredSets = useMemo(() => {
    return mockVaultSets.filter((set) => {
      const matchesSearch =
        !searchQuery ||
        set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        set.setNum.includes(searchQuery);
      const matchesStatus =
        statusFilter === "all" || set.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <main className="flex-1 flex flex-col min-h-0 stud-bg bg-fixed">
      <VaultHeader stats={mockVaultStats} onSearch={setSearchQuery} />

      <VaultFilters
        themeFilter={themeFilter}
        statusFilter={statusFilter}
        viewMode={viewMode}
        onThemeChange={setThemeFilter}
        onStatusChange={setStatusFilter}
        onViewModeChange={setViewMode}
      />

      <div className="flex-1 overflow-y-auto p-6 md:px-8 pb-20">
        <div className="mx-auto max-w-7xl">
          <VaultGrid
            sets={filteredSets}
            selectedSets={selectedSets}
            onToggleSelect={toggleSelect}
          />
        </div>
      </div>

      <VaultBulkActions selectedCount={selectedSets.size} />
    </main>
  );
}

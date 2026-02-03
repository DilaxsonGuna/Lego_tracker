"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  VaultHeader,
  VaultFilters,
  VaultGrid,
  VaultBulkActions,
} from "@/components/vault";
import { removeSetFromVault } from "./actions";
import type { VaultSet, VaultStats, VaultViewMode } from "@/types/vault";

interface VaultTheme {
  id: number;
  name: string;
}

interface VaultPageClientProps {
  initialSets: VaultSet[];
  stats: VaultStats;
  themes: VaultTheme[];
}

export function VaultPageClient({
  initialSets,
  stats,
  themes,
}: VaultPageClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [themeFilter, setThemeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<VaultViewMode>("grid");
  const [selectedSets, setSelectedSets] = useState<Set<string>>(new Set());
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

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

  const handleBulkRemove = useCallback(async () => {
    setIsRemoving(true);
    try {
      const results = await Promise.all(
        Array.from(selectedSets).map((setNum) => removeSetFromVault(setNum))
      );

      // Check for errors
      const errors = results.filter((result) => result.error);
      if (errors.length > 0) {
        errors.forEach((error) => {
          console.error("Failed to remove set:", error.error);
        });
      }

      // Clear selection and refresh data
      setSelectedSets(new Set());
      router.refresh();
    } catch (error) {
      console.error("Error removing sets:", error);
    } finally {
      setIsRemoving(false);
    }
  }, [selectedSets, router]);

  const filteredSets = useMemo(() => {
    return initialSets.filter((set) => {
      const matchesSearch =
        !searchQuery ||
        set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        set.setNum.includes(searchQuery);
      const matchesTheme =
        themeFilter === "all" || set.themeName === themeFilter;
      const matchesStatus =
        statusFilter === "all" || set.status === statusFilter;
      return matchesSearch && matchesTheme && matchesStatus;
    });
  }, [initialSets, searchQuery, themeFilter, statusFilter]);

  return (
    <main className="flex-1 flex flex-col min-h-0 stud-bg bg-fixed">
      <VaultHeader stats={stats} onSearch={setSearchQuery} />

      <VaultFilters
        themes={themes}
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

      <VaultBulkActions
        selectedCount={selectedSets.size}
        selectedSetNums={Array.from(selectedSets)}
        onRemove={handleBulkRemove}
        isRemoving={isRemoving}
      />
    </main>
  );
}

"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  riskFilter: string;
  onRiskFilterChange: (value: string) => void;
  conditionFilter: string;
  onConditionFilterChange: (value: string) => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  riskFilter,
  onRiskFilterChange,
  conditionFilter,
  onConditionFilterChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 bg-secondary pl-9 text-sm"
        />
      </div>
      <Select value={riskFilter} onValueChange={onRiskFilterChange}>
        <SelectTrigger className="h-10 w-full bg-secondary text-sm sm:h-9 sm:w-40">
          <SelectValue placeholder="Risk Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Risk Levels</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
          <SelectItem value="elevated">Elevated</SelectItem>
          <SelectItem value="moderate">Moderate</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>
      <Select value={conditionFilter} onValueChange={onConditionFilterChange}>
        <SelectTrigger className="h-10 w-full bg-secondary text-sm sm:h-9 sm:w-40">
          <SelectValue placeholder="Condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Conditions</SelectItem>
          <SelectItem value="depression">Depression</SelectItem>
          <SelectItem value="anxiety">Anxiety</SelectItem>
          <SelectItem value="both">Both</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

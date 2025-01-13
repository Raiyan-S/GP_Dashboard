import { LucideIcon } from 'lucide-react';

export interface NavItem {
  name: string;
  icon: LucideIcon;
  id: string;
}

export interface PerformanceData {
  round: number;
  accuracy: number;
  f1Score: number;
  loss: number;
  precision: number;
  recall: number;
}

export interface MetricOption {
  id: string;
  label: string;
  dataKey: keyof PerformanceData;
  color: string;
}

export interface ModelPrediction {
  class: string;
  confidence: number;
  imageUrl: string;
  details: {
    phase: string;
    imageType: string;
    abnormalities: string[];
    dimensions: {
      width: number;
      height: number;
    };
  };
}

export interface Client {
  id: string;
  name: string;
  institution: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export interface StatCard {
  value: number | string;
  label: string;
  icon: any;
  gradient: string;
  color?: string;
  format?: 'number' | 'currency' | 'percent';
}

@Component({
  selector: 'app-stats-cards',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './stats-cards.html',
  styleUrls: ['./stats-cards.scss']
})
export class StatsCards {
  @Input() stats: StatCard[] = [];

  formatValue(value: number | string, format?: string): string {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return `S/ ${value.toLocaleString()}`;
      case 'percent':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  }
}
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-featured-card',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './featured-card.html',
  styleUrls: ['./featured-card.scss']
})
export class FeaturedCard {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() icon: any;
  @Input() background: string = 'rgba(255, 255, 255, 0.15)';
}
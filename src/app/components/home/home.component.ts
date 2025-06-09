import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    businessResults: any[] = [];

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.searchService.searchResults$.subscribe(results => {
      this.businessResults = results;
    });
  }
}

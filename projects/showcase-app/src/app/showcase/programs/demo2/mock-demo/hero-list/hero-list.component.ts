import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dw-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.css']
})
export class ShowcaseHeroListComponent implements OnInit {
  listData: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {

  }

  getHeroes(): void {
    const body = {
      params: {
        name: 'ind'
      }
    };
    this.http.post('showcase/Hero/getHeroes', body).subscribe(
      data => {
        this.listData = data;
      }
    );
  }

}

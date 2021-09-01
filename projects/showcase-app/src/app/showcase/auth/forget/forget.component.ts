import { Component, Inject, OnInit } from '@angular/core';
import { Logo_Path } from '@webdpt/framework/config';
import { IDwForgetverificationType } from '@webdpt/framework/account';


@Component({
  selector: 'app-showcase-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ShowcaseForgetComponent implements OnInit {
  verificationType: Array<IDwForgetverificationType> = [];

  constructor(
    @Inject(Logo_Path) public dwLogoPath: string
  ) { }

  ngOnInit(): void {
    this.verificationType = [
      IDwForgetverificationType.EMAIL,
      IDwForgetverificationType.MOBILEPHONE
    ];
  }

}

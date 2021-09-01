import { Component, Inject, OnInit } from '@angular/core';
import { Logo_Path } from '@webdpt/framework/config';
import { DW_SYSTEM_CONFIG } from '@webdpt/framework/config';

@Component({
  selector: 'app-showcase-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class ShowcaseLoginComponent implements OnInit {
  dwVersion = DW_SYSTEM_CONFIG.dwVersion ? DW_SYSTEM_CONFIG.dwVersion.replace(/\.[^.]*$/, '') : '';
  constructor(
    @Inject(Logo_Path) public dwLogoPath: string,
  ) { }

  ngOnInit(): void { }

}

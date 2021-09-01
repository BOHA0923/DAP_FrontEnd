import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DwRoutingMessageService } from '@webdpt/components/routing-message';
import { DwMessageService } from 'ng-quicksilver/message';

@Component({
  selector: 'app-dw-showcase-single-page-batch',
  templateUrl: './single-page-batch.component.html',
  styleUrls: ['./single-page-batch.component.css']
})
export class ShowcaseSinglePageBatchComponent implements OnInit {

  validateForm: FormGroup;
  messages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dwMessage: DwRoutingMessageService,
    private DwMessage: DwMessageService
  ) { }

  submitForm(): void {
    for (const id in this.messages) {
      if (this.messages.hasOwnProperty(id)) {
        this.DwMessage.success(this.messages[id]);
      }
    }
    this.validateForm.controls.message.setValue('');
    this.messages.splice(0);
  }

  addMessage(): void {
    this.dwMessage.add(this.validateForm.controls.message.value);
    this.messages.push(this.validateForm.controls.message.value);
    this.validateForm.controls.message.setValue('');
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      message: [null, [Validators.required]]
    });
  }

  getFormControl(name: string): any {
    return this.validateForm.controls[name];
  }

}

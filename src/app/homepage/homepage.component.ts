import {Component, inject, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-homepage',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  runnerForm: any;
  lapsForm: any;
  laps: number = JSON.parse(<string>window.localStorage.getItem("laps"));
  runnerList: any = JSON.parse(<string>window.localStorage.getItem("runners"));
  finishedRunners: any = JSON.parse(<string>window.localStorage.getItem("finishedRunners"));
  lapsSet: boolean = JSON.parse(<string>window.localStorage.getItem("lapsSet"));
  private modalService = inject(NgbModal);

  constructor(private formBuilder: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.runnerForm = this.formBuilder.group({
      number: ['', [Validators.required]]
    });
    this.lapsForm = this.formBuilder.group({
      laps: [this.laps, [Validators.required]]
    });
    if(this.runnerList === null){
      this.runnerList = [];
    }
    if(this.finishedRunners === null){
      this.finishedRunners = [];
    }
  }

  setLaps(): void {
    this.laps = +this.lapsForm.controls["laps"].value;
    window.localStorage.setItem("laps", JSON.stringify(this.laps));
    if(this.lapsSet && this.runnerList.length > 0){
      this.runnerList.forEach((runner: { number: string, laps: number; }) =>  runner.laps = this.laps);
      window.localStorage.setItem("runners", JSON.stringify(this.runnerList));
      this.finishedRunners = [];
      window.localStorage.setItem("finishedRunners", JSON.stringify(this.finishedRunners));
    }
    this.lapsSet = true
    window.localStorage.setItem("lapsSet", JSON.stringify(this.lapsSet));

  }

  submitForm(): void {
    if (this.runnerForm?.valid) {
      let numberToAdd= this.runnerForm.controls['number'].value
      if (!this.runnerList.some((el: { number: void; }) => el.number === numberToAdd)){
        this.runnerList.push({number: numberToAdd, laps: this.laps});
      }
      this.runnerList.sort((a: { number: number; }, b: { number: number; }) => (a.number < b.number ? -1 : 1));
      window.localStorage.setItem("runners", JSON.stringify(this.runnerList));
      this.runnerForm.controls['number'].setValue();
    }
  }

  removeRunner(index: number): void {
    this.runnerList.splice(index, 1);
    window.localStorage.setItem("runners", JSON.stringify(this.runnerList));
  }

  resetRunners(){
    this.runnerList = [];
    window.localStorage.setItem("runners", JSON.stringify(this.runnerList));
    this.finishedRunners = [];
    window.localStorage.setItem("finishedRunners", JSON.stringify(this.finishedRunners));
    this.lapsSet = false
    window.localStorage.setItem("lapsSet", JSON.stringify(this.lapsSet));
    this.laps = 7
    window.localStorage.setItem("laps", JSON.stringify(this.laps));
    this.modalService.dismissAll();
  }

  startCounter () {
    this.router.navigateByUrl('/counter');
  };


  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
  }

}

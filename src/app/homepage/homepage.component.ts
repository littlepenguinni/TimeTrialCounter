import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  runnerForm: any;
  runnerList: any = JSON.parse(<string>window.localStorage.getItem("runners"));
  finishedRunners: any = JSON.parse(<string>window.localStorage.getItem("finishedRunners"));

  constructor(private formBuilder: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.runnerForm = this.formBuilder.group({
      number: ['', [Validators.required]]
    });
    if(this.runnerList === null){
      this.runnerList = [];
    }
    if(this.finishedRunners === null){
      this.finishedRunners = [];
    }
  }

  submitForm(): void {
    if (this.runnerForm?.valid) {
      let numberToAdd= this.runnerForm.controls['number'].value
      if (!this.runnerList.some((el: { number: void; }) => el.number === numberToAdd)){
        this.runnerList.push({number: numberToAdd, laps: 7});
      }
      this.runnerList.sort((a: { number: number; }, b: { number: number; }) => (a.number < b.number ? -1 : 1));
      window.localStorage.setItem("runners", JSON.stringify(this.runnerList));
      this.runnerForm.reset();
    }
  }

  removeRunner(index: number): void {
    this.runnerList.splice(index, 1);
  }

  resetRunners(){
    this.runnerList = [];
    window.localStorage.setItem("runners", JSON.stringify(this.runnerList));
    this.finishedRunners = [];
    window.localStorage.setItem("finishedRunners", JSON.stringify(this.finishedRunners));
  }

  startCounter () {
    this.router.navigateByUrl('/counter');
  };
}

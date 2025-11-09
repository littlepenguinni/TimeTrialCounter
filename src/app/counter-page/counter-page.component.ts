import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-counter-page',
  imports: [CommonModule],
  templateUrl: './counter-page.component.html',
  styleUrl: './counter-page.component.scss'
})
export class CounterPageComponent  implements OnInit{

  constructor(private router: Router) {
  }
  clickTimer: any;
  runnerList: any = JSON.parse(<string>window.localStorage.getItem("runners"));
  finishedRunners: any = JSON.parse(<string>window.localStorage.getItem("finishedRunners"));



  ngOnInit(): void {
    console.log(this.runnerList);
    if(this.runnerList === null){
      this.runnerList = [];
    }
    if(this.finishedRunners === null){
      this.finishedRunners = [];
    }
  }

  singleClick(runnerToUpdate: { number: number; laps: number; }){
    this.clickTimer = setTimeout( () => {this.completeLap(runnerToUpdate);}, 300);
  }

  doubleClick(runnerToUpdate: { number: number; laps: number; }){
    clearTimeout(this.clickTimer);
    this.clickTimer = undefined;
    this.incrementLap(runnerToUpdate);
  }

  completeLap(runnerToUpdate:  { number: number; laps: number }){
    if (!this.clickTimer) return;
    this.runnerList = this.runnerList.map((runner: { number: number; laps: number; }) => {
      if (runner.number === runnerToUpdate.number) {
        if(runnerToUpdate.laps > 1){
          return {...runner, laps: runner.laps - 1};
        }
        else {
          // Only push to finishedRunners if the runner is not already there
          const alreadyFinished = this.finishedRunners.some(
            (finishedRunner: { number: number }) => finishedRunner.number === runner.number
          );
          if (!alreadyFinished) {
            this.finishedRunners.push({ ...runner, laps: 0 });
          }
          return { ...runner, laps: 0 }; // Update laps to 0
        }
      }
      return runner;
    });
    window.localStorage.setItem("runners", JSON.stringify(this.runnerList));
    window.localStorage.setItem("finishedRunners", JSON.stringify(this.finishedRunners));
  }

  incrementLap(runnerToUpdate:  { number: number; laps: number }){
    clearTimeout(this.clickTimer);
    this.clickTimer = undefined;

    if(runnerToUpdate.laps === 0) {
      return this.incrementLapFinished(runnerToUpdate)
    }

    this.runnerList = this.runnerList.map((runner: { number: number; laps: number; }) => {
      if (runner.number === runnerToUpdate.number) {
      return {...runner, laps: runner.laps + 1};
    }
    return runner;
  });
  window.localStorage.setItem("runners", JSON.stringify(this.runnerList));
  }

  incrementLapFinished(runnerToUpdate:  { number: number; laps: number }){
    clearTimeout(this.clickTimer);
    this.clickTimer = undefined;

    this.runnerList = this.runnerList.map((runner: { number: number; laps: number; }) => {
      if (runner.number === runnerToUpdate.number) {
        return {...runner, laps: runner.laps + 1};
      }
      return runner;
    });
    const index = this.finishedRunners.findIndex(
      (runner: { number: number; laps: number; }) => runner.number === runnerToUpdate.number
    );
    //Remove from finished runners if going from 0 to 1 laps
    this.finishedRunners.splice(index, 1);
    window.localStorage.setItem("runners", JSON.stringify(this.runnerList));
    window.localStorage.setItem("finishedRunners", JSON.stringify(this.finishedRunners));
  }

  home() {
    this.router.navigateByUrl('/');
  };

}

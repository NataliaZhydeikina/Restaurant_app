import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-reg-btns',
  templateUrl: './log-reg-btns.component.html',
  styleUrls: ['./log-reg-btns.component.scss']
})
export class LogRegBtnsComponent implements OnInit {


	isRegVisible: false;
	isLogVisible: false;

  constructor() { }

  ngOnInit() {
  }

}

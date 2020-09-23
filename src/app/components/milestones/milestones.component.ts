import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-milestones",
  templateUrl: "./milestones.component.html",
  styleUrls: ["./milestones.component.scss"],
})
export class MilestonesComponent implements OnInit {
  constructor() {}

  @Input() MilestoneArr = [];

  ngOnInit() {}

  isDateBeforeToday(date) {
    return new Date(date) < new Date(new Date());
  }
}

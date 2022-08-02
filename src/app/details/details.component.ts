import {Component, OnInit} from '@angular/core';
import {AppService, Links} from "../app.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-details',
  providers: [AppService],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.sass']
})
export class DetailsComponent implements OnInit {
  dataSource: any | undefined;

  constructor(private appService: AppService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getDetails(params['agency_id']);
    });
  }

  private getDetails(agency_id: string) {
    this.appService.getDetailsData(`https://api.foia.gov/api/agency_components/${agency_id}`)
      .subscribe({
        next: (data: any) => {
          this.dataSource = Object.keys(data.data.relationships)
          console.log(this.dataSource)
        }, // success path
        error: error => console.log(error), // error path
      });
  }
}

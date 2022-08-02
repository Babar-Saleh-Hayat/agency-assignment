import {Component, OnInit} from '@angular/core';
import {Address, Api, AppService, Attribute, Links, TableData} from "../app.service";

@Component({
  selector: 'app-dashboard',
  providers: [AppService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  error: any;
  displayedColumns: string[] = ['title', 'website', 'address'];
  dataSource: any | undefined;
  links: Links | undefined;
  pageLength: number = 10

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.initialLoad();
  }

  showTable(href: string) {
    this.appService.getApiData(href)
      .subscribe({
        next: (data: Api) => {
          this.dataSource = this.buildDataSource(data.data)
          this.links = data.links
        }, // success path
        error: error => this.error = error, // error path
      });
  }

  updateNoOfItems($event: number) {
    this.pageLength = $event
    this.initialLoad();
  }

  private buildDataSource(data: TableData[]) {
    return data.map((row: TableData) => {
      const attributes: Attribute = row.attributes
      const address: Address | null = attributes.submission_address

      return {
        link: row.links.self.href.substring(43),
        title: attributes.title + (attributes.abbreviation ? ` (${attributes.abbreviation})` : ''),
        address: this.getAddress(address),
        website: attributes.website?.uri,
        id: row.id
      }
    });
  }

  private getAddress(address: Address | null) {
    if (!address) return null;

    return `${address.address_line1}, ${address.address_line2}, ${address.locality}, ${address.administrative_area} ${address.postal_code}, ${address.country_code}`;
  }

  private initialLoad() {
    this.showTable(
      `https://api.foia.gov/api/agency_components?&fields[agency_component]=title,abbreviation,website,submission_address&page[limit]=${this.pageLength}`
    )
  }

}

import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

import { ListingsService } from "@app/services/listings.service";
import { AuthService } from "@app/services/auth.service";
import { Listing } from "@app/interfaces/listing";
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
declare var $: any;

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {

  searchParams: FormGroup;

  constructor(
    public ListingsService: ListingsService,
    public AuthService: AuthService,
    private location: Location,
    private fb: FormBuilder,
  ) {}

  resultsArr: Listing[];
  resultsCount: string;
  resultsInputString: string = "Everything";
  resultsCatString: string[] = ["All interests"];
  resultsLocString: string[] = ["All locations"];
  searchInput: string;
  catInput: string[];
  locInput: string[];

  locationList = [
    {
      name: "North",
      group: [
        "Admiralty",
        "Kranji",
        "Woodlands",
        "Sembawang",
        "Yishun",
        "Yio Chu Kang",
        "Seletar",
        "Sengkang",
      ],
    },
    {
      name: "South",
      group: [
        "Holland",
        "Queenstown",
        "Bukit Merah",
        "Telok Blangah",
        "Pasir Panjang",
        "Sentosa",
        "Bukit Timah",
        "Newton",
        "Orchard",
        "City",
        "Marina South",
      ],
    },
    {
      name: "East",
      group: [
        "Serangoon",
        "Punggol",
        "Hougang",
        "Tampines",
        "Pasir Ris",
        "Loyang",
        "Simei",
        "Kallang",
        "Katong",
        "East Coast",
        "Macpherson",
        "Bedok",
        "Pulau Ubin",
        "Pulau Tekong",
      ],
    },
    {
      name: "West",
      group: [
        "Lim Chu Kang",
        "Choa Chu Kang",
        "Bukit Panjang",
        "Tuas",
        "Jurong East",
        "Jurong West",
        "Jurong Industrial Estate",
        "Bukit Batok",
        "Hillview",
        "West Coast",
        "Clementi",
      ],
    },
    {
      name: "Central",
      group: [
        "Thomson",
        "Marymount",
        "Sin Ming",
        "Ang Mo Kio",
        "Bishan",
        "Serangoon Gardens",
        "MacRitchie",
        "Toa Payoh",
      ],
    },
  ];
  categoryList = [
    {
      name: "Social",
      group: [
        "Health",
        "Marriage",
        "Education",
        "Mentorship",
        "Retirement",
        "Housing",
        "Rental Flats",
        "Family",
        "Gender",
        "Elderly",
        "Youth",
        "Youth At Risk",
        "Pre-School",
        "Race",
        "Language",
        "Science",
        "Art",
        "Sports",
        "Poverty",
        "Inequality",
      ],
    },
    {
      name: "Environment",
      group: ["Recycling", "Green", "Water", "Waste", "Food", "Growing"],
    },
    {
      name: "Economical",
      group: [
        "Finance",
        "Jobs",
        "Wage",
        "Upskill",
        "Technology ",
        "IT",
        "IoT 4.0",
        "Information",
        "Automation",
        "Online",
        "Digitalization",
      ],
    },
    {
      name: "Others",
      group: ["Productivity", "Innovation", "Research", "Manpower", "Design"],
    },
  ];

  popularSearchList = [
    "Project Kampong",
    "Rebuilding Homes",
    "YOUTH Mentorship Programme",
    "CommStart 2020",
  ];
  ngOnInit() {
    this.searchInput = this.location.getState()["name"] ? this.location.getState()["name"] : "";
    this.catInput = this.location.getState()["category"] ? this.location.getState()["category"] : [];
    this.locInput = this.location.getState()["location"] ? this.location.getState()["location"] : [];
    this.searchInitiated();
    this.searchParams = this.fb.group({
      nameParams: new FormControl(""),
      locationParams: new FormControl([]),
      categoryParams: new FormControl([])
    })
  }
  goBack() {
    this.location.back();
  }
  searchInitiated() {
    this.searchInput.trim();
    if (this.searchInput.length > 0 || this.catInput.length > 0 || this.locInput.length > 0) {
      const keywords = this.concatKeywords();
      console.log(keywords);
      this.ListingsService.getSearchResult(keywords).subscribe(
        (data) => {
          this.resultsArr = data["data"];
          this.resultsCount = data["data"].length;
          this.resultsInputString = this.searchInput.length > 0 ? this.searchInput : this.resultsInputString;
          this.resultsLocString = this.locInput.length > 0 ? this.locInput : this.resultsLocString;
          this.resultsCatString = this.catInput.length > 0 ? this.catInput : this.resultsCatString;

        }
      );
    }
  }
  
  concatKeywords() {
    const searchArray = this.searchInput.split(' ').filter(e => e.length > 0);;
    const resultArr = this.catInput.concat(this.locInput).concat(searchArray);
    let result = '';
    for (let i = 0; i < resultArr.length; i++) {
      result += resultArr[i];
      result += '&'
    }
    return result;
  }

  popularSearchClicked(value) {
    this.searchInput = value;
    this.searchInitiated();
  }
}

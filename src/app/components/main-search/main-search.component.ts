import { state } from '@angular/animations';
import { Component, OnInit, Input } from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { Router } from "@angular/router";
declare var $: any;

@Component({
    selector: "main-search",
    templateUrl: "./main-search.component.html",
    styleUrls: ["./main-search.component.scss"],
})
export class MainSearchComponent implements OnInit {

    searchParams: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router
        ) { }

    locationList = [
        {
            name: "North",
            group: [
            "Admirality",
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
        }
    ]

    ngOnInit() {
        this.searchParams = this.fb.group({
            nameParams: new FormControl(''),
            locationParams: [],
            categoryParams: []
        })
    }

    initiateSearch() {
        console.log(this.searchParams.value);
        this.router.navigate(["/search"], {
            state: {name: this.searchParams.value.nameParams}
        });
    }

}
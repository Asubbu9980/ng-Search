import { Component, OnInit } from '@angular/core';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'improved-search';

  public model: any

  jobTitles: string[] = [
    "Angular JS",
    "Angular Developer",
    "UX/UI developer",
    "Cloud Architect",
    "Cloud Computing Analyst",
    "Cloud Computing Architect",
    "Cloud Engineer",
    "Cloud Computing Manager",
    "Cloud Engineer - Public Trust",
    "Cloud Engineer - CI Polygraph",
    "Engineering Cloud Architect",
    "Architect Engineer Cloud",
    "Cloud Engineer - Full Scope Polygraph",
    "Cloud Testing",
    "Cloud Engineer Analyst",
    "Network Cloud Administrator",
    "Senior Cloud Engineer",
    "Closer",
    "Cloud",
    "Vice President Of Organization",
    "Vice President",
    "Human Resources",
    "Human Resource Manager",
    "Talent Acquisition",
    "Information Technology",
    "Technology VP",
    "Cheif Executive Officer",
    "Cheif Technology Officer",
    "Managing Director",
    "Delivery Manager",
    "Technical Delivery Manager",
    "Enterprise Architect",
    "Technical Architect"
  ]

  filteredTitles: string[] = []
  ordered_inclusive_results: any = []
  abbrevation_search_results: any = [];
  search_word_match_results: any

  constructor() {

  }

  ngOnInit(): void {

  }

  formatter = (result: string) => {
    // console.log(result)
    return result;
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((term) => {
        let termsArray = term.split(' ');
        // Remove empty spaces
        let temrmWordsArray = termsArray.filter((word: string) => word.trim() !== '')
        // console.log(temrmWordsArray)
        // console.log(`term -> ${term}`)
        if (term === '' && temrmWordsArray.length == 0) {
          // If user removes the search word
          return []
        } else {
          // If user enters multiple words
          this.abbrevation_search_results = [];
          this.ordered_inclusive_results = [];
          this.search_word_match_results = [];

          temrmWordsArray?.forEach((searchWord: string) => {
            this.jobTitles.forEach((role: string) => {
              // Abbrevation Search code.....
              let abbrevation = this.getAbbrevationOfRole(role);
              if (abbrevation.indexOf(searchWord.toLowerCase()) > - 1) {
                // console.log(`role: ${role} ::: ${abbrevation}`)
                this.abbrevation_search_results.push(role)
              }
            })

            // Boolean Inclusive Search code.....
            let filteredTitles = this.jobTitles.filter((v) => v.toLowerCase().indexOf(searchWord.trim().toLowerCase()) > -1)
            // console.log(`filteredTitles word: ${searchWord}`, filteredTitles)
            this.search_word_match_results.push(...filteredTitles)
            filteredTitles.forEach((role: string) => {
              let roleWordArray = role.split(' ').map(eachWord => eachWord.toLowerCase());
              let index = roleWordArray.indexOf(searchWord.toLowerCase())
              // let booleanIndex = role.toLowerCase().indexOf(searchWord.toLowerCase());
              // console.log(`role : ${role} :: index: ${index}`)
              // console.log(`role : ${role} :: booleanIndex: ${booleanIndex}`)
              if (index > -1) {
                if(!this.ordered_inclusive_results[index]) {
                  this.ordered_inclusive_results[index] = [];
                }
                this.ordered_inclusive_results[index].push(role);
                this.ordered_inclusive_results[index].sort()
              }
            })
          })
      
        }
        
        
        // console.log('ordered_inclusive_results', this.ordered_inclusive_results)
        // console.log('abbrevation_search_results', this.abbrevation_search_results)
        // console.log('search_word_match_results', this.search_word_match_results)
        let finalArray: any = [];
        this.ordered_inclusive_results?.forEach((arr: any) => {
          finalArray.push(...arr)
        });

        if (this.abbrevation_search_results && this.abbrevation_search_results.length > 0) {
          finalArray = finalArray.concat(this.abbrevation_search_results?.sort())
        }

        if(this.search_word_match_results && this.search_word_match_results.length > 0) {
          finalArray = finalArray.concat(this.search_word_match_results)
        }
        
        // console.log('---------------------------------')
        // console.log('finalArray -> ', finalArray)
        if (finalArray.length) {
          return [...new Set(finalArray)];
        } else {
          return [];
        }
        // return this.ordered_inclusive_results;
      },
      ),
    );


  getAbbrevationOfRole(role: string) {
    if (role == '') {
      return ''
    }
    var matches: any = role.match(/\b(\w)/g);
    var acronym = matches.join('').toLowerCase();
    return acronym;
  }

}

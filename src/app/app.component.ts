import { Component, OnInit } from '@angular/core';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'improved-search';

  public model: any

  jobTitles: string[] = [];
  usCities: string[] = [];

  ordered_inclusive_results: any = []
  abbrevation_search_results: any = [];
  search_word_match_results: any = [];
  exact_word_match_results: any = [];
  
  
  ordered_inclusive_cities_results: any = []
  abbrevation_search_cities_results: any = [];
  search_word_match_cities_results: any = []
  exact_word_match_cities_results: any = [];



  constructor(
    private ds: DataService,
  ) {

  }

  ngOnInit(): void {
    this.getRolesData();
    this.getCities();
  }

  getRolesData() {
    this.ds.getRoles().subscribe((res: any) => {
      this.jobTitles = res.data || []
    })
  }

  getCities() {
    this.ds.getCities().subscribe((res: any) => {
      this.usCities = res.data || []
    })
  }

  formatter = (result: string) => {
    return result;
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((term) => {
        let termsArray = term.split(' ');
        let searchTerm = term.trim();
        // Find exact word results 
        this.exact_word_match_results = this.jobTitles.filter((v) => v.toLowerCase() === searchTerm.trim().toLowerCase())
        // Remove empty spaces
        let temrmWordsArray = termsArray.filter((word: string) => word.trim() !== '')
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
                this.abbrevation_search_results.push(role)
              }
            })

            // Boolean Inclusive Search code.....
            let filteredTitles = this.jobTitles.filter((v) => v.toLowerCase().indexOf(searchWord.trim().toLowerCase()) > -1)
            this.search_word_match_results.push(...filteredTitles)
            filteredTitles.forEach((role: string) => {
              let roleWordArray = role.split(' ').map(eachWord => eachWord.toLowerCase());
              let index = roleWordArray.indexOf(searchWord.toLowerCase())
              if (index > -1) {
                if (!this.ordered_inclusive_results[index]) {
                  this.ordered_inclusive_results[index] = [];
                }
                this.ordered_inclusive_results[index].push(role);
                this.ordered_inclusive_results[index].sort()
              }
            })
          })

        }


        let finalArray: any = [];

        if(this.exact_word_match_results && this.exact_word_match_results.length > 0) {
          finalArray.push(...this.exact_word_match_results)
        }

        this.ordered_inclusive_results?.forEach((arr: any) => {
          finalArray.push(...arr)
        });

        
        if (this.search_word_match_results && this.search_word_match_results.length > 0) {
          finalArray = finalArray.concat(this.search_word_match_results)
        }
        
        if (this.abbrevation_search_results && this.abbrevation_search_results.length > 0) {
          finalArray = finalArray.concat(this.abbrevation_search_results?.sort())
        }

        if (finalArray.length) {
          return [...new Set(finalArray)];
        } else {
          return [];
        }
      },
      ),
    );

  citiesSearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((term) => {
        let termsArray = term.split(' ');
        let searchTerm = term.trim();
        // Find exact word results 
        this.exact_word_match_cities_results = this.usCities.filter((v) => v.toLowerCase() === searchTerm.trim().toLowerCase())
        // Remove empty spaces
        let temrmWordsArray = termsArray.filter((word: string) => word.trim() !== '')
        if (term === '' && temrmWordsArray.length == 0) {
          // If user removes the search word
          return []
        } else {
          // If user enters multiple words
          this.abbrevation_search_cities_results = [];
          this.ordered_inclusive_cities_results = [];
          this.search_word_match_cities_results = [];

          temrmWordsArray?.forEach((searchWord: string) => {
            this.usCities.forEach((city: string) => {
              // Abbrevation Search code.....
              let abbrevation = this.getAbbrevationOfRole(city);
              if (abbrevation.indexOf(searchWord.toLowerCase()) > - 1) {
                this.abbrevation_search_cities_results.push(city)
              }
            })

            // Boolean Inclusive Search code.....
            let filteredTitles = this.usCities.filter((v) => v.toLowerCase().indexOf(searchWord.trim().toLowerCase()) > -1)
            this.search_word_match_cities_results.push(...filteredTitles)
            filteredTitles.forEach((role: string) => {
              let roleWordArray = role.split(' ').map(eachWord => eachWord.toLowerCase());
              let index = roleWordArray.indexOf(searchWord.toLowerCase())
              if (index > -1) {
                if (!this.ordered_inclusive_cities_results[index]) {
                  this.ordered_inclusive_cities_results[index] = [];
                }
                this.ordered_inclusive_cities_results[index].push(role);
                this.ordered_inclusive_cities_results[index].sort()
              }
            })
          })

        }


        let finalArray: any = [];
        if(this.exact_word_match_cities_results && this.exact_word_match_cities_results.length > 0) {
          finalArray.push(...this.exact_word_match_cities_results)
        }

        this.ordered_inclusive_cities_results?.forEach((arr: any) => {
          finalArray.push(...arr)
        });

        
        if (this.search_word_match_cities_results && this.search_word_match_cities_results.length > 0) {
          finalArray = finalArray.concat(this.search_word_match_cities_results)
        }
       
        if (this.abbrevation_search_cities_results && this.abbrevation_search_cities_results.length > 0) {
          finalArray = finalArray.concat(this.abbrevation_search_cities_results?.sort())
        }

        if (finalArray.length) {
          return [...new Set(finalArray)];
        } else {
          return [];
        }
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

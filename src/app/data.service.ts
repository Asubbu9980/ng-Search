import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  exact_word_match_results: any = [];
  word_index_match_results: any = []
  ordered_inclusive_results: any = []
  abbrevation_search_results: any = [];
  search_word_match_results: any = [];


  constructor(
    private http: HttpClient
  ) { }


  getRolesData(term: string) {
    if (term === '') {
      return of([]);
    }

    let queryParms = '';
    const queryParmsObj = {
      pattern: term,
      type: '',
      ignoreRelevance: true
    }

    queryParms = this.getQueryParams(queryParmsObj)
    // let JOB_LIST_URL = `${environment.JOB_LIST_URL}${queryParms}`
    // let JOB_LIST_URL = `${environment.JOB_LIST_URL_LOCAL}` //Local node js server
    let JOB_LIST_URL = `${environment.JOB_LIST_URL_LOCAL_JSON}` // Local JSON file
    return this.http.get(JOB_LIST_URL).pipe(
      map((repsonse: any) => {
        // console.log(repsonse.body)
        let jobTItles = repsonse.body.map((p: any) => p.job_title)
        const filteredData = this.fiterData(term, jobTItles)
        return filteredData;
      })
    )
  }

  getCityData(term: string) {
    if (term === '') {
      return of([]);
    }

    let queryParms = '';
    const queryParmsObj = {
      pattern: term,
      type: '',
      ignoreRelevance: true
    }

    queryParms = this.getQueryParams(queryParmsObj)
    // let JOB_LIST_URL = `${environment.JOB_LIST_URL}${queryParms}`
    // let CITIES_LIST_URL = `${environment.CITIES_LIST_URL_LOCAL}` //Local node js server
    let CITIES_LIST_URL = `${environment.CITIES_LIST_URL_LOCAL_JSON}` // Local JSON file
    return this.http.get(CITIES_LIST_URL).pipe(
      map((repsonse: any) => {
        // console.city_state(repsonse.body)
        let citiesList = repsonse.body.map((p: any) => p.city_state)
        const filteredData = this.fiterData(term, citiesList)
        return filteredData;
      })
    )
  }



  getRoles() {
    return this.http.get('./assets/roles.json');
  }

  getCities() {
    return this.http.get('./assets/cities.json');
  }

  fiterData(term: string, dataList: string[]) {
    let termsArray = term.split(' ');
    let searchTerm = term.trim();
    // Find exact word results 
    this.exact_word_match_results = dataList.filter((v) => (v.toLowerCase()) === searchTerm.trim().toLowerCase())

    // Indexed word match search code..
    this.word_index_match_results = [];
    let word_indexed_results = dataList.filter((v) => (v.toLowerCase()).indexOf(term) >= 0);
    let index_wise_results: any = []
    word_indexed_results?.forEach((v) => {
      let index = (v.toLowerCase()).indexOf(term)
      if (index >= 0) {
        // console.log(`index: ${index}: ${v}`)
        if (!index_wise_results[index]) {
          index_wise_results[index] = []
        }
        index_wise_results[index].push(v)
        index_wise_results[index].sort()
      }
    })
    if (index_wise_results && index_wise_results.length) {
      index_wise_results = index_wise_results.filter((roleArr: any) => roleArr.length > 0)
      // console.log('index_wise_results', index_wise_results)
      var merged_index_wise_results = index_wise_results.reduce((prev: any[], next: any) => {
        return prev.concat(next);
      }, []);
      // console.log('merged index_wise_results', merged_index_wise_results)
      this.word_index_match_results = merged_index_wise_results;
    }


    let temrmWordsArray = termsArray.filter((word: string) => word.trim() !== '')
    if (term === '' && temrmWordsArray.length == 0) {
      // If user removes the search word
      return []
    } else {
      // If user enters multiple words
      this.search_word_match_results = [];
      this.abbrevation_search_results = [];
      this.ordered_inclusive_results = [];

      temrmWordsArray?.forEach((searchWord: string) => {
        dataList.forEach((role: string) => {
          // Abbrevation Search code.....
          let abbrevation = this.getAbbrevationOfRole(role);
          if (abbrevation.indexOf(searchWord.toLowerCase()) > - 1) {
            this.abbrevation_search_results.push(role)
          }
        })
        // Boolean Inclusive Search code.....
        let filteredTitles = dataList.filter((v) => v.toLowerCase().indexOf(searchWord.trim().toLowerCase()) > -1)
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

    if (this.exact_word_match_results && this.exact_word_match_results.length > 0) {
      finalArray.push(...this.exact_word_match_results)
    }

    if (this.word_index_match_results && this.word_index_match_results.length > 0) {
      finalArray.push(...this.word_index_match_results)
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
  }

  getAbbrevationOfRole(role: string) {
    if (role == '') {
      return ''
    }
    var matches: any = role.match(/\b(\w)/g);
    var acronym = matches.join('').toLowerCase();
    return acronym;
  }

  getQueryParams(paramsObj: any) {
    let encodedStr = '?';
    encodedStr += new URLSearchParams(paramsObj).toString()
    return encodedStr;
  }


}

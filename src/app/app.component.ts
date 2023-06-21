import { Component, OnInit } from '@angular/core';
import { Observable, OperatorFunction, catchError, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
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



  constructor(
    private ds: DataService,
  ) {

  }

  ngOnInit(): void {
    // this.getRolesData();
    // this.getCities();
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
      switchMap((term) =>
        this.ds.getRolesData(term).pipe(
          catchError(() => {
            return of([]);
          }))
      ),
    );

  citiesSearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term) =>
        this.ds.getCityData(term).pipe(
          catchError(() => {
            return of([]);
          }))
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

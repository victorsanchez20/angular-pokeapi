import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retryWhen } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Pokemon {
 
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  getPokemons(): Observable<any> {
    return this.http.get(`${this.apiUrl}?limit=40`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retryWhen } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Pokemon {
 
  private readonly API_URL = 'https://pokeapi.co/api/v2/pokemon';

  private readonly API_URL_FORM = 'https://pokeapi.co/api/v2/pokemon-form';


  constructor(private http: HttpClient) {}

  getPokemons(): Observable<any> {
    return this.http.get(`${this.API_URL}?limit=40`);
  }

  getPokemonForm(id: number): Observable<any> {
    return this.http.get(`${this.API_URL_FORM}/${id}`);
  }
}

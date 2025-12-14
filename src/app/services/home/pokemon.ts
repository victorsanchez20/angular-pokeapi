import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, retryWhen } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Pokemon {
 
  private readonly API_URL = 'https://pokeapi.co/api/v2/pokemon';
  private readonly API_URL_FORM = 'https://pokeapi.co/api/v2/pokemon-form';

  // 1️⃣ Canal privado que guarda el último valor
  private pokemonSearchSource = new BehaviorSubject<any[]>([]);
// 2️⃣ Observable público (solo lectura)
  pokemonSearch$ = this.pokemonSearchSource.asObservable();


  constructor(private http: HttpClient) {}
  
  getPokemons(offset: number, limit: number): Observable<any> {
    return this.http.get(`${this.API_URL}?offset=${offset}&limit=${limit}`);
  }
  getPokemonForm(id: number): Observable<any> {
    return this.http.get(`${this.API_URL_FORM}/${id}`);
  }

  //  Método para EMITIR datos
    setPokemons(pokemons: any[]) {
    this.pokemonSearchSource.next(pokemons);
  }
}

/* Learn about pipe */
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { Pokemon } from './pokemon';

describe('Pokemon', () => {
  let service: Pokemon;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Pokemon);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getPokemons should GET the pokemon list with offset and limit', () => {
    let result: any;
    service.getPokemons(20, 10).subscribe((data) => (result = data));

    const req = httpMock.expectOne(
      'https://pokeapi.co/api/v2/pokemon?offset=20&limit=10',
    );
    expect(req.request.method).toBe('GET');

    const payload = { results: [{ name: 'pikachu' }] };
    req.flush(payload);

    expect(result).toEqual(payload);
  });

  it('getPokemonForm should GET a single pokemon form by id', () => {
    let result: any;
    service.getPokemonForm(25).subscribe((data) => (result = data));

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon-form/25');
    expect(req.request.method).toBe('GET');

    req.flush({ id: 25 });

    expect(result).toEqual({ id: 25 });
  });

  it('pokemonSearch$ should start with an empty array', () => {
    let value: any[] | undefined;
    service.pokemonSearch$.subscribe((data) => (value = data));

    expect(value).toEqual([]);
  });

  it('setPokemons should emit the given values through pokemonSearch$', () => {
    const emissions: any[][] = [];
    service.pokemonSearch$.subscribe((data) => emissions.push(data));

    const pokemons = [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }];
    service.setPokemons(pokemons);

    expect(emissions.at(-1)).toEqual(pokemons);
  });
});

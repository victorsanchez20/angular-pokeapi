import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';

import { Home } from './home';
import { Pokemon } from '../../services/home/pokemon';

const page = (names: string[]) =>
  names.map((name, index) => ({
    name,
    url: `https://pokeapi.co/api/v2/pokemon/${index + 1}/`,
  }));

const firstPage = page(['bulbasaur', 'ivysaur']);
const secondPage = page(['mew', 'mewtwo']);

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let searchSubject: BehaviorSubject<any[]>;
  let pokemonService: {
    getPokemons: ReturnType<typeof vi.fn>;
    setPokemons: ReturnType<typeof vi.fn>;
    pokemonSearch$: ReturnType<BehaviorSubject<any[]>['asObservable']>;
  };

  beforeEach(async () => {
    searchSubject = new BehaviorSubject<any[]>([]);

    pokemonService = {
      getPokemons: vi.fn((offset: number) =>
        of({ results: offset === 0 ? firstPage : secondPage }),
      ),
      setPokemons: vi.fn(),
      pokemonSearch$: searchSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [{ provide: Pokemon, useValue: pokemonService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load pokemons on init', () => {
    fixture.detectChanges();

    // Se dispara una vez directamente y otra por el valor inicial del BehaviorSubject.
    expect(pokemonService.getPokemons).toHaveBeenCalledWith(0, 40);
    expect(component.pokemons).toEqual(firstPage);
  });

  it('should render one card per pokemon', () => {
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.pokemon-card');
    expect(cards.length).toBe(firstPage.length);
    expect(cards[0].textContent).toContain('bulbasaur');
  });

  it('MorePokemon should increase the offset and load the next page', () => {
    fixture.detectChanges();

    component.MorePokemon();

    expect(component.offset).toBe(40);
    expect(pokemonService.getPokemons).toHaveBeenCalledWith(40, 40);
    expect(component.pokemons).toEqual(secondPage);
  });

  it('LessPokemon should not load anything when offset is below the limit', () => {
    fixture.detectChanges();
    pokemonService.getPokemons.mockClear();

    component.LessPokemon();

    expect(component.offset).toBe(0);
    expect(pokemonService.getPokemons).not.toHaveBeenCalled();
  });

  it('LessPokemon should decrease the offset and load the previous page', () => {
    fixture.detectChanges();
    component.offset = 40;
    pokemonService.getPokemons.mockClear();

    component.LessPokemon();

    expect(component.offset).toBe(0);
    expect(pokemonService.getPokemons).toHaveBeenCalledWith(0, 40);
  });

  it('should show search results emitted by the service', () => {
    fixture.detectChanges();

    searchSubject.next(page(['pikachu']));

    expect(component.pokemons).toEqual(page(['pikachu']));
  });

  it('should paginate the search results using the current offset', () => {
    fixture.detectChanges();
    component.offset = 40;

    const results = page(Array.from({ length: 60 }, (_, index) => `pokemon-${index}`));
    searchSubject.next(results);

    expect(component.pokemons).toEqual(results.slice(40, 80));
  });

  it('should reload the default list when the search is cleared', () => {
    fixture.detectChanges();
    pokemonService.getPokemons.mockClear();

    searchSubject.next([]);

    expect(pokemonService.getPokemons).toHaveBeenCalledWith(0, 40);
  });
});

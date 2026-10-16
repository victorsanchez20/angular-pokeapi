import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Header } from './header';
import { Pokemon } from '../../services/home/pokemon';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let pokemonService: {
    getPokemons: ReturnType<typeof vi.fn>;
    setPokemons: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    pokemonService = {
      getPokemons: vi.fn(),
      setPokemons: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [{ provide: Pokemon, useValue: pokemonService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggleGenDropdown should open the generations menu and close the types menu', () => {
    component.typeOpen = true;

    component.toggleGenDropdown();

    expect(component.genOpen).toBe(true);
    expect(component.typeOpen).toBe(false);
  });

  it('toggleTypeDropdown should open the types menu and close the generations menu', () => {
    component.genOpen = true;

    component.toggleTypeDropdown();

    expect(component.typeOpen).toBe(true);
    expect(component.genOpen).toBe(false);
  });

  it('selectGeneration should close the generations menu', () => {
    component.genOpen = true;

    component.selectGeneration(1);

    expect(component.genOpen).toBe(false);
  });

  it('selectType should close the types menu', () => {
    component.typeOpen = true;

    component.selectType('fire');

    expect(component.typeOpen).toBe(false);
  });

  it('searchOfPokemon should emit null when the term is empty', () => {
    component.searchOfPokemon('   ');

    expect(pokemonService.setPokemons).toHaveBeenCalledWith(null);
    expect(pokemonService.getPokemons).not.toHaveBeenCalled();
  });

  it('searchOfPokemon should filter the results by name and emit them', () => {
    pokemonService.getPokemons.mockReturnValue(
      of({
        results: [
          { name: 'pikachu' },
          { name: 'raichu' },
          { name: 'bulbasaur' },
        ],
      }),
    );

    component.searchOfPokemon('pika');

    expect(pokemonService.getPokemons).toHaveBeenCalledWith(0, 1500);
    expect(pokemonService.setPokemons).toHaveBeenCalledWith([{ name: 'pikachu' }]);
  });

  it('searchOfPokemon should be case insensitive', () => {
    pokemonService.getPokemons.mockReturnValue(
      of({ results: [{ name: 'charizard' }] }),
    );

    component.searchOfPokemon('CHAR');

    expect(pokemonService.setPokemons).toHaveBeenCalledWith([{ name: 'charizard' }]);
  });
});

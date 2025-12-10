import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Pokemon } from '../../services/home/pokemon';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [NgFor],
})
export class Home implements OnInit {

  pokemons: any[] = [];

  constructor(private pokemonService: Pokemon, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons() {
    this.pokemonService.getPokemons().subscribe((data: any) => {
      this.pokemons = data.results; 
      this.cd.detectChanges();
    });
  }
}
